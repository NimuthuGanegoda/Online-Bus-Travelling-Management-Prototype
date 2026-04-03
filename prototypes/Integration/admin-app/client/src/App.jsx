import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LiveFleet from './components/LiveFleet';
import RouteManagement from './components/RouteManagement';
import DriverManagement from './components/DriverManagement';
import BusManagement from './components/BusManagement';
import EmergencyHandling from './components/EmergencyHandling';
import PassengerComplaints from './components/PassengerComplaints';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
          >
            <Route path="live-fleet" element={<LiveFleet />} />
            <Route path="route-management" element={<RouteManagement />} />
            <Route path="driver-management" element={<DriverManagement />} />
            <Route path="bus-management" element={<BusManagement />} />
            <Route path="emergency-handling" element={<EmergencyHandling />} />
            <Route path="passenger-complaints" element={<PassengerComplaints />} />
          </Route>
          <Route 
            path="*" 
            element={<Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
