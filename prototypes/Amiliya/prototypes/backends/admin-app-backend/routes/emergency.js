const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency');

router.get('/', emergencyController.getAllEmergencies);
router.post('/', emergencyController.createEmergency);

module.exports = router;
