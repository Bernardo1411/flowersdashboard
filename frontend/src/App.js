import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router, Routes, Route,
} from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import FadeLoader from 'react-spinners/FadeLoader';
import Login from './screens/login/Login';

const Dashboard = lazy(() => import('./screens/dashboard/Dashboard'));

function App() {
  Modal.setAppElement('#root');

  const override = {
    position: 'absolute',
    left: '50%',
    top: '50%',
  };

  return (
    <div className="App">
      <Router>
        <Suspense fallback={(
          <FadeLoader
            cssOverride={override}
            color="#1F5207"
          />
)}
        >
          <Routes>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/*" element={<Login />} />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
