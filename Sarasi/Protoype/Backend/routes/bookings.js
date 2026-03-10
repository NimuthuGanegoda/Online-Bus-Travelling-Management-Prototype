
const express = require('express');
const router = express.Router();

// @route   GET api/bookings
// @desc    Get all bookings for a user
// @access  Private
router.get('/', (req, res) => {
  res.send('Get all bookings for a user');
});

// @route   GET api/bookings/:id
// @desc    Get a single booking
// @access  Private
router.get('/:id', (req, res) => {
  res.send('Get a single booking');
});

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', (req, res) => {
  res.send('Create a new booking');
});

// @route   DELETE api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', (req, res) => {
  res.send('Cancel a booking');
});

module.exports = router;
