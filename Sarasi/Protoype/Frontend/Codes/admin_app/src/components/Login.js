
import React from 'react';

const Login = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>
        <h2>Admin Login</h2>
        <form>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="username">Username</label><br />
            <input type="text" id="username" name="username" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">Password</label><br />
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
