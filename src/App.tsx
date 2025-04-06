import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import ServiceBooking from './pages/customer/ServiceBooking';
import MyBookings from './pages/customer/MyBookings';
import PartnerDashboard from './pages/partner/Dashboard';
import PartnerServices from './pages/partner/Services';
import PartnerBookings from './pages/partner/Bookings';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode; userType?: string }> = ({ 
  children, 
  userType 
}) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (userType && currentUser?.userType !== userType) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Customer Routes */}
      <Route path="/" element={
        <ProtectedRoute userType="CUSTOMER">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/book/:serviceId" element={
        <ProtectedRoute userType="CUSTOMER">
          <ServiceBooking />
        </ProtectedRoute>
      } />
      <Route path="/my-bookings" element={
        <ProtectedRoute userType="CUSTOMER">
          <MyBookings />
        </ProtectedRoute>
      } />
      
      {/* Partner Routes */}
      <Route path="/partner" element={
        <ProtectedRoute userType="PARTNER">
          <PartnerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/partner/services" element={
        <ProtectedRoute userType="PARTNER">
          <PartnerServices/>
        </ProtectedRoute>
      } />
      <Route path="/partner/bookings" element={
        <ProtectedRoute userType="PARTNER">
          <PartnerBookings />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
