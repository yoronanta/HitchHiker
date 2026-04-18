const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/tripsController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Trip management
router.post('/', tripsController.createTrip);
router.get('/', tripsController.getPendingTrips);
router.get('/:id', tripsController.getTripById);
router.put('/:id/accept', tripsController.acceptTrip);
router.put('/:id/start', tripsController.startTrip);
router.put('/:id/complete', tripsController.completeTrip);
router.put('/:id/cancel', tripsController.cancelTrip);
router.get('/user/trips', tripsController.getUserTrips);

module.exports = router;