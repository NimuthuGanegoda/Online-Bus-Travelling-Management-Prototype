const express = require('express');
const connectDB = require('../Database/db');

const app = express();

// Connect to database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
