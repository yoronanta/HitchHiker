import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { MapProvider } from './context/MapContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TripFormPage from './pages/TripFormPage';
import TripListPage from './pages/TripListPage';
import TripDetailsPage from './pages/TripDetailsPage';
import RatingPage from './pages/RatingPage';
import PaymentPage from './pages/PaymentPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TripProvider>
          <MapProvider>
            <Navbar />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/trip/new" element={<PrivateRoute><TripFormPage /></PrivateRoute>} />
              <Route path="/trips" element={<PrivateRoute><TripListPage /></PrivateRoute>} />
              <Route path="/trip/:id" element={<PrivateRoute><TripDetailsPage /></PrivateRoute>} />
              <Route path="/trip/:id/rate" element={<PrivateRoute><RatingPage /></PrivateRoute>} />
              <Route path="/payment/:tripId" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MapProvider>
        </TripProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;