import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const activityService = {
  // Get all activities
  getAllActivities: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ACTIVITIES.BASE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get activity by ID
  getActivityById: async (activityId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/id/${activityId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get activities by user
  getActivitiesByUser: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create activity log
  createActivity: async (activityData) => {
    try {
      const response = await api.post(API_ENDPOINTS.ACTIVITIES.BASE, activityData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update activity
  updateActivity: async (activityId, activityData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ACTIVITIES.BASE}/${activityId}`, activityData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete activity
  deleteActivity: async (activityId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.ACTIVITIES.BASE}/${activityId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get activity statistics
  getActivityStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ACTIVITIES.STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recent activities
  getRecentActivities: async (limit = 50) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/recent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get activities by date range
  getActivitiesByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/range`, {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get activities by type
  getActivitiesByType: async (activityType) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/type/${activityType}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user login history
  getUserLoginHistory: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/user/${userId}/logins`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get system activities
  getSystemActivities: async (params = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/system`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get audit trail
  getAuditTrail: async (entityType, entityId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/audit`, {
        params: { entity_type: entityType, entity_id: entityId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Clear old activities
  clearOldActivities: async (days = 90) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.ACTIVITIES.BASE}/clear`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export activities
  exportActivities: async (params = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ACTIVITIES.BASE}/export`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default activityService;