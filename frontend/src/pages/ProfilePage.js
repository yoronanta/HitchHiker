import React, { useState } from 'react';
import { Container, Box, Typography, Button, CircularProgress, TextField, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setEditing(false);
    const result = await updateProfile(formData);
    if (!result.success) {
      alert('Failed to update profile: ' + (result.error || 'Unknown error'));
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h5" align="center" color="text.secondary">
Please log in to view profile
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}>
          {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'H'}
        </Avatar>
        <Typography variant="h4" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {user.email}
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Account Info
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3}>
            <Box sx={{ minWidth: 150 }}>
              <Typography variant="body2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">
                {user.isDriver ? 'Driver' : 'Rider'}
                {user.isDriver && user.isVerified && (
                  <span sx={{ color: 'success.main', ml: 1 }}>
                    ✓ Verified
                  </span>
                )}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 150 }}>
              <Typography variant="body2" color="text.secondary">
                Member Since
              </Typography>
              <Typography variant="body1">
                {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {editing ? (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Edit Profile
            </Typography>
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
              label="Phone Number"
              InputProps={{
                startAdornment: <PhoneOutlinedIcon fontSize="small" />
              }}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              mb={2}
            />
            <Box sx={{ textAlign: 'right', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Information
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={3}>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">
                  {user.name || 'Not provided'}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user.email || 'Not provided'}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {user.phone || 'Not provided'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Vehicle Information (for drivers)
          </Typography>
          {user.isDriver ? (
            <Box>
              {user.vehicleInfo ? (
                <Box display="flex" flexWrap="wrap" gap={3}>
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="body2" color="text.secondary">
                      Make & Model
                    </Typography>
                    <Typography variant="body1">
                      {user.vehicleInfo.make || ''} {user.vehicleInfo.model || ''}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="body2" color="text.secondary">
                      Year
                    </Typography>
                    <Typography variant="body1">
                      {user.vehicleInfo.year || 'Not provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="body2" color="text.secondary">
                      Color
                    </Typography>
                    <Typography variant="body1">
                      {user.vehicleInfo.color || 'Not provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="body2" color="text.secondary">
                      License Plate
                    </Typography>
                    <Typography variant="body1">
                      {user.vehicleInfo.licensePlate || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No vehicle information provided
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              This section is for drivers only
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Rating
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, minWidth: 60 }}>
              {user.rating?.toFixed(1) || 'New'}
            </Typography>
            <div sx={{ display: 'flex' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <StarBorderIcon
                  key={star}
                  fontSize="medium"
                  sx={{ color: star <= (user.rating || 0) ? 'warning.main' : 'grey.400' }}
                />
              ))}
            </div>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Based on {user.totalRatings || 0} ratings
          </Typography>
        </Box>

        {!editing && (
          <Box sx={{ textAlign: 'right', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProfilePage;