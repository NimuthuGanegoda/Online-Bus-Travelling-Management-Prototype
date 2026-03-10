
import React from 'react';
import './Emergency.css';

const Emergency = () => {
  const emergencyAlerts = [
    { id: 1, busNo: 'B001', time: '10:30 AM', location: 'Location A' },
    { id: 2, busNo: 'B002', time: '11:00 AM', location: 'Location B' },
    { id: 3, busNo: 'B003', time: '11:15 AM', location: 'Location C' },
  ];

  return (
    <div className="emergency-container">
      <div className="emergency-list">
        <h2>Emergency Alerts</h2>
        <ul>
          {emergencyAlerts.map((alert) => (
            <li key={alert.id}>
              <span>Bus No: {alert.busNo}</span>
              <span>Time: {alert.time}</span>
              <span>Location: {alert.location}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="emergency-map">
        {/* Placeholder for the map */}
        <h2>Emergency Location</h2>
        <div className="map-placeholder">Map will be displayed here</div>
      </div>
    </div>
  );
}

export default Emergency;
