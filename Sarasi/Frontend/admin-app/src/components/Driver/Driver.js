
import React, { useState } from 'react';
import './Driver.css';

const Driver = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'John Doe', contact: '123-456-7890' },
    { id: 2, name: 'Jane Smith', contact: '098-765-4321' },
    { id: 3, name: 'Peter Jones', contact: '111-222-3333' },
  ]);

  const [newDriver, setNewDriver] = useState({ name: '', contact: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver({ ...newDriver, [name]: value });
  };

  const handleAddDriver = () => {
    setDrivers([...drivers, { ...newDriver, id: drivers.length + 1 }]);
    setNewDriver({ name: '', contact: '' });
  };

  return (
    <div className="driver-container">
      <div className="driver-form">
        <h2>Add New Driver</h2>
        <form>
          <div className="form-group">
            <label>Driver Name</label>
            <input type="text" name="name" value={newDriver.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Contact No</label>
            <input type="text" name="contact" value={newDriver.contact} onChange={handleInputChange} />
          </div>
          <button type="button" onClick={handleAddDriver}>Add Driver</button>
        </form>
      </div>
      <div className="driver-list">
        <h2>Existing Drivers</h2>
        <table>
          <thead>
            <tr>
              <th>Driver Name</th>
              <th>Contact No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td>{driver.contact}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Driver;
