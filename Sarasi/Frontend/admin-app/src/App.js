
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Crud from './components/CRUD/Crud';
import Emergency from './components/Emergency/Emergency';
import RouteC from './components/Route/Route';
import Driver from './components/Driver/Driver';
import Live from './components/Live/Live';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/">Bus Details</Link>
          <Link to="/emergency">Emergency</Link>
          <Link to="/route">Route</Link>
          <Link to="/driver">Driver</Link>
          <Link to="/live">Live</Link>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Crud />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/route" element={<RouteC />} />
            <Route path="/driver" element={<Driver />} />
            <Route path="/live" element={<Live />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
