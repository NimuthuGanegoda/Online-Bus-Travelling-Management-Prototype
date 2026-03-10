
const express = require('express');
const router = express.Router();

// @route   GET api/routes
// @desc    Get all routes
// @access  Public
router.get('/', (req, res) => {
  res.send('Get all routes');
});

// @route   GET api/routes/:id
// @desc    Get a single route
// @access  Public
router.get('/:id', (req, res) => {
  res.send('Get a single route');
});

// @route   POST api/routes
// @desc    Create a new route
// @access  Private
router.post('/', (req, res) => {
  res.send('Create a new route');
});

// @route   PUT api/routes/:id
// @desc    Update a route
// @access  Private
router.put('/:id', (req, res) => {
  res.send('Update a route');
});

// @route   DELETE api/routes/:id
// @desc    Delete a route
// @access  Private
router.delete('/:id', (req, res) => {
  res.send('Delete a route');
});

module.exports = router;
