const User = require('../models/User');
const Rating = require('../models/Rating');

// Get all users (with filtering options)
exports.getUsers = async (req, res) => {
  try {
    const { isDriver, limit = 10, page = 1 } = req.query;
    const filter = {};

    if (isDriver !== undefined) {
      filter.isDriver = isDriver === 'true';
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's ratings
    const ratingsGiven = await Rating.find({ rater: user._id }).count();
    const ratingsReceived = await Rating.find({ rated: user._id }).count();

    res.json({
      ...user.toObject(),
      ratingsGiven,
      ratingsReceived
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's ratings (given and received)
exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.params.id;

    const ratingsGiven = await Rating.find({ rater: userId })
      .populate('rated', 'name email')
      .populate('trip', 'startLocation endLocation')
      .sort({ createdAt: -1 });

    const ratingsReceived = await Rating.find({ rated: userId })
      .populate('rater', 'name email')
      .populate('trip', 'startLocation endLocation')
      .sort({ createdAt: -1 });

    res.json({
      ratingsGiven,
      ratingsReceived
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify if user is a driver
exports.verifyDriver = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isDriver) {
      return res.status(400).json({ message: 'User is not registered as a driver' });
    }

    // Update verification status
    user.isVerified = true;
    await user.save();

    res.json({
      message: 'Driver verification successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isDriver: user.isDriver,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};