import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const LiveFleet = () => {
  const [fleet, setFleet] = useState([]);

  useEffect(() => {
    const fetchFleet = async () => {
      const { data, error } = await supabase
        .from('location_logs')
        .select(`
          *,
          buses (
            bus_no,
            drivers ( name ),
            routes ( name )
          )
        `);

      if (error) {
        console.error('Error fetching fleet data:', error);
      } else {
        setFleet(data);
      }
    };

    fetchFleet();
  }, []);

  return (
    <div>
      <h1>Live Fleet</h1>
      <table>
        <thead>
          <tr>
            <th>Bus No</th>
            <th>Driver Name</th>
            <th>Route</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {fleet.map((bus) => (
            <tr key={bus.id}>
              <td>{bus.buses?.bus_no || 'Unknown'}</td>
              <td>{bus.buses?.drivers?.name || 'Unknown'}</td>
              <td>{bus.buses?.routes?.name || 'Unknown'}</td>
              <td>{bus.latitude}</td>
              <td>{bus.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveFleet;
