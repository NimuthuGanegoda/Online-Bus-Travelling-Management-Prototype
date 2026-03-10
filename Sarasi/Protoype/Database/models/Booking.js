
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  seats: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
