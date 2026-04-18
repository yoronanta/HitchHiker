const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  startLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: String
  },
  endLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: String
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  distance: {
    type: Number, // in kilometers
    default: 0
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for geospatial queries
tripSchema.index({ 'startLocation.coordinates': '2dsphere' });
tripSchema.index({ 'endLocation.coordinates': '2dsphere' });
tripSchema.index({ status: 1 });
tripSchema.index({ startTime: 1 });

// Virtual for trip duration
tripSchema.virtual('duration').get(function() {
  if (!this.endTime || !this.startTime) return null;
  return (this.endTime - this.startTime) / (1000 * 60); // minutes
});

// Static method to find nearby trips
tripSchema.statics.findNearby = function(point, maxDistance = 10000) { // maxDistance in meters
  return this.find({
    'startLocation.coordinates': {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: point
        },
        $maxDistance: maxDistance
      }
    },
    status: 'pending'
  });
};

module.exports = mongoose.model('Trip', tripSchema);