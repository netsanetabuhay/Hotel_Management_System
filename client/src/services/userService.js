import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const userService = {
  // Get all users
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.BASE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.BASE}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.BASE, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.USERS.BASE}/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.USERS.BASE}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.USERS.BASE}/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search users
  searchUsers: async (searchTerm) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.BASE}/search/${searchTerm}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userService;