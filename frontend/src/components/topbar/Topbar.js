import React from 'react';
import PropTypes from 'prop-types';

import CleanButton from '../cleanButton/CleanButton';

import './Topbar.css';

function Topbar(props) {
  const { onClick } = props;

  return (
    <div className="div-topbar">
      <div className="div_topbar-leftcontent">
        <CleanButton onClick={onClick}>
          <img alt="menu" src="/assets/images/menu.png" style={{ marginRight: '16px' }} />
        </CleanButton>
        <img alt="menu" src="/assets/images/logo_white.png" />
      </div>
      <div className="div_topbar-rightcontent">
        <img alt="menu" src="/assets/images/profile.png" style={{ marginRight: '10px', borderRadius: '100%' }} />
        <img alt="menu" src="/assets/images/arrow_down.png" />
      </div>
    </div>
  );
}

Topbar.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Topbar;
