import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import userAPI from '../../API/userAPI';

import Topbar from '../../components/topbar/Topbar';
import SideBar from '../../components/sideBar/SideBar';
import Main from './DashboardScreens/main/Main';
import Stock from './DashboardScreens/stock/Stock';

import './Dashboard.css';

function Dashboard() {
  const [flowers, setFlowers] = useState([]);
  const [showSideBar, setShowSidebar] = useState(false);

  const fetchUsers = async () => {
    const userData = await userAPI.getUser(localStorage.getItem('token'));

    return userData.user;
  };

  const fetchFlowers = async () => {
    const flowersData = await userAPI.getFlowers(localStorage.getItem('token'));

    setFlowers(flowersData);
  };

  useEffect(() => {
    (async () => {
      await fetchUsers();

      fetchFlowers();
    })();
  }, []);

  return (
    <div className="div_dashboard-container">
      <Topbar onClick={() => setShowSidebar((state) => !state)} />
      { showSideBar && <SideBar /> }
      <Routes>
        <Route path="stock" element={<Stock flowers={flowers} />} />
        <Route path="sell" element={<Stock flowers={flowers} />} />
        <Route path="" element={<Main flowers={flowers} />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
