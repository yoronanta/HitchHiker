import React from 'react';
import { Container, Typography, Button, Card, CardContent, CardActions, TextField, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { useMapContext } from '../context/MapContext';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const HomePage = () => {
  const { user } = useAuth();
  const { fetchPendingTrips } = useTrip();
  const { setUserCurrentLocation, setUserDestination } = useMapContext();
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!startLocation || !endLocation || !date || !time) {
      alert('Please fill in all fields');
      return;
    }

    // In a real app, we would geocode the locations here
    // For now, we'll just show a message
    alert(`Searching for rides from ${startLocation} to ${endLocation} on ${date} at ${time}`);
  };

  const handleOfferRide = () => {
    // Navigate to trip creation form
    // This would be handled by react-router in a real implementation
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {!user ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to HitchHiker
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Share rides with people going your way
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} mt={4}>
            <Button variant="contained" color="primary" component="a" href="/login">
              Login
            </Button>
            <Button variant="outlined" component="a" href="/register">
              Register
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Find a Ride
          </Typography>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <form onSubmit={handleSearch}>
                <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                  <TextField
                    label="From"
                    placeholder="Enter starting location"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: <LocationOnIcon fontSize="small" />
                    }}
                  />
                  <TextField
                    label="To"
                    placeholder="Enter destination"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: <DirectionsCarIcon fontSize="small" />
                    }}
                  />
                </Box>
                <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                  <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    sx={{ minWidth: 150 }}
                    InputProps={{
                      startAdornment: <ScheduleIcon fontSize="small" />
                    }}
                  />
                  <TextField
                    label="Time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    sx={{ minWidth: 150 }}
                    InputProps={{
                      startAdornment: <ScheduleIcon fontSize="small" />
                    }}
                  />
                </Box>
                <TextField
                  label="Max Price (optional)"
                  type="number"
                  placeholder="Enter maximum price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  sx={{ mt: 2, minWidth: 200 }}
                  InputProps={{
                    startAdornment: <AttachMoneyIcon fontSize="small" />
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  Search Rides
                </Button>
              </form>
            </CardContent>
          </Card>

          <Typography variant="h5" gutterBottom>
            Popular Routes
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
            {/* These would come from an API in a real app */}
            {[ 'Downtown to Airport', 'University to Downtown', 'Subway to Mall', 'Eastside to Westside' ].map((route, index) => (
              <Button key={index} variant="outlined" size="small">
                {route}
              </Button>
            ))}
          </Box>

          <Typography variant="h5" gutterBottom>
            Become a Driver
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ mb: 4 }}
            disabled={!user.isDriver}
          >
            {user.isDriver ? 'Verified Driver' : 'Register as Driver'}
          </Button>

          {user.isDriver && (
            <>
              <Typography variant="h5" gutterBottom>
                Pending Ride Requests
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  // In a real app, we would get the user's location and fetch nearby trips
                  // For demo purposes, we'll just show a message
                  alert('Fetching nearby ride requests...');
                }}
              >
                Refresh Requests
              </Button>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default HomePage;