import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { isParent } from 'utils/dom';
import { track } from 'app/analytics';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import settingsIcon from 'assets/icons/settings.svg?sprite';
import WidgetSettings from '../widget-settings';

import './styles.scss';

class WidgetSettingsButton extends PureComponent {
  static propTypes = {
    widget: PropTypes.string,
    settingsConfig: PropTypes.array,
    loading: PropTypes.bool,
    active: PropTypes.bool,
    preventCloseSettings: PropTypes.bool,
    handleChangeSettings: PropTypes.func.isRequired,
    handleShowInfo: PropTypes.func.isRequired,
    shouldSettingsOpen: PropTypes.bool,
    toggleSettingsMenu: PropTypes.func
  };

  state = {
    tooltipOpen: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.shouldSettingsOpen !== this.props.shouldSettingsOpen) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ tooltipOpen: this.props.shouldSettingsOpen });
    }
  }

  render() {
    const {
      settingsConfig,
      loading,
      preventCloseSettings,
      handleChangeSettings,
      handleShowInfo,
      widget,
      active,
      shouldSettingsOpen,
      toggleSettingsMenu
    } = this.props;
    const { tooltipOpen } = this.state;
    return (
      <Tooltip
        className={cx('c-widget-settings-button', {
          'widget-settings-btn-active': active
        })}
        theme="widget-tooltip-theme light"
        position="bottom-right"
        offset={-95}
        trigger="click"
        interactive
        onRequestClose={() => {
          const isTargetOnTooltip = isParent(
            this.widgetSettingsRef,
            this.widgetSettingsRef.evt
          );
          this.widgetSettingsRef.clearEvt();
          if (!preventCloseSettings && !isTargetOnTooltip) {
            if (toggleSettingsMenu) {
              toggleSettingsMenu();
            } else this.setState({ tooltipOpen: false });
          }
        }}
        onShow={() => {
          this.setState({ tooltipOpen: true });
          track('openWidgetSettings', {
            label: widget
          });
        }}
        arrow
        useContext
        open={tooltipOpen}
        html={
          <WidgetSettings
            ref={node => {
              this.widgetSettingsRef = node;
            }}
            settingsConfig={settingsConfig}
            loading={loading}
            handleChangeSettings={handleChangeSettings}
            handleShowInfo={handleShowInfo}
            showYears={shouldSettingsOpen}
          />
        }
      >
        <Button
          theme="theme-button-small square"
          tooltip={{ text: 'Filter and customize the data' }}
        >
          <Icon icon={settingsIcon} className="settings-icon" />
        </Button>
      </Tooltip>
    );
  }
}

export default WidgetSettingsButton;
