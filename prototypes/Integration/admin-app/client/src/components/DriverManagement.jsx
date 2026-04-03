import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*, buses (*)');

      if (error) {
        console.error('Error fetching drivers:', error);
      } else {
        setDrivers(data);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div>
      <h1>Driver Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Assigned Bus</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name}</td>
              <td>{driver.contact}</td>
              <td>{driver.buses ? driver.buses.bus_no : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverManagement;
