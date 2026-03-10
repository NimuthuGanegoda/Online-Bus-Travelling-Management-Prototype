
const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
  },
});

module.exports = mongoose.model('Bus', BusSchema);
