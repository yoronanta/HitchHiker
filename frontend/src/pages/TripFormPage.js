import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress, Switch, FormControlLabel, FormGroup, Slider, SliderLabel, SliderValueLabel } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { useMapContext } from '../context/MapContext';
import { useNavigate } from 'react-router-dom';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const TripFormPage = () => {
  const { user } = useAuth();
  const { createTrip } = useTrip();
  const { setUserCurrentLocation, setUserDestination } = useMapContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    startTime: '',
    price: 0,
    notes: '',
    isFlexible: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.startLocation || !formData.endLocation || !formData.startTime || formData.price <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // In a real app, we would geocode the locations here
      // For now, we'll create mock coordinates
      const mockStartCoords = [Math.random() * 180 - 90, Math.random() * 360 - 180]; // [lat, lng]
      const mockEndCoords = [Math.random() * 180 - 90, Math.random() * 360 - 180]; // [lat, lng]

      const tripData = {
        startLocation: {
          lat: mockStartCoords[0],
          lng: mockStartCoords[1],
          address: formData.startLocation
        },
        endLocation: {
          lat: mockEndCoords[0],
          lng: mockEndCoords[1],
          address: formData.endLocation
        },
        startTime: formData.startTime,
        price: formData.price,
        notes: formData.notes || ''
      };

      const createdTrip = await createTrip(tripData);
      setSuccess('Trip created successfully!');

      // Clear form and navigate to trip details after a short delay
      setFormData({
        startLocation: '',
        endLocation: '',
        startTime: '',
        price: 0,
        notes: '',
        isFlexible: false
      });

      setTimeout(() => navigate(`/trip/${createdTrip._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = (type) => {
    // In a real app, we would use the Geolocation API
    // For demo, we'll set a mock location
    if (type === 'start') {
      setFormData(prev => ({
        ...prev,
        startLocation: 'Current Location (Using GPS)'
      }));
      setUserCurrentLocation({
        lat: 40.7128,
        lng: -74.0060,
        address: 'Current Location'
      });
    } else if (type === 'end') {
      setFormData(prev => ({
        ...prev,
        endLocation: 'Current Location (Using GPS)'
      }));
      setUserDestination({
        lat: 40.7128,
        lng: -74.0060,
        address: 'Current Location'
      });
    }
  };

  const getMinPrice = () => {
    // Calculate a minimum suggested price based on distance
    // In a real app, we would use actual distance calculation
    return 5; // $5 minimum
  };

  const getMaxPrice = () => {
    // Calculate a maximum suggested price based on distance
    // In a real app, we would use actual distance calculation
    return 50; // $50 maximum
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {!user ? (
        <Typography variant="h5" align="center" color="text.secondary">
Please log in to create a trip
        </Typography>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            {user.isDriver ? 'Offer a Ride' : 'Request a Ride'}
          </Typography>

          {loading && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <CircularProgress size={30} />
            </Box>
          )}

          {error && (
            <Box sx={{ bgcolor: '#ffebee', color: '#c62828', p: 2, mb: 2, borderRadius: 2 }}>
              {error}
            </Box>
          )}

          {success && (
            <Box sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', p: 2, mb: 2, borderRadius: 2 }}>
              {success}
            </Box>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
              <TextField
                label="Starting Point"
                InputProps={{
                  startAdornment: <LocationOnIcon fontSize="small" />
                }}
                value={formData.startLocation}
                onChange={handleChange}
                placeholder="Enter starting location or use current location"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="text"
                size="small"
                onClick={() => handleUseCurrentLocation('start')}
                sx={{ mt: 1 }}
              >
                Use Current Location
              </Button>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
              <TextField
                label="Destination"
                InputProps={{
                  startAdornment: <DirectionsCarIcon fontSize="small" />
                }}
                value={formData.endLocation}
                onChange={handleChange}
                placeholder="Enter destination or use current location"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="text"
                size="small"
                onClick={() => handleUseCurrentLocation('end')}
                sx={{ mt: 1 }}
              >
                Use Current Location
              </Button>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
              <TextField
                label="Date & Time"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="text"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  const now = new Date().toISOString().slice(0, 16);
                  setFormData({...formData, startTime: now});
                }}
              >
                Now
              </Button>
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Price
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 2, minWidth: 60 }}>
                  ${formData.price}
                </Typography>
                <Slider
                  value={formData.price}
                  onChange={(e, newValue) => setFormData({...formData, price: newValue})}
                  valueLabelDisplay="auto"
                  sx={{ width: 300 }}
                  min={getMinPrice()}
                  max={getMaxPrice()}
                  step={1}
                  getLabel={({ value }) => `$${value}`}
                />
              </Box>
            </Box>

            <FormGroup row mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFlexible}
                    onHandleChange={handleChange}
                    name="isFlexible"
                    color="primary"
                  />
                }
                label="Flexible timing (±30 minutes)"
              />
            </FormGroup>

            <Box mt={2}>
              <TextField
                label="Notes (optional)"
                placeholder="Add any additional details about your ride"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{ width: '100%' }}
              />
            </Box>

            <Box mt={4} sx={{ textAlign: 'right' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/trips')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Publish Trip'}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Container>
  );
};

export default TripFormPage;