const Trip = require('../models/Trip');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const { startLocation, endLocation, startTime, price, notes } = req.body;
    const riderId = req.user.userId;

    // Validate rider exists
    const rider = await User.findById(riderId);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    // Create new trip
    const trip = new Trip({
      rider: riderId,
      startLocation: {
        type: 'Point',
        coordinates: [startLocation.lng, startLocation.lat],
        address: startLocation.address
      },
      endLocation: {
        type: 'Point',
        coordinates: [endLocation.lng, endLocation.lat],
        address: endLocation.address
      },
      startTime: new Date(startTime),
      price,
      notes: notes || ''
    });

    await trip.save();

    // Populate rider info for response
    await trip.populate('rider', 'name email phone rating');

    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all pending trips (for drivers to browse)
exports.getPendingTrips = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in km
    const driverId = req.user.userId;

    // Validate driver exists and is actually a driver
    const driver = await User.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    if (!driver.isDriver) {
      return res.status(403).json({ message: 'Only drivers can browse trips' });
    }

    // Find pending trips near the driver's location
    const trips = await Trip.find({
      status: 'pending',
      rider: { $ne: driverId } // Exclude trips posted by the driver themselves
    });

    // If location provided, filter by proximity
    if (lat && lng) {
      const maxDistance = radius * 1000; // convert km to meters
      const tripsWithLocation = await Trip.find({
        status: 'pending',
        rider: { $ne: driverId },
        'startLocation.coordinates': {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: maxDistance
          }
        }
      }).populate('rider', 'name email phone rating');

      return res.json(tripsWithLocation);
    }

    // Populate rider info for all trips
    const populatedTrips = await Trip.populate(trips, { path: 'rider', select: 'name email phone rating' });
    res.json(populatedTrips);
  } catch (error) {
    console.error('Get pending trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('rider', 'name email phone rating')
      .populate('driver', 'name email phone rating vehicleInfo');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept a trip (driver accepts rider's trip)
exports.acceptTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const driverId = req.user.userId;

    // Validate driver exists and is actually a driver
    const driver = await User.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    if (!driver.isDriver) {
      return res.status(403).json({ message: 'Only drivers can accept trips' });
    }

    // Find trip and validate it's still pending
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'pending') {
      return res.status(400).json({ message: 'Trip is no longer available' });
    }

    // Prevent driver from accepting their own trip
    if (trip.rider.toString() === driverId) {
      return res.status(400).json({ message: 'Cannot accept your own trip' });
    }

    // Update trip
    trip.driver = driverId;
    trip.status = 'accepted';

    await trip.save();

    // Populate references for response
    await trip.populate('rider', 'name email phone rating');
    await trip.populate('driver', 'name email phone rating vehicleInfo');

    res.json(trip);
  } catch (error) {
    console.error('Accept trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start trip (when driver picks up rider)
exports.startTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.userId;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify user is either the rider or driver
    if (trip.rider.toString() !== userId && trip.driver.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify trip is accepted
    if (trip.status !== 'accepted') {
      return res.status(400).json({ message: 'Trip must be accepted before starting' });
    }

    trip.status = 'in_progress';
    trip.startTime = new Date(); // Update start time to now

    await trip.save();

    // Populate references for response
    await trip.populate('rider', 'name email phone rating');
    await trip.populate('driver', 'name email phone rating vehicleInfo');

    res.json(trip);
  } catch (error) {
    console.error('Start trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete trip
exports.completeTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.userId;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify user is either the rider or driver
    if (trip.rider.toString() !== userId && trip.driver.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify trip is in progress
    if (trip.status !== 'in_progress') {
      return res.status(400).json({ message: 'Trip must be in progress before completing' });
    }

    trip.status = 'completed';
    trip.endTime = new Date();

    await trip.save();

    // Populate references for response
    await trip.populate('rider', 'name email phone rating');
    await trip.populate('driver', 'name email phone rating vehicleInfo');

    res.json(trip);
  } catch (error) {
    console.error('Complete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel trip
exports.cancelTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.userId;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify user is either the rider or driver
    if (trip.rider.toString() !== userId && trip.driver.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow cancellation if not already completed
    if (trip.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed trip' });
    }

    trip.status = 'cancelled';

    await trip.save();

    // Populate references for response
    await trip.populate('rider', 'name email phone rating');
    await trip.populate('driver', 'name email phone rating vehicleInfo');

    res.json(trip);
  } catch (error) {
    console.error('Cancel trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's trips (as rider or driver)
exports.getUserTrips = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { role } = req.query; // 'rider' or 'driver'

    let query = {};
    if (role === 'rider') {
      query.rider = userId;
    } else if (role === 'driver') {
      query.driver = userId;
    } else {
      // Get trips where user is either rider or driver
      query.$or = [
        { rider: userId },
        { driver: userId }
      ];
    }

    const trips = await Trip.find(query)
      .populate('rider', 'name email phone rating')
      .populate('driver', 'name email phone rating vehicleInfo')
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    console.error('Get user trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};