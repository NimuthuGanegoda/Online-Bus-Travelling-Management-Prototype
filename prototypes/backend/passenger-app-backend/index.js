
const express = require('express');
const db = require('./database'); // Initialize SQLite database
const passengerRoutes = require('./routes/passenger');

const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the passenger app backend!');
});

app.use('/passenger', passengerRoutes);

app.listen(port, () => {
  console.log(`Passenger app backend listening at http://localhost:${port}`);
});

