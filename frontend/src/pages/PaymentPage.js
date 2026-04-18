import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, CircularProgress, TextField, LinearProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Mock Stripe element components (in a real app, you'd use @stripe/react-stripe-js)
const CardElement = () => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        padding: '12px',
        border: focused ? '1px solid #1976d2' : '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff'
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div style={{ fontSize: '16px', color: '#424242' }}>
        •••• •••• •••• 1234
      </div>
      <div style={{ fontSize: '12px', color: '#9e9e9e', marginTop: '4px' }}>
        Expires 12/24 • CVV
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  // Simulate fetching payment intent from backend
  useEffect(() => {
    const loadPaymentIntent = async () => {
      if (!tripId) return;

      setLoading(true);
      try {
        // In a real app, this would be an API call to create payment intent
        // For demo, we'll simulate with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock client secret
        setClientSecret('pi_1234567890_secret_abcdefghijklmnopqrstuvwxyz');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentIntent();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!clientSecret) {
      setError('Payment details not loaded');
      return;
    }

    setPaymentProcessing(true);
    try {
      // In a real app, we would use Stripe to confirm the payment
      // For demo, we'll simulate the payment process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      setSuccess('Payment processed successfully!');
      setTimeout(() => {
        navigate(`/trip/${tripId}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
Please log in to process payment
        </Typography>
      </Container>
    );
  }

  if (!tripId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
No trip specified for payment
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
          Process Payment
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Complete payment for your trip
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

      <form onSubmit={handleSubmit} noValidate sx={{ maxWidth: 500, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Payment Details
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <AttachMoneyIcon fontSize="medium" sx={{ color: 'primary.main' }} />
            <Typography variant="body1">
              $15.00
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Card Information
          </Typography>
          <CardElement />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Your card will be charged $15.00 for this trip.
          </Typography>
        </Box>

        {paymentProcessing && (
          <Box sx={{ mb: 4 }}>
            <LinearProgress />
          </Box>
        )}

        <Box sx={{ textAlign: 'right', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/trip/${tripId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            disabled={paymentProcessing || !clientSecret}
          >
            {paymentProcessing ? 'Processing...' : 'Pay $15.00'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default PaymentPage;