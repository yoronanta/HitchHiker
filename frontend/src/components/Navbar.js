import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState(3); // Example notification count

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'user-menu' : undefined;

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" component="Link" href="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
          HitchHiker
        </Typography>
        <Button
          color="inherit"
          component={Link}
          href="/trips"
          sx={{ mr: 2 }}
          disabled={!user}
        >
          Find Rides
        </Button>
        <Button
          color="inherit"
          component={Link}
          href="/trip/new"
          sx={{ mr: 2 }}
          disabled={!user || !user.isDriver}
        >
          Offer Ride
        </Button>
        <Button
          color="inherit"
          component={Link}
          href="/profile"
          sx={{ mr: 2 }}
          disabled={!user}
        >
          Profile
        </Button>
        <IconButton
          aria-label="notifications"
          color="inherit"
          onClick={handleMenu}
        >
          <NotificationsOutlinedIcon />
          {notifications > 0 && (
            <Badge badgeContent={notifications} color="error">
              <span className="visually-hidden">notifications</span>
            </Badge>
          )}
        </IconButton>
        <Menu
          id={id}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 44 * 4, // 4 items
                width: 200
              }
            }
          }}
        >
          {user ? (
            <>
              <MenuItem onClick={handleClose}>
                <AccountCircleOutlinedIcon /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <LocalOfferOutlinedIcon /> My Trips
              </MenuItem>
              <MenuItem onClick={handleClose} disabled={!user.isDriver}>
                Verify as Driver
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <AccountCircleOutlinedIcon /> Logout
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleClose} component={Link} to="/login">
                Login
              </MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/register">
                Register
              </MenuItem>
            </>
          )}
        </Menu>
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" variant="contained" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;