import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          route_stop_links (
            stops (*)
          )
        `);

      if (error) {
        console.error('Error fetching routes:', error);
      } else {
        setRoutes(data);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div>
      <h1>Route Management</h1>
      {routes.map((route) => (
        <div key={route.id}>
          <h2>{route.name}</h2>
          <ul>
            {route.route_stop_links?.map((link) => (
              <li key={link.stops?.id}>{link.stops?.name || 'Unknown Stop'}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RouteManagement;
