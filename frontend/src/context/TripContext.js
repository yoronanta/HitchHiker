import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch trips (pending trips for drivers)
  const fetchPendingTrips = async (lat, lng, radius) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
        params.radius = radius || 10;
      }
      const response = await axios.get('/api/trips', { params });
      setTrips(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  // Create a new trip
  const createTrip = async (tripData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/trips', tripData);
      setTrips(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get trip by ID
  const getTripById = async (tripId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/trips/${tripId}`);
      setCurrentTrip(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Accept a trip
  const acceptTrip = async (tripId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/trips/${tripId}/accept`);
      // Update trips list
      setTrips(prev => prev.map(trip =>
        trip._id === tripId ? response.data : trip
      ));
      // Update current trip if it's the same
      if (currentTrip && currentTrip._id === tripId) {
        setCurrentTrip(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start trip
  const startTrip = async (tripId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/trips/${tripId}/start`);
      // Update trips list
      setTrips(prev => prev.map(trip =>
        trip._id === tripId ? response.data : trip
      ));
      // Update current trip
      if (currentTrip && currentTrip._id === tripId) {
        setCurrentTrip(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Complete trip
  const completeTrip = async (tripId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/trips/${tripId}/complete`);
      // Update trips list
      setTrips(prev => prev.map(trip =>
        trip._id === tripId ? response.data : trip
      ));
      // Update current trip
      if (currentTrip && currentTrip._id === tripId) {
        setCurrentTrip(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel trip
  const cancelTrip = async (tripId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/trips/${tripId}/cancel`);
      // Update trips list
      setTrips(prev => prev.map(trip =>
        trip._id === tripId ? response.data : trip
      ));
      // Update current trip
      if (currentTrip && currentTrip._id === tripId) {
        setCurrentTrip(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's trips
  const getUserTrips = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (role) params.role = role;
      const response = await axios.get('/api/trips/user/trips', { params });
      setTrips(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user trips');
    } finally {
      setLoading(false);
    }
  };

  // Join trip room for real-time updates
  const joinTripRoom = (tripId) => {
    if (socket) {
      socket.emit('join-trip', tripId);
    }
  };

  // Leave trip room
  const leaveTripRoom = (tripId) => {
    if (socket) {
      socket.emit('leave-trip', tripId);
    }
  };

  // Listen for real-time trip updates
  useEffect(() => {
    if (socket) {
      socket.on('trip-updated', (tripData) => {
        // Update trips list
        setTrips(prev => prev.map(trip =>
          trip._id === tripData._id ? tripData : trip
        ));
        // Update current trip
        if (currentTrip && currentTrip._id === tripData._id) {
          setCurrentTrip(tripData);
        }
      });

      socket.on('trip-deleted', (tripId) => {
        setTrips(prev => prev.filter(trip => trip._id !== tripId));
        if (currentTrip && currentTrip._id === tripId) {
          setCurrentTrip(null);
        }
      });
    }
  }, [socket]);

  const value = {
    trips,
    loading,
    error,
    currentTrip,
    fetchPendingTrips,
    createTrip,
    getTripById,
    acceptTrip,
    startTrip,
    completeTrip,
    cancelTrip,
    getUserTrips,
    joinTripRoom,
    leaveTripRoom
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};