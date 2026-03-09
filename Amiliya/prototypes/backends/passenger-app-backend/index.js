
const express = require('express');
const passengerRoutes = require('./routes/passenger');

const app = express();
const port = 3001;

app.use(express.json()); // To parse JSON bodies
app.use('/passenger', passengerRoutes);

app.listen(port, () => {
  console.log(`Passenger app backend listening at http://localhost:${port}`);
});
