const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// User management
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.get('/:id/ratings', usersController.getUserRatings);
router.get('/verify-driver', usersController.verifyDriver);

module.exports = router;