import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/buses');
        setBuses(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch buses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  if (loading) return <div>Loading elite fleet data...</div>;

  return (
    <div>
      <h1>🚌 Fleet Control</h1>
      <table className="elite-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus Number</th>
            <th>Driver Name</th>
            <th>Assigned Route</th>
          </tr>
        </thead>
        <tbody>
          {buses.length > 0 ? buses.map(bus => (
            <tr key={bus.id}>
              <td>{bus.id}</td>
              <td style={{fontWeight: 'bold', color: '#38bdf8'}}>{bus.busNo}</td>
              <td>{bus.driverName}</td>
              <td>{bus.route}</td>
            </tr>
          )) : (
            <tr><td colSpan="4" style={{textAlign: 'center'}}>No buses registered yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BusManagement;
