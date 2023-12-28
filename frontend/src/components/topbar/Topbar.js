import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import CleanButton from '../cleanButton/CleanButton';

import './Topbar.css';

function Topbar(props) {
  const { onClick } = props;

  const navigate = useNavigate();

  const [openLogout, setOpenLogout] = useState(false);

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
        <CleanButton onClick={() => setOpenLogout((state) => !state)}>
          <img alt="menu" src="/assets/images/arrow_down.png" />
        </CleanButton>
        {
          openLogout && (
          <div className="logout_div-topbar">
            <CleanButton onClick={() => {
              sessionStorage.removeItem('token');
              navigate('/login');
            }}
            >
              Sair
            </CleanButton>
          </div>
          )
        }
      </div>
    </div>
  );
}

Topbar.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Topbar;
