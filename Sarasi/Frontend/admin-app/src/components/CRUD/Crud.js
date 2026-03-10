
import React, { useState } from 'react';
import './Crud.css';
import Modal from '../Modal/Modal';

const Crud = () => {
  const [busDetails, setBusDetails] = useState([
    { id: 1, busNo: 'B001', driverName: 'John Doe', route: 'Route A' },
    { id: 2, busNo: 'B002', driverName: 'Jane Smith', route: 'Route B' },
    { id: 3, busNo: 'B003', driverName: 'Peter Jones', route: 'Route C' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBus, setCurrentBus] = useState({ id: null, busNo: '', driverName: '', route: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBus({ ...currentBus, [name]: value });
  };

  const handleAdd = () => {
    setBusDetails([...busDetails, { ...currentBus, id: busDetails.length + 1 }]);
    setShowModal(false);
    setCurrentBus({ id: null, busNo: '', driverName: '', route: '' });
  };

  const handleEdit = (bus) => {
    setIsEditing(true);
    setCurrentBus(bus);
    setShowModal(true);
  };

  const handleUpdate = () => {
    setBusDetails(busDetails.map((bus) => (bus.id === currentBus.id ? currentBus : bus)));
    setShowModal(false);
    setIsEditing(false);
    setCurrentBus({ id: null, busNo: '', driverName: '', route: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      setBusDetails(busDetails.filter((bus) => bus.id !== id));
    }
  };

  return (
    <div className="crud-container">
      <div className="crud-actions">
        <button onClick={() => { setIsEditing(false); setCurrentBus({ id: null, busNo: '', driverName: '', route: '' }); setShowModal(true); }}>Add New</button>
      </div>
      <Modal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={isEditing ? handleUpdate : handleAdd}
        title={isEditing ? 'Edit Bus' : 'Add New Bus'}
      >
        <form>
          <div className="form-group">
            <label>Bus No</label>
            <input type="text" name="busNo" value={currentBus.busNo} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Driver Name</label>
            <input type="text" name="driverName" value={currentBus.driverName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Route</label>
            <input type="text" name="route" value={currentBus.route} onChange={handleInputChange} />
          </div>
        </form>
      </Modal>
      <table className="crud-table">
        <thead>
          <tr>
            <th>Bus No</th>
            <th>Driver Name</th>
            <th>Route</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {busDetails.map((bus) => (
            <tr key={bus.id}>
              <td>{bus.busNo}</td>
              <td>{bus.driverName}</td>
              <td>{bus.route}</td>
              <td>
                <button onClick={() => handleEdit(bus)}>Edit</button>
                <button onClick={() => handleDelete(bus.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Crud;
