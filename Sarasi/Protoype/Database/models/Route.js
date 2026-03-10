
const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  buses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
    },
  ],
});

module.exports = mongoose.model('Route', RouteSchema);
