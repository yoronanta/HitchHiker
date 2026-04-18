import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Link, CircularProgress, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    isDriver: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    const result = await register(formData);
    if (result.success) {
      setSuccess('Registration successful! Please log in.');
      // Clear form and navigate to login after a short delay
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        isDriver: false
      });
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 450, p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" gutterBottom>
            Join the HitchHiker community
          </Typography>

          {loading && (
            <Box sx={{ textAlign: 'center', my: 2 }}>
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
            <TextField
              label="Full Name"
              InputProps={{
                startAdornment: <PersonOutlinedIcon fontSize="small" />
              }}
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoFocus
              mb={2}
              required
            />
            <TextField
              label="Email Address"
              type="email"
              InputProps={{
                startAdornment: <EmailOutlinedIcon fontSize="small" />
              }}
              name="email"
              value={formData.email}
              onChange={handleChange}
              mb={2}
              required
            />
            <TextField
              label="Password"
              type="password"
              InputProps={{
                startAdornment: <LockOutlinedIcon fontSize="small" />
              }}
              name="password"
              value={formData.password}
              onChange={handleChange}
              mb={2}
              required
            />
            <TextField
              label="Phone Number (optional)"
              InputProps={{
                startAdornment: <PhoneOutlinedIcon fontSize="small" />
              }}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              mb={2}
            />
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDriver}
                    onChange={handleChange}
                    name="isDriver"
                    color="primary"
                  />
                }
                label="I want to offer rides (become a driver)"
              />
            </FormGroup>
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                As a driver, you'll be able to accept ride requests from passengers
              </Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Create Account
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
            <Link
              component="button"
              variant="text"
              color="primary"
              href="/login"
            >
              Sign In
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;