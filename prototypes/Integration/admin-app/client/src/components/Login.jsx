
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        onLogin();
        navigate('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <div className="header">
        <h1>SL Bus Track</h1>
        <h2>Admin Control Panel</h2>
        <p>Authorised Personnel Only</p>
      </div>

      <div className="input-container">
        <label htmlFor="username">Admin ID / Username</label>
        <div className="input-field">
          <span>[Admin]</span>
          <input
            type="text"
            id="username"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div className="input-container">
        <label htmlFor="password">Password</label>
        <div className="input-field">
          <span>[Lock]</span>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
