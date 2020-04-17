import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import bbox from 'turf-bbox';
import { Popup as MapPopup } from 'react-map-gl';

import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown/dropdown-component';
import Card from 'components/ui/card';

import DataTable from './components/data-table';
import BoundarySentence from './components/boundary-sentence';
import AreaSentence from './components/area-sentence';

class Popup extends Component {
  static propTypes = {
    clearMapInteractions: PropTypes.func,
    setMapInteractionSelected: PropTypes.func,
    latlng: PropTypes.object,
    selected: PropTypes.object,
    interactions: PropTypes.array,
    tableData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    isBoundary: PropTypes.bool,
    isArea: PropTypes.bool,
    cardData: PropTypes.object,
    activeDatasets: PropTypes.array,
    onSelectBoundary: PropTypes.func,
    setMapSettings: PropTypes.func,
    zoomToShape: PropTypes.bool,
    buttons: PropTypes.array
  };

  componentDidUpdate(prevProps) {
    const { interactions, activeDatasets } = this.props;
    if (
      isEmpty(interactions) &&
      !isEqual(activeDatasets.length, prevProps.activeDatasets.length)
    ) {
      this.handleClose();
    }
  }

  handleClickZoom = selected => {
    const { setMapSettings } = this.props;
    const newBbox = bbox(selected.geometry);
    setMapSettings({ canBound: true, bbox: newBbox });
    this.setState({ open: false });
    this.handleClose();
  };

  handleClickAction = (selected, handleAction) => {
    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    handleAction({
      data,
      layer,
      geometry,
      isUse,
      isAdmin,
      isWdpa
    });

    this.handleClose();
  };

  // when clicking popup action the map triggers the interaction event
  // causing the popup to open again. this stops it for now.
  handleClose = () => {
    setTimeout(() => this.props.clearMapInteractions(), 300);
  };

  render() {
    const {
      tableData,
      cardData,
      latlng,
      interactions,
      selected,
      setMapInteractionSelected,
      clearMapInteractions,
      onSelectBoundary,
      setMapSettings,
      isBoundary,
      isArea,
      zoomToShape,
      buttons
    } = this.props;

    return latlng && latlng.lat && selected && !selected.data.cluster ? (
      <MapPopup
        latitude={latlng.lat}
        longitude={latlng.lng}
        onClose={clearMapInteractions}
        closeOnClick={false}
      >
        <div className="c-popup">
          {cardData ? (
            <Card
              className="popup-card"
              theme="theme-card-small"
              clamp={5}
              data={{
                ...cardData,
                buttons: cardData.buttons.map(
                  b =>
                    (b.text === 'ZOOM'
                      ? {
                        ...b,
                        onClick: () =>
                          setMapSettings({
                            canBound: true,
                            bbox: cardData.bbox
                          })
                      }
                      : b)
                )
              }}
            />
          ) : (
            <div className="popup-table">
              {interactions &&
                interactions.length > 1 && (
                <Dropdown
                  className="layer-selector"
                  theme="theme-dropdown-native"
                  value={selected}
                  options={interactions}
                  onChange={setMapInteractionSelected}
                  native
                />
              )}
              {selected &&
                interactions.length === 1 && (
                <div className="popup-title">{selected.label}</div>
              )}
              {isBoundary && (
                <BoundarySentence
                  selected={selected}
                  data={tableData}
                  onSelectBoundary={onSelectBoundary}
                />
              )}
              {isArea && (
                <AreaSentence
                  selected={selected}
                  data={tableData}
                  onSelectBoundary={onSelectBoundary}
                />
              )}
              {!isBoundary && !isArea && <DataTable data={tableData} />}
              <div className="popup-footer">
                {zoomToShape && (
                  <Button onClick={() => this.handleClickZoom(selected)}>
                    Zoom
                  </Button>
                )}
                {!zoomToShape &&
                  !selected.aoi &&
                  (buttons &&
                    buttons.map(p => (
                      <Button
                        key={p.label}
                        onClick={() => {
                          this.handleClickAction(selected, p.action);
                        }}
                      >
                        {p.label}
                      </Button>
                    )))}
              </div>
            </div>
          )}
        </div>
      </MapPopup>
    ) : null;
  }
}

export default Popup;
