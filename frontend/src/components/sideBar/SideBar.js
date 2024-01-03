import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

import './SideBar.css';

function SideBar(props) {
  const { showSideBar, setShowSidebar } = props;

  const variants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <AnimatePresence initial={false}>
      { showSideBar && (
      <motion.div
        className="div-sideBar"
        onMouseLeave={() => setShowSidebar(false)}
        initial="closed"
        animate="open"
        exit="closed"
        variants={variants}
        transition={{
          type: 'spring', stiffness: 100, damping: 30,
        }}
      >
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
      </motion.div>
      )}
    </AnimatePresence>
  );
}

SideBar.propTypes = {
  setShowSidebar: PropTypes.func.isRequired,
  showSideBar: PropTypes.bool.isRequired,
};

export default SideBar;
