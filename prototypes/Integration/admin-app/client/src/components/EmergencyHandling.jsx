import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const EmergencyHandling = () => {
  const [sosRequests, setSosRequests] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchSosRequests = async () => {
      const { data, error } = await supabase
        .from('sos_requests')
        .select(`
          *,
          buses ( bus_no )
        `);

      if (error) {
        console.error('Error fetching SOS requests:', error);
      } else {
        setSosRequests(data);
      }
    };

    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*');

      if (error) {
        console.error('Error fetching alerts:', error);
      } else {
        setAlerts(data);
      }
    };

    fetchSosRequests();
    fetchAlerts();
  }, []);

  return (
    <div>
      <h1>Emergency Handling</h1>

      <h2>SOS Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Bus No</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {sosRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.buses?.bus_no || 'Unknown'}</td>
              <td>{request.message}</td>
              <td>{request.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Alerts</h2>
      <table>
        <thead>
          <tr>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td>{alert.message}</td>
              <td>{alert.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmergencyHandling;
