import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import userAPI from '../../API/userAPI';

import Topbar from '../../components/topbar/Topbar';
import SideBar from '../../components/sideBar/SideBar';
import Main from './DashboardScreens/main/Main';
import Stock from './DashboardScreens/stock/Stock';
import Sell from './DashboardScreens/Sell/Sell';

import './Dashboard.css';

function Dashboard() {
  const [showSideBar, setShowSidebar] = useState(false);
  const [user, setUser] = useState({});

  const fetchUsers = async () => {
    try {
      const userData = await userAPI.getUser(sessionStorage.getItem('token'));

      return userData.user;
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await fetchUsers();

      setUser(response);
    })();
  }, []);

  return (
    <div className="div_dashboard-container">
      <Topbar onClick={() => setShowSidebar((state) => !state)} />
      <SideBar showSideBar={showSideBar} setShowSidebar={setShowSidebar} />
      <Routes>
        <Route path="stock" element={<Stock />} />
        <Route path="sell" element={<Sell />} />
        <Route path="" element={<Main user={user} />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
