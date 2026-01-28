import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const authService = {
  // User login
  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // User logout
  logout: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.BASE}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.USERS.BASE}/profile`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.USERS.BASE}/change-password`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.BASE}/verify`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;