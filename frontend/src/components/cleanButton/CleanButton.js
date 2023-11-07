import React from 'react';
import PropTypes from 'prop-types';

function CleanButton(props) {
  const {
    children, onClick,
  } = props;

  const buttonComponent = (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        outline: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </button>
  );

  return buttonComponent;
}

CleanButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CleanButton;
