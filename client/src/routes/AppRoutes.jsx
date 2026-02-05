import { Routes, Route, Navigate } from 'react-router-dom'; // Remove 'Router' from imports
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Layout from '../components/Layout';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (token) {
    // Redirect based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }
  return children;
};

function AppRoutes() {
  return (
    // Remove <Router> wrapper here, keep only <Routes>
    <Routes>
      {/* Public Routes */}
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
      
      {/* Protected Routes */}
      <Route path="/" element={
        <PrivateRoute>
          <Layout>
            <Home />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;