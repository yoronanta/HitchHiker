import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Link, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" gutterBottom>
            Sign in to your HitchHiker account
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

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email Address"
                  type="email"
                  InputProps={{
                    startAdornment: <EmailOutlinedIcon fontSize="small" />
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  mb={2}
                  required
            />
            <TextField
              label="Password"
              type="password"
              InputProps={{
                startAdornment: <LockOutlinedIcon fontSize="small" />
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mb={3}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Sign In
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?
            </Typography>
            <Link
              component="button"
              variant="text"
              color="primary"
              href="/register"
            >
              Create Account
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;