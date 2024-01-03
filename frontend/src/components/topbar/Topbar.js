import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import CleanButton from '../cleanButton/CleanButton';

import './Topbar.css';

function Topbar(props) {
  const { onClick } = props;

  const navigate = useNavigate();

  const [openLogout, setOpenLogout] = useState(false);

  const variants = {
    open: { y: 0, opacity: 1 },
    closed: { y: '-25%', opacity: 0 },
  };

  return (
    <div className="div-topbar">
      <div className="div_topbar-leftcontent">
        <CleanButton onClick={onClick}>
          <img alt="menu" src="/assets/images/menu.png" style={{ marginRight: '16px' }} />
        </CleanButton>
        <img alt="menu" src="/assets/images/logo_white.webp" />
      </div>
      <div className="div_topbar-rightcontent">
        <img alt="menu" src="/assets/images/profile.png" style={{ marginRight: '10px', borderRadius: '100%' }} />
        <CleanButton onClick={() => setOpenLogout((state) => !state)}>
          <img alt="menu" src="/assets/images/arrow_down.png" />
        </CleanButton>
        <AnimatePresence initial={false}>
          {
          openLogout && (
          <motion.div
            className="logout_div-topbar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{
              type: 'spring', stiffness: 50, damping: 10,
            }}
          >
            <CleanButton onClick={() => {
              sessionStorage.removeItem('token');
              navigate('/login');
            }}
            >
              Sair
            </CleanButton>
          </motion.div>
          )
        }
        </AnimatePresence>
      </div>
    </div>
  );
}

Topbar.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Topbar;
