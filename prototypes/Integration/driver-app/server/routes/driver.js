
const express = require('express');
const router = express.Router();
const supabase = require('../database'); // Assuming you have a Supabase client instance

// Driver login
router.post('/login', (req, res) => {
  // In a real app, you would authenticate the driver against the database
  res.send('Driver login endpoint (not implemented)');
});

// Get driver's current trip - now fetches from Supabase
router.get('/trip', async (req, res) => {
  const { driverId } = req.query; // Assuming driverId is passed as a query param

  if (!driverId) {
    return res.status(400).send('Driver ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('driverId', driverId)
      .is('endTime', null) // Fetch ongoing trip
      .single();

    if (error) {
      console.error('Error fetching trip from Supabase:', error);
      return res.status(500).send('Error fetching trip');
    }

    if (data) {
      res.json(data);
    } else {
      res.status(404).send('No active trip found for this driver');
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).send('An unexpected error occurred');
  }
});

// Start a new trip - now persists to Supabase
router.post('/trip/start', async (req, res) => {
  const { driverId } = req.body;

  if (!driverId) {
    return res.status(400).send('Driver ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('trips')
      .insert([{ driverId, startTime: new Date() }])
      .select();

    if (error) {
      console.error('Error starting trip in Supabase:', error);
      return res.status(500).send('Error starting trip');
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).send('An unexpected error occurred');
  }
});

// End the current trip - now updates in Supabase
router.post('/trip/end', async (req, res) => {
  const { tripId } = req.body;

  if (!tripId) {
    return res.status(400).send('Trip ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('trips
')
      .update({ endTime: new Date() })
      .eq('id', tripId)
      .select();

    if (error) {
      console.error('Error ending trip in Supabase:', error);
      return res.status(500).send('Error ending trip');
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).send('An unexpected error occurred');
  }
});

// ... (other endpoints remain as placeholders)

module.exports = router;

