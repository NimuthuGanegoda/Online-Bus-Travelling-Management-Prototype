
const express = require('express');
const router = express.Router();

// @route   POST api/payments
// @desc    Make a payment for a booking
// @access  Private
router.post('/', (req, res) => {
  res.send('Make a payment for a booking');
});

module.exports = router;
