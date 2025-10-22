import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import MainLayout from './components/layout/MainLayout';
import PartnerLayout from './components/layout/PartnerLayout';

// Pages
import HomePage from './pages/customer/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import SearchResults from './pages/customer/SearchResults';
import AllServices from './pages/customer/AllServices';
import CategoryView from './pages/customer/CategoryView';
import ServiceDetails from './pages/customer/ServiceDetails';
import ProviderDetails from './pages/customer/ProviderDetails';
import ServiceBooking from './pages/customer/ServiceBooking';
import MyBookings from './pages/customer/MyBookings';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import PaymentSuccess from './pages/customer/PaymentSuccess';
import PartnerDashboard from './pages/partner/Dashboard';
import PartnerServices from './pages/partner/Services';
import PartnerBookings from './pages/partner/Bookings';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient();

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
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Customer Routes with MainLayout */}
      <Route path="/" element={
        <MainLayout>
          <HomePage />
        </MainLayout>
      } />
      <Route path="/search" element={
        <MainLayout>
          <SearchResults />
        </MainLayout>
      } />
      <Route path="/services" element={
        <MainLayout>
          <AllServices />
        </MainLayout>
      } />
      <Route path="/category/:categorySlug" element={
        <MainLayout>
          <CategoryView />
        </MainLayout>
      } />
      <Route path="/service/:serviceSlug" element={
        <MainLayout>
          <ServiceDetails />
        </MainLayout>
      } />
      <Route path="/service/:serviceSlug/provider/:partnerId" element={
        <MainLayout>
          <ProviderDetails />
        </MainLayout>
      } />
      <Route path="/book/:serviceSlug" element={
        <ProtectedRoute userType="CUSTOMER">
          <MainLayout>
            <ServiceBooking />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute userType="CUSTOMER">
          <MainLayout>
            <CustomerDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-bookings" element={
        <ProtectedRoute userType="CUSTOMER">
          <MainLayout>
            <MyBookings />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute userType="CUSTOMER">
          <MainLayout>
            <Cart />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute userType="CUSTOMER">
          <MainLayout>
            <Checkout />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/payment-success" element={
        <ProtectedRoute userType="CUSTOMER">
          <MainLayout>
            <PaymentSuccess />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Partner Routes with PartnerLayout */}
      <Route path="/partner" element={
        <ProtectedRoute userType="PARTNER">
          <PartnerLayout>
            <PartnerDashboard />
          </PartnerLayout>
        </ProtectedRoute>
      } />
      <Route path="/partner/services" element={
        <ProtectedRoute userType="PARTNER">
          <PartnerLayout>
            <PartnerServices />
          </PartnerLayout>
        </ProtectedRoute>
      } />
      <Route path="/partner/bookings" element={
        <ProtectedRoute userType="PARTNER">
          <PartnerLayout>
            <PartnerBookings />
          </PartnerLayout>
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={
        <MainLayout>
          <NotFound />
        </MainLayout>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
