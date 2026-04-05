
const express = require('express');
const router = express.Router();
const supabase = require('../database'); // Assuming you have a Supabase client instance
const { spawn } = require('child_process');
const path = require('path');

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

// Helper function to predict ETA using the Python ML model
function predictETA(tripData) {
  return new Promise((resolve, reject) => {
    const pyScript = path.resolve(__dirname, '../../../../Neo/Protype models/Arrival time estimation/predict_arrival.py');
    const py = spawn('python3', [pyScript]);

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (chunk) => stdout += chunk.toString());
    py.stderr.on('data', (chunk) => stderr += chunk.toString());

    py.on('close', (code) => {
      if (code !== 0) return reject(new Error(`Python Error: ${stderr || stdout}`));
      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) return reject(new Error(result.error));
        resolve(result.eta_minutes);
      } catch (err) {
        reject(new Error(`Invalid output: ${stdout}`));
      }
    });

    py.stdin.write(JSON.stringify(tripData));
    py.stdin.end();
  });
}

// Get bus arrival time (ETA) - Integrated with XGBoost ML model
router.get('/bus-arrival', async (req, res) => {
  const { busId, distance, traffic, weather, passengers, full } = req.query;

  if (!busId) {
    return res.status(400).send('Bus ID is required');
  }

  // Construct features required by the ML model. We use query params if provided,
  // otherwise default to a baseline scenario for the prototype.
  const inputData = {
    distance_to_stop_km: parseFloat(distance) || 3.2,
    traffic_density: parseFloat(traffic) || 0.65,
    weather_score: parseFloat(weather) || 0.80,
    passenger_count: parseInt(passengers) || 22,
    is_bus_full: parseInt(full) || 0,
    driver_rating: 4.5, // Dummy average rating for now
    "route_id_SL-001": 1,
    "route_id_SL-002": 0,
    "route_id_SL-003": 0,
    "route_id_SL-004": 0,
    "route_id_SL-005": 0,
    "route_id_SL-006": 0,
    "route_id_SL-007": 0
  };

  try {
    const eta = await predictETA(inputData);
    res.json({ busId, eta_minutes: eta, parameters: inputData });
  } catch (error) {
    console.error('Error predicting ETA:', error);
    res.status(500).json({ error: 'Error calculating ETA', details: error.message });
  }
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
