
import React, { useState } from 'react';
import './Route.css';

const Route = () => {
  const [routes, setRoutes] = useState([
    { id: 1, name: 'Route A', stops: ['Stop 1', 'Stop 2', 'Stop 3'] },
    { id: 2, name: 'Route B', stops: ['Stop 4', 'Stop 5', 'Stop 6'] },
    { id: 3, name: 'Route C', stops: ['Stop 7', 'Stop 8', 'Stop 9'] },
  ]);

  const [newRoute, setNewRoute] = useState({ name: '', stops: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute({ ...newRoute, [name]: value });
  };

  const handleAddRoute = () => {
    const stopsArray = newRoute.stops.split(',').map(stop => stop.trim());
    setRoutes([...routes, { ...newRoute, id: routes.length + 1, stops: stopsArray }]);
    setNewRoute({ name: '', stops: '' });
  };

  return (
    <div className="route-container">
      <div className="route-form">
        <h2>Add New Route</h2>
        <form>
          <div className="form-group">
            <label>Route Name</label>
            <input type="text" name="name" value={newRoute.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Stops (comma-separated)</label>
            <input type="text" name="stops" value={newRoute.stops} onChange={handleInputChange} />
          </div>
          <button type="button" onClick={handleAddRoute}>Add Route</button>
        </form>
      </div>
      <div className="route-list">
        <h2>Existing Routes</h2>
        <table>
          <thead>
            <tr>
              <th>Route Name</th>
              <th>Stops</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id}>
                <td>{route.name}</td>
                <td>{route.stops.join(', ')}</td>
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

export default Route;
