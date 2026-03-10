
const express = require('express');
const driverRoutes = require('./routes/driver');

const app = express();
const port = 3000;

// To parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the driver app backend!');
});

app.use('/driver', driverRoutes);

app.listen(port, () => {
  console.log(`Driver app backend listening at http://localhost:${port}`);
});
