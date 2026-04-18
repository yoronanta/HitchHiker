const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
ratingSchema.index({ trip: 1 });
ratingSchema.index({ rater: 1 });
ratingSchema.index({ rated: 1 });
ratingSchema.index({ createdAt: -1 });

// Prevent duplicate ratings for same trip by same user
ratingSchema.index({ trip: 1, rater: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);