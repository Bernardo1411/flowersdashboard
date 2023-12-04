import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import './SideBar.css';

function SideBar(props) {
  const { setShowSidebar } = props;

  return (
    <div className="div-sideBar" onMouseLeave={setShowSidebar}>
      <NavLink
        to=""
        className="navlink-navitens"
        end
      >
        <div className="div_button-sideBar">
          <img alt="menu" src="/assets/images/space_dashboard.png" style={{ marginRight: '7px' }} />
          Dashboard
        </div>
      </NavLink>
      <NavLink
        to="/dashboard/stock"
        className="navlink-navitens"
      >
        <div className="div_button-sideBar">
          <img alt="menu" src="/assets/images/deceased.png" style={{ marginRight: '7px' }} />
          Cadastrar flores
        </div>
      </NavLink>
      <NavLink
        to="/dashboard/sell"
        className="navlink-navitens"
      >
        <div className="div_button-sideBar">
          <img alt="menu" src="/assets/images/sell.png" style={{ marginRight: '7px' }} />
          Registrar Venda
        </div>
      </NavLink>
    </div>
  );
}

SideBar.propTypes = {
  setShowSidebar: PropTypes.func.isRequired,
};

export default SideBar;
