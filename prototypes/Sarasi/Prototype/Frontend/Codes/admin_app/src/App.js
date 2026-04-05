import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BusManagement from './components/BusManagement';
import EmergencyHandling from './components/EmergencyHandling';
import RouteManagement from './components/RouteManagement';
import DriverManagement from './components/DriverManagement';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="buses" replace />} />
          <Route path="buses" element={<BusManagement />} />
          <Route path="emergencies" element={<EmergencyHandling />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="drivers" element={<DriverManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
