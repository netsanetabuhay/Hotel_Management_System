import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const roomService = {
  // Get all rooms
  getAllRooms: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ROOMS.BASE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get available rooms
  getAvailableRooms: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ROOMS.AVAILABLE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get room by ID
  getRoomById: async (roomId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ROOMS.BASE}/id/${roomId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get room by number
  getRoomByNumber: async (roomNumber) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ROOMS.BASE}/number/${roomNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new room
  createRoom: async (roomData) => {
    try {
      const response = await api.post(API_ENDPOINTS.ROOMS.BASE, roomData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update room
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ROOMS.BASE}/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update room status
  updateRoomStatus: async (roomId, status) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.ROOMS.BASE}/statusupdate/${roomId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete room
  deleteRoom: async (roomId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.ROOMS.BASE}/${roomId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search rooms
  searchRooms: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ROOMS.SEARCH, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get room statistics
  getRoomStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ROOMS.STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get room reservations
  getRoomReservations: async (roomId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ROOMS.BASE}/${roomId}/reservations`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get room maintenance history
  getRoomMaintenance: async (roomId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ROOMS.BASE}/${roomId}/maintenance`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default roomService;