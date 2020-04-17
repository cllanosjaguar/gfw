/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent, Fragment } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Button from 'components/button';

import InfoIcon from 'assets/icons/info.svg';

import './styles.scss';

class FieldWrapper extends PureComponent {
  static propTypes = {
    touched: PropTypes.bool,
    error: PropTypes.string,
    hidden: PropTypes.bool,
    active: PropTypes.bool,
    label: PropTypes.string,
    children: PropTypes.node,
    required: PropTypes.bool,
    infoClick: PropTypes.func,
    collapse: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.string
  };

  renderLabel = () => {
    const { name, label, required, infoClick, touched, error } = this.props;
    return (
      <Fragment>
        <label htmlFor={name}>{`${label || ''}${required ? ' *' : ''}`}</label>
        {
          infoClick && (
          <Button
            className="info-button"
            theme="theme-button-tiny theme-button-grey-filled square"
            onClick={e => {
                  e.preventDefault();
                  infoClick();
                }}
          >
            <InfoIcon className="info-icon" />
          </Button>
            )
        }
        {touched && error && <span>{error}</span>}
      </Fragment>
    );
  };

  render() {
    const {
      touched,
      error,
      hidden,
      active,
      children,
      collapse,
      value
    } = this.props;

    return (
      <div
        className={cx('c-form-field', { error: touched && error }, { active }, {
          hidden
        })}
      >
        {
          collapse ? (
            <details open={!!value}>
              <summary className="label">{this.renderLabel()}</summary>
              <div className="input-field">{children}</div>
            </details>
) : (
  <Fragment>
    <div className="label">{this.renderLabel()}</div>
    <div className="input-field">{children}</div>
  </Fragment>
)
        }
      </div>
    );
  }
}

export default FieldWrapper;
