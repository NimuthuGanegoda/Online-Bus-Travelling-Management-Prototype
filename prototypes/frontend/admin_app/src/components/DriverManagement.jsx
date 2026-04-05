import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/drivers');
        setDrivers(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  if (loading) return <div>Loading driver roster...</div>;

  return (
    <div>
      <h1>👨‍✈️ Driver Roster</h1>
      <table className="elite-table">
        <thead>
          <tr>
            <th>Driver ID</th>
            <th>Full Name</th>
            <th>Contact Number</th>
            <th>Assigned Bus ID</th>
            <th>Authentication</th>
          </tr>
        </thead>
        <tbody>
          {drivers.length > 0 ? drivers.map(driver => (
            <tr key={driver.id}>
              <td>{driver.id}</td>
              <td style={{fontWeight: 'bold'}}>{driver.name}</td>
              <td>{driver.contact}</td>
              <td>{driver.busId || 'Unassigned'}</td>
              <td><span className="badge active">NFC Verified</span></td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{textAlign: 'center'}}>No drivers registered in the system.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverManagement;
