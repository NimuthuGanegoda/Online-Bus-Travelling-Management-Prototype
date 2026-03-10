const express = require('express');
const cors = require('cors');
const db = require('./database');
const busRoutes = require('./routes/buses');
const emergencyRoutes = require('./routes/emergency');
const routeRoutes = require('./routes/routes');
const driverRoutes = require('./routes/drivers');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the admin app backend!');
});

// Use the bus routes
app.use('/api/buses', busRoutes);

// Use the emergency routes
app.use('/api/emergencies', emergencyRoutes);

// Use the route routes
app.use('/api/routes', routeRoutes);

// Use the driver routes
app.use('/api/drivers', driverRoutes);

app.listen(port, () => {
  console.log(`Admin app backend listening at http://localhost:${port}`);
});
