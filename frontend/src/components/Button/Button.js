import React from 'react';
import PropTypes from 'prop-types';

import './Button.css';

function Button(props) {
  const {
    children, type, onClick, style, textStyle, icon,
  } = props;

  const buttonComponent = (
    <button
      className="button_button"
      type={type === 'button' ? 'button' : 'submit'}
      onClick={(e) => onClick(e)}
      style={style}
    >
      <p
        className="p_button"
        style={textStyle}
      >
        {children}
      </p>
      {!!icon && icon}
    </button>
  );

  return buttonComponent;
}

Button.defaultProps = {
  type: 'button',
  style: {},
  textStyle: {},
  icon: null,
};

Button.propTypes = {
  type: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  textStyle: PropTypes.shape({}),
  icon: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
  ]),
};

export default Button;
