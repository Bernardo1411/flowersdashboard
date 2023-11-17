import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import userAPI from '../../API/userAPI';

import Topbar from '../../components/topbar/Topbar';
import SideBar from '../../components/sideBar/SideBar';
import Main from './DashboardScreens/main/Main';
import Stock from './DashboardScreens/stock/Stock';

import './Dashboard.css';

function Dashboard() {
  const [flowers, setFlowers] = useState([]);
  const [showSideBar, setShowSidebar] = useState(false);
  const [user, setUser] = useState({});

  const fetchUsers = async () => {
    try {
      const userData = await userAPI.getUser(localStorage.getItem('token'));

      return userData.user;
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  const fetchFlowers = async () => {
    try {
      const flowersData = await userAPI.getFlowers(localStorage.getItem('token'));

      return setFlowers(flowersData);
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await fetchUsers();

      setUser(response);

      fetchFlowers();
    })();
  }, []);

  return (
    <div className="div_dashboard-container">
      <Topbar onClick={() => setShowSidebar((state) => !state)} />
      { showSideBar && <SideBar /> }
      <Routes>
        <Route path="stock" element={<Stock flowers={flowers} setFlowers={setFlowers} setUser={setUser} />} />
        <Route path="sell" element={<Stock flowers={flowers} setFlowers={setFlowers} setUser={setUser} />} />
        <Route path="" element={<Main flowers={flowers} user={user} />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
