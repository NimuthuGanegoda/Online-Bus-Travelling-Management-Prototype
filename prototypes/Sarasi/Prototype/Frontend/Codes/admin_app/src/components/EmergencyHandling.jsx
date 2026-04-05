import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyHandling = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/emergencies');
        setEmergencies(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch emergencies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmergencies();
  }, []);

  if (loading) return <div>Loading emergency triage data...</div>;

  return (
    <div>
      <h1>🚨 Emergency Triage</h1>
      <p style={{color: '#94a3b8', marginBottom: '20px'}}>Monitor and prioritize critical incidents across the fleet.</p>
      <table className="elite-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus ID</th>
            <th>Incident Report</th>
            <th>Timestamp</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {emergencies.length > 0 ? emergencies.map(em => (
            <tr key={em.id}>
              <td>{em.id}</td>
              <td>{em.busId}</td>
              <td style={{color: '#f87171'}}>{em.message}</td>
              <td>{new Date(em.timestamp).toLocaleString()}</td>
              <td><span className="badge high">HIGH</span></td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{textAlign: 'center'}}>No emergencies reported. All is calm.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmergencyHandling;
