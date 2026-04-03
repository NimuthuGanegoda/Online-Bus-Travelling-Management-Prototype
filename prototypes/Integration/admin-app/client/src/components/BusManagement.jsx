import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      const { data, error } = await supabase
        .from('buses')
        .select(`
          *,
          drivers ( name ),
          routes ( name )
        `);

      if (error) {
        console.error('Error fetching buses:', error);
      } else {
        setBuses(data);
      }
    };

    fetchBuses();
  }, []);

  return (
    <div>
      <h1>Bus Management</h1>
      <table>
        <thead>
          <tr>
            <th>Bus No</th>
            <th>Driver Name</th>
            <th>Route</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.id}>
              <td>{bus.bus_no}</td>
              <td>{bus.drivers ? bus.drivers.name : 'N/A'}</td>
              <td>{bus.routes ? bus.routes.name : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusManagement;
