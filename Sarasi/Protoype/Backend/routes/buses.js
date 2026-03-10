
const express = require('express');
const router = express.Router();

// @route   GET api/buses
// @desc    Get all buses
// @access  Public
router.get('/', (req, res) => {
  res.send('Get all buses');
});

// @route   GET api/buses/:id
// @desc    Get a single bus
// @access  Public
router.get('/:id', (req, res) => {
  res.send('Get a single bus');
});

// @route   POST api/buses
// @desc    Create a new bus
// @access  Private
router.post('/', (req, res) => {
  res.send('Create a new bus');
});

// @route   PUT api/buses/:id
// @desc    Update a bus
// @access  Private
router.put('/:id', (req, res) => {
  res.send('Update a bus');
});

// @route   DELETE api/buses/:id
// @desc    Delete a bus
// @access  Private
router.delete('/:id', (req, res) => {
  res.send('Delete a bus');
});

module.exports = router;
