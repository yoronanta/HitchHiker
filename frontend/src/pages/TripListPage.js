import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, CardActions, CircularProgress, Typography as MuiTypography, TextField, Slider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { useMapContext } from '../context/MapContext';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import TimerIcon from '@mui/icons-material/Timer';

const TripListPage = () => {
  const { user } = useAuth();
  const { fetchPendingTrips, trips, loading, error } = useTrip();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    lat: null,
    lng: null,
    radius: 10
  });

  useEffect(() => {
    // Fetch trips when component mounts
    // In a real app, we would get the user's current location
    // For demo, we'll use a default location or ask for permission
    if (user) {
      // Mock location for demo - in reality, we'd use Geolocation API
      fetchPendingTrips(40.7128, -74.0060, filters.radius); // NYC coordinates
    }
  }, [user, fetchPendingTrips, filters.radius]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRadiusChange = (e) => {
    setFilters(prev => ({
      ...prev,
      radius: parseInt(e.target.value)
    }));
    // Refetch trips with new radius
    if (user) {
      fetchPendingTrips(40.7128, -74.0060, filters.radius);
    }
  };

  const handleRefresh = () => {
    if (user) {
      fetchPendingTrips(40.7128, -74.0060, filters.radius);
    }
  };

  const handleViewTrip = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
          Please log in to view available rides
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" component="a" href="/login">
            Log In
          </Button>
          <Button variant="outlined" component="a" href="/register">
            Sign Up
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Available Rides
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" size="small" onClick={handleRefresh}>
            Refresh
          </Button>
          {!user.isDriver && (
            <Button variant="contained" color="primary" component="a" href="/trip/new">
              Offer a Ride
            </Button>
          )}
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Filters
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3} mb={2}>
            <Box>
              <Typography variant="body2" sx={{ display: 'block', mb: 1 }}>
                Location
              </Typography>
              <TextField
                label="Latitude"
                type="number"
                name="lat"
                value={filters.lat || ''}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 100 }}
              />
              <TextField
                label="Longitude"
                type="number"
                name="lng"
                value={filters.lng || ''}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 100 }}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ display: 'block', mb: 1 }}>
                Radius (km)
              </Typography>
              <Slider
                valueLabelDisplay="auto"
                value={filters.radius}
                onChange={handleRadiusChange}
                sx={{ width: 200 }}
                min={1}
                max={50}
                step={1}
                getLabel={({ value }) => `${value} km`}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : error ? (
        <Box sx={{ bgcolor: '#ffebee', color: '#c62828', p: 2, mb: 2, borderRadius: 2 }}>
          {error}
        </Box>
      ) : trips.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No rides available matching your criteria
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2">
              Try adjusting your filters or check back later
            </Typography>
          </Box>
          {user.isDriver && (
            <Box sx={{ mt: 4 }}>
              <Button variant="outlined" component="a" href="/trip/new">
                Be the first to offer a ride in this area
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          {trips.map((trip) => (
            <Card key={trip._id} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="text.primary">
                    {trip.startLocation.address || 'From'} → {trip.endLocation.address || 'To'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(trip.startTime).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Ride Details
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={3}>
                    <Box sx={{ minWidth: 120 }}>
                      <Typography variant="body2" color="text.secondary">
                        Distance
                      </Typography>
                      <Typography variant="body1">
                        ~{Math.round(Math.random() * 20)} km
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body1">
                        ~{Math.round(Math.random() * 60)} mins
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                      <Typography variant="body2" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${trip.price}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rider Info
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    {trip.rider && (
                      <>
                        <Box sx={{ width: 40, height: 40, bgColor: 'grey.200', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <PersonOutlinedIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.primary">
                            {trip.rider.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rating: {trip.rider?.rating?.toFixed(1) || 'New'} ⭐
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>

                {trip.notes && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Notes: {trip.notes}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                {!user.isDriver && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewTrip(trip._id)}
                  >
                    View Details
                  </Button>
                )}
                {user.isDriver && !trip.driver && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleViewTrip(trip._id)}
                  >
                    Accept Ride
                  </Button>
                )}
                {user.isDriver && trip.driver && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="disabled"
                    disabled
                  >
                    Taken
                  </Button>
                )}
                {!user.isDriver && trip.driver && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="disabled"
                    disabled
                  >
                    Booked
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default TripListPage;