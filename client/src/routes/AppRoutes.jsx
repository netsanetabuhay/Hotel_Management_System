import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardRouter from "../dashboard/DashboardRouter";
import Home from '../pages/Home';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard/*" element={
        <PrivateRoute>
          <DashboardRouter />
        </PrivateRoute>
      } />
      
      {/* Protected Profile Route */}
      <Route path="/profile" element={
        <PrivateRoute>
          <DashboardRouter />
        </PrivateRoute>
      } />
      
      {/* Admin Dashboard Route */}
      <Route path="/admin/dashboard" element={
        <PrivateRoute>
          <DashboardRouter />
        </PrivateRoute>
      } />
      
      {/* Protected page routes - will redirect to login */}
      <Route path="/rooms" element={
        <PrivateRoute>
          <DashboardRouter />
        </PrivateRoute>
      } />
      
      <Route path="/food-menu" element={
        <PrivateRoute>
          <DashboardRouter />
        </PrivateRoute>
      } />
      
      <Route path="/bookings" element={
        <PrivateRoute>
          <DashboardRouter />
        </PrivateRoute>
      } />
      
      <Route path="/orders" element={
        <PrivateRoute>
          <DashboardRouter />
        </PrivateRoute>
      } />
      
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;