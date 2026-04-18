import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, CardActions, CircularProgress, Slider, SliderLabel, SliderValueLabel } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { useMapContext } from '../context/MapContext';
import { useNavigate, useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import TimerIcon from '@mui/icons-material/Timer';

const TripDetailsPage = () => {
  const { user } = useAuth();
  const { getTripById, acceptTrip, startTrip, completeTrip, cancelTrip } = useTrip();
  const { setUserCurrentLocation, setUserDestination } = useMapContext();
  const navigate = useNavigate();
  const { id: tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const loadTrip = async () => {
      setLoading(true);
      try {
        const tripData = await getTripById(tripId);
        setTrip(tripData);

        // Set map locations if available
        if (tripData.startLocation.address) {
          setUserCurrentLocation({
            lat: tripData.startLocation.coordinates[0],
            lng: tripData.startLocation.coordinates[1],
            address: tripData.startLocation.address
          });
        }
        if (tripData.endLocation.address) {
          setUserDestination({
            lat: tripData.endLocation.coordinates[0],
            lng: tripData.endLocation.coordinates[1],
            address: tripData.endLocation.address
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      loadTrip();
    }
  }, [tripId, getTripById, setUserCurrentLocation, setUserDestination]);

  const handleAcceptTrip = async () => {
    try {
      await acceptTrip(tripId);
      // Trip details will be updated via context
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept trip');
    }
  };

  const handleStartTrip = async () => {
    try {
      await startTrip(tripId);
      // Trip details will be updated via context
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start trip');
    }
  };

  const handleCompleteTrip = async () => {
    try {
      await completeTrip(tripId);
      // Trip details will be updated via context
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete trip');
    }
  };

  const handleCancelTrip = async () => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) {
      return;
    }
    try {
      await cancelTrip(tripId);
      navigate('/trips');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel trip');
    }
  };

  const handleRateTrip = () => {
    navigate(`/trip/${tripId}/rate`, { state: { tripId, rating } });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ bgcolor: '#ffebee', color: '#c62828', p: 2, mb: 2, borderRadius: 2 }}>
          {error}
        </Box>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
          Trip not found
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" component="a" href="/trips">
            Back to Trips
          </Button>
        </Box>
      </Container>
    );
  }

  const isRider = user && trip.rider && trip.rider._id.toString() === user._id.toString();
  const isDriver = user && trip.driver && trip.driver._id.toString() === user._id.toString();
  const isParticipant = isRider || isDriver;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Trip Details
        </Typography>
        <Button variant="outlined" size="small" component="a" href="/trips">
          Back to List
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" color="text.primary">
              {trip.startLocation.address || 'From'} → {trip.endLocation.address || 'To'}
            </Typography>
            <Typography variant="body2" color={getStatusColor(trip.status)}>
              <strong>{trip.status.toUpperCase()}</strong>
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Trip Information
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={3}>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="body2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {new Date(trip.startTime).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Duration
                </Typography>
                <Typography variant="body1">
                  ~{trip.estimatedDuration || Math.round(Math.random() * 60)} mins
                </Typography>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="body2" color="text.secondary">
                  Distance
                </Typography>
                <Typography variant="body1">
                  ~{(trip.distance || Math.round(Math.random() * 30)).toFixed(1)} km
                </Typography>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="body2" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="h5" color="primary">
                  ${trip.price}
                </Typography>
              </Box>
            </Box>
          </Box>

          {isParticipant && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Participants
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={3}>
                <Box sx={{ minWidth: 150 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rider
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    {trip.rider ? (
                      <>
                        <Box sx={{ width: 36, height: 36, bgColor: 'grey.200', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    ) : null}
                  </Box>
                </Box>
                <Box sx={{ minWidth: 150 }}>
                  <Typography variant="body2" color="text.secondary">
                    Driver
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    {trip.driver ? (
                      <>
                        <Box sx={{ width: 36, height: 36, bgColor: 'grey.200', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <DirectionsCarOutlinedIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.primary">
                            {trip.driver.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rating: {trip.driver?.rating?.toFixed(1) || 'New'} ⭐
                            {trip.driver.isVerified && (
                              <span sx={{ color: 'success.main', ml: 1 }}>
                                ✓ Verified
                              </span>
                            )}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not assigned yet
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {trip.notes && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {trip.notes}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {/* Rider actions */}
          {isRider && trip.status === 'pending' && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancelTrip}
            >
              Cancel Ride
            </Button>
          )}
          {isRider && trip.status === 'accepted' && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancelTrip}
            >
              Cancel Ride
            </Button>
          )}
          {isRider && trip.status === 'in_progress' && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleCompleteTrip}
            >
              Mark as Complete
            </Button>
          )}
          {isRider && trip.status === 'completed' && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleRateTrip}
            >
              Rate Driver
            </Button>
          )}

          {/* Driver actions */}
          {isDriver && trip.status === 'pending' && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleAcceptTrip}
            >
              Accept Ride
            </Button>
          )}
          {isDriver && trip.status === 'accepted' && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={handleStartTrip}
            >
              Start Ride
            </Button>
          )}
          {isDriver && trip.status === 'in_progress' && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleCompleteTrip}
            >
              Complete Ride
            </Button>
          )}
          {isDriver && (trip.status === 'accepted' || trip.status === 'in_progress') && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancelTrip}
            >
              Cancel Ride
            </Button>
          )}

          {/* Payment button for completed trips */}
          {isParticipant && trip.status === 'completed' && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              component="a"
              href={`/payment/${trip._id}`}
            >
              Process Payment
            </Button>
          )}
        </CardActions>
      </Card>
    </Container>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning.main';
    case 'accepted':
      return 'info.main';
    case 'in_progress':
      return 'primary.main';
    case 'completed':
      return 'success.main';
    case 'cancelled':
      return 'error.main';
    default:
      return 'text.secondary';
  }
};

export default TripDetailsPage;