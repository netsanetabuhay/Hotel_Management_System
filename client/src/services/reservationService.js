import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const reservationService = {
  // Get all reservations
  getAllReservations: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.RESERVATIONS.BASE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get reservation by ID
  getReservationById: async (reservationId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.RESERVATIONS.BASE}/${reservationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new reservation
  createReservation: async (reservationData) => {
    try {
      const response = await api.post(API_ENDPOINTS.RESERVATIONS.BASE, reservationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update reservation
  updateReservation: async (reservationId, reservationData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.RESERVATIONS.BASE}/${reservationId}`, reservationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update reservation status
  updateReservationStatus: async (reservationId, status) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.RESERVATIONS.BASE}/${reservationId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete reservation
  deleteReservation: async (reservationId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.RESERVATIONS.BASE}/${reservationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search reservations
  searchReservations: async (identifier) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.RESERVATIONS.SEARCH}/${identifier}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check room availability
  checkAvailability: async (roomId, checkIn, checkOut) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.RESERVATIONS.CHECK_AVAILABILITY}/${roomId}`, {
        params: { check_in: checkIn, check_out: checkOut }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Find available rooms
  findAvailableRooms: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.RESERVATIONS.AVAILABLE_ROOMS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check-in reservation
  checkIn: async (reservationId, checkInData = {}) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.RESERVATIONS.BASE}/${reservationId}/check-in`, checkInData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check-out reservation
  checkOut: async (reservationId, checkOutData = {}) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.RESERVATIONS.BASE}/${reservationId}/check-out`, checkOutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get reservation payments
  getReservationPayments: async (reservationId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.RESERVATIONS.BASE}/${reservationId}/payments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get reservation services
  getReservationServices: async (reservationId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.RESERVATIONS.BASE}/${reservationId}/services`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default reservationService;