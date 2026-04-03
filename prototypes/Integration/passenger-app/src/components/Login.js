
import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="passenger-login-page">
      <div className="login-container">
        <div className="header">
          <span className="bus-icon">🚌</span>
          <h1>SL BusTrack</h1>
          <p>Passenger Portal</p>
        </div>

        <div className="tabs">
          <button className="tab active">Login</button>
          <button className="tab">Register</button>
        </div>

        <div className="form-container">
          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input type="email" placeholder="Email" />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input type="password" placeholder="Password" />
            <span className="password-toggle">👁️</span>
          </div>

          <a href="#" className="forgot-password">Forgot Password?</a>

          <button className="login-button">LOGIN AS PASSENGER</button>

          <p className="register-link">
            Don't have an account? <a href="#">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
