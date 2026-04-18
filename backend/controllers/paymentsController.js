const Payment = require('../models/Payment');
const Trip = require('../models/Trip');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent for a trip
exports.createPaymentIntent = async (req, res) => {
  try {
    const { tripId } = req.body;
    const userId = req.user.userId;

    // Validate trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Validate user is either rider or driver
    if (trip.rider.toString() !== userId && trip.driver.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized for this trip' });
    }

    // Validate trip is completed
    if (trip.status !== 'completed') {
      return res.status(400).json({ message: 'Payment can only be processed for completed trips' });
    }

    // Determine payer and payee
    // Rider pays driver for the trip
    const payerId = trip.rider.toString(); // Rider pays
    const payeeId = trip.driver.toString(); // Driver receives

    // Check if payment already exists for this trip
    let payment = await Payment.findOne({ trip: tripId });
    if (payment && payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already processed for this trip' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(trip.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        tripId: tripId.toString(),
        payerId: payerId,
        payeeId: payeeId
      }
    });

    // Create or update payment record
    if (!payment) {
      payment = new Payment({
        trip: tripId,
        payer: payerId,
        payee: payeeId,
        amount: trip.price,
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending'
      });
    } else {
      payment.stripePaymentIntentId = paymentIntent.id;
      payment.status = 'pending';
    }

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Confirm payment (called from frontend after Stripe confirms)
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body;

    // Find payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify payment intent matches
    if (payment.stripePaymentIntentId !== paymentIntentId) {
      return res.status(400).json({ message: 'Invalid payment intent' });
    }

    // Retrieve payment intent from Stripe to verify status
    const stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (stripePaymentIntent.status === 'succeeded') {
      // Update payment record
      payment.status = 'completed';
      payment.stripeChargeId = stripePaymentIntent.charges.data[0].id;
      payment.receiptUrl = stripePaymentIntent.charges.data[0].receipt_url;

      await payment.save();

      // Update trip status to indicate payment completed
      await Trip.findByIdAndUpdate(payment.trip, { paymentCompleted: true });

      res.json({
        message: 'Payment successful',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          receiptUrl: payment.receiptUrl
        }
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('trip', 'startLocation endLocation price')
      .populate('payer', 'name email')
      .populate('payee', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's payments (as payer or payee)
exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { role } = req.query; // 'payer' or 'payee'

    let query = {};
    if (role === 'payer') {
      query.payer = userId;
    } else if (role === 'payee') {
      query.payee = userId;
    } else {
      // Get payments where user is either payer or payee
      query.$or = [
        { payer: userId },
        { payee: userId }
      ];
    }

    const payments = await Payment.find(query)
      .populate('trip', 'startLocation endLocation price')
      .populate('payer', 'name email')
      .populate('payee', 'name email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.userId;

    // Find payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify user is either payer or payee
    if (payment.payer.toString() !== userId && payment.payee.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify payment was completed
    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    // Refund via Stripe
    if (payment.stripeChargeId) {
      await stripe.refunds.create({
        charge: payment.stripeChargeId
      });
    }

    // Update payment record
    payment.status = 'refunded';
    await payment.save();

    res.json({
      message: 'Payment refunded successfully',
      payment: {
        id: payment._id,
        status: payment.status
      }
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};