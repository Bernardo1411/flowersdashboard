import React from 'react';
import { NavLink } from 'react-router-dom';

import './SideBar.css';

function SideBar() {
  return (
    <div className="div-sideBar">
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

export default SideBar;
