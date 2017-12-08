import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';

import './button-styles.scss';
import 'styles/themes/button/button-light.scss'; // eslint-disable-line
import 'styles/themes/button/button-small.scss'; // eslint-disable-line

const Button = props => {
  const { link, children, className, theme, disabled, onClick } = props;
  const classNames = `c-button ${theme || ''} ${className || ''}`;

  return link ? (
    <Link className={classNames} to={link}>
      {children}
    </Link>
  ) : (
    <button className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  link: PropTypes.string,
  theme: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

export default Button;
