
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/buses'); // Route directly to dashboard on login
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', 
      backgroundColor: '#0b131a', color: '#fff'
    }}>
      <div style={{
        background: '#111c24', padding: '40px', borderRadius: '8px', 
        border: '1px solid #1e293b', width: '350px', textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
      }}>
        <h2 style={{color: '#38bdf8', marginBottom: '10px'}}>SL BusTrack</h2>
        <p style={{color: '#94a3b8', marginBottom: '30px'}}>Admin Authentication Portal</p>
        
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <input type="text" placeholder="Admin ID" style={{
            padding: '12px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff'
          }} required />
          <input type="password" placeholder="Password" style={{
            padding: '12px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff'
          }} required />
          <button type="submit" style={{
            padding: '12px', background: '#38bdf8', color: '#000', border: 'none', 
            borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px'
          }}>Authenticate</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
