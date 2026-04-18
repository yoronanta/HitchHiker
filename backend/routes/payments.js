const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Payment management
router.post('/create-intent', paymentsController.createPaymentIntent);
router.post('/confirm', paymentsController.confirmPayment);
router.get('/:id', paymentsController.getPaymentById);
router.get('/user/payments', paymentsController.getUserPayments);
router.delete('/:id/refund', paymentsController.refundPayment);

module.exports = router;