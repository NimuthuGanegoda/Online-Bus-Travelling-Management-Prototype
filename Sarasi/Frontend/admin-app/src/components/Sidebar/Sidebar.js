
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, onLogout }) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <ul>
        <li>
          <Link to="/crud">CRUD</Link>
        </li>
        <li>
          <Link to="/emergency">Emergency</Link>
        </li>
        <li>
          <Link to="/route">Route</Link>
        </li>
        <li>
          <Link to="/live-fleet">Live Fleet</Link>
        </li>
        <li>
          <Link to="/rating">Rating</Link>
        </li>
      </ul>
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Sidebar;
