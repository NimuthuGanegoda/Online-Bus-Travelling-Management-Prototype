
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>SL Bus Track</h2>
        <ul>
          <li><Link to="live-fleet">Live Fleet</Link></li>
          <li><Link to="route-management">Route Management</Link></li>
          <li><Link to="driver-management">Driver Management</Link></li>
          <li><Link to="bus-management">Bus Management</Link></li>
          <li><Link to="emergency-handling">Emergency Handling</Link></li>
          <li><Link to="passenger-complaints">Passenger Complaints</Link></li>
        </ul>
        <button onClick={onLogout}>Logout</button>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
