import { createThunkAction } from 'utils/redux';
import { getLocationFromData } from 'utils/format';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setMainMapSettings = createThunkAction(
  'setMainMapSettings',
  change => () =>
    setComponentStateToUrl({
      key: 'mainMap',
      change
    })
);

export const setMainMapAnalysisView = createThunkAction(
  'setMainMapAnalysisView',
  ({ data, layer }) => (dispatch, getState) => {
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};
    const { query, type } = getState().location || {};
    const { map, mainMap } = query || {};

    // get location payload based on layer type
    let payload = {};
    if (data) {
      if (analysisEndpoint === 'admin') {
        payload = {
          type: 'country',
          ...getLocationFromData(data)
        };
      } else if (analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid)) {
        payload = {
          type: analysisEndpoint,
          adm0: wdpaid || cartodb_id
        };
      } else if (cartodb_id && tableName) {
        payload = {
          type: 'use',
          adm0: tableName,
          adm1: cartodb_id
        };
      }
    }

    if (payload && payload.adm0) {
      dispatch({
        type,
        payload,
        query: {
          ...query,
          map: {
            ...map,
            canBound: true
          },
          mainMap: {
            ...mainMap,
            showAnalysis: true
          }
        }
      });
    }
  }
);

export const setDrawnGeostore = createThunkAction(
  'setDrawnGeostore',
  geostoreId => (dispatch, getState) => {
    const { query, type } = getState().location || {};
    const { map, mainMap } = query || {};
    dispatch({
      type,
      payload: {
        type: 'geostore',
        adm0: geostoreId
      },
      query: {
        ...query,
        map: {
          ...map,
          canBound: true,
          drawing: false
        },
        mainMap: {
          ...mainMap,
          showAnalysis: true
        }
      }
    });
  }
);
