import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SL BusTrack</h2>
          <span className="subtitle">Admin Portal</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/buses" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>🚌 Fleet Control</NavLink>
          <NavLink to="/emergencies" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>🚨 Emergency Triage</NavLink>
          <NavLink to="/routes" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>🛤️ Route Network</NavLink>
          <NavLink to="/drivers" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>👨‍✈️ Driver Roster</NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="user-info">Logged in as Admin</div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
