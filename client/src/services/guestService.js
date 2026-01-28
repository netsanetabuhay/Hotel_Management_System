import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const guestService = {
  // Get all guests
  getAllGuests: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GUESTS.BASE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get guest by ID
  getGuestById: async (guestId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GUESTS.BASE}/${guestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new guest
  createGuest: async (guestData) => {
    try {
      const response = await api.post(API_ENDPOINTS.GUESTS.BASE, guestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update guest
  updateGuest: async (identifier, guestData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.GUESTS.BASE}/update/${identifier}`, guestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete guest
  deleteGuest: async (guestId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.GUESTS.BASE}/delet/${guestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search guests
  searchGuests: async (identifier) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GUESTS.SEARCH}/${identifier}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get guest statistics
  getGuestStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GUESTS.STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get guest reservations
  getGuestReservations: async (guestId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GUESTS.BASE}/${guestId}/reservations`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get guest payments
  getGuestPayments: async (guestId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GUESTS.BASE}/${guestId}/payments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get guest orders
  getGuestOrders: async (guestId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GUESTS.BASE}/${guestId}/orders`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default guestService;