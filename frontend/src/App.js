import React from 'react';
import {
  BrowserRouter as Router, Routes, Route,
} from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import Login from './screens/login/Login';
import Dashboard from './screens/dashboard/Dashboard';

function App() {
  Modal.setAppElement('#root');
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/*" element={<Login />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
