import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/routes');
        setRoutes(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch routes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  if (loading) return <div>Loading route network...</div>;

  return (
    <div>
      <h1>🛤️ Route Network</h1>
      <table className="elite-table">
        <thead>
          <tr>
            <th>Route ID</th>
            <th>Route Name</th>
            <th>Description / Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {routes.length > 0 ? routes.map(route => (
            <tr key={route.id}>
              <td style={{fontWeight: 'bold'}}>{route.id}</td>
              <td style={{color: '#38bdf8'}}>{route.name}</td>
              <td>{route.description}</td>
              <td><span className="badge active">Operational</span></td>
            </tr>
          )) : (
            <tr><td colSpan="4" style={{textAlign: 'center'}}>No routes configured yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RouteManagement;
