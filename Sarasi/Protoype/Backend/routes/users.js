
const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', (req, res) => {
  res.send('Get all users');
});

// @route   GET api/users/:id
// @desc    Get a single user
// @access  Private
router.get('/:id', (req, res) => {
  res.send('Get a single user');
});

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Private
router.put('/:id', (req, res) => {
  res.send('Update a user');
});

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private
router.delete('/:id', (req, res) => {
  res.send('Delete a user');
});

module.exports = router;
