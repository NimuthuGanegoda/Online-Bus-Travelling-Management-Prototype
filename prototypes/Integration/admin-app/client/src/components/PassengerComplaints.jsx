import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const PassengerComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          passengers ( name )
        `);

      if (error) {
        console.error('Error fetching complaints:', error);
      } else {
        setComplaints(data);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div>
      <h1>Passenger Complaints</h1>
      <table>
        <thead>
          <tr>
            <th>Passenger</th>
            <th>Complaint</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.passengers?.name || 'Unknown'}</td>
              <td>{complaint.comment}</td>
              <td>{complaint.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerComplaints;
