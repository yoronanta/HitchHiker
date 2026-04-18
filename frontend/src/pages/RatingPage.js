import React, { useState } from 'react';
import { Container, Box, Typography, Button, CircularProgress, Rating, TextField } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';

const RatingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tripId, setTripId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get tripId from location state (navigated from TripDetailsPage) or params
  React.useEffect(() => {
    if (location.state && location.state.tripId) {
      setTripId(location.state.tripId);
      setRating(location.state.rating || 0);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!tripId) {
      setError('Invalid trip');
      return;
    }

    if (rating < 1) {
      setError('Please provide a rating');
      return;
    }

    setLoading(true);
    try {
      // In a real app, we would make an API call to submit the rating
      // For demo, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Thank you for your rating!');
      setTimeout(() => {
        navigate('/trips');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
Please log in to rate a trip
        </Typography>
      </Container>
    );
  }

  if (!tripId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
No trip specified for rating
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" component="a" href="/trips">
            Back to Trips
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4">
          Rate Your Ride
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          How was your ride?
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
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

      <form onSubmit={handleSubmit} noValidate sx={{ maxWidth: 400, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Overall Rating
          </Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            precision={0.5}
            sx={{ color: '#ffb300' }}
            emptyIcon={<StarBorderIcon fontSize="large" />}
            icon={<StarIcon fontSize="large" />}
          />
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            {rating} / 5
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Comments (optional)
          </Typography>
          <TextField
            label="What did you like or dislike about the ride?"
            placeholder="Share your experience to help improve the community"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
            sx={{ width: '100%' }}
          />
        </Box>

        <Box sx={{ textAlign: 'right', mt: 4 }}>
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
            {loading ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default RatingPage;