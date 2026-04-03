
const express = require('express');
const router = express.Router();
const supabase = require('../database'); // Assuming you have a Supabase client instance

// Passenger login
router.post('/login', (req, res) => {
  // In a real app, you would authenticate the passenger against the database
  res.send('Passenger login endpoint (not implemented)');
});

// Passenger registration
router.post('/register', (req, res) => {
  // In a real app, you would register the passenger in the database
  res.send('Passenger registration endpoint (not implemented)');
});

// Get bus location - now fetches from Supabase
router.get('/bus-location', async (req, res) => {
  const { busId } = req.query; // Assuming busId is passed as a query param

  if (!busId) {
    return res.status(400).send('Bus ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('bus_locations')
      .select('latitude, longitude')
      .eq('busId', busId)
      .single();

    if (error) {
      console.error('Error fetching bus location from Supabase:', error);
      return res.status(500).send('Error fetching bus location');
    }

    if (data) {
      res.json(data);
    } else {
      res.status(404).send('Bus location not found');
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).send('An unexpected error occurred');
  }
});

// Get bus arrival time (placeholder)
router.get('/bus-arrival', (req, res) => {
  res.send('Get bus arrival time endpoint (not implemented)');
});

// Get bus route - now fetches from Supabase
router.get('/bus-route', async (req, res) => {
  const { busId } = req.query; // Assuming busId is passed as a query param

  if (!busId) {
    return res.status(400).send('Bus ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('busId', busId)
      .is('endTime', null)
      .single();

    if (error) {
      console.error('Error fetching bus route from Supabase:', error);
      return res.status(500).send('Error fetching bus route');
    }

    if (data) {
      res.json(data);
    } else {
      res.status(404).send('No active route found for this bus');
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).send('An unexpected error occurred');
  }
});

// ... (other endpoints remain as placeholders)

module.exports = router;
