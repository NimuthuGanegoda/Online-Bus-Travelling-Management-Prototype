
const express = require('express');
const driverRoutes = require('./routes/driver');

const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON bodies
app.use('/driver', driverRoutes);

app.listen(port, () => {
  console.log(`Driver app backend listening at http://localhost:${port}`);
});
