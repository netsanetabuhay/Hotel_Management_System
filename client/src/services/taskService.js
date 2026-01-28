import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const taskService = {
  // Get all tasks
  getAllTasks: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.TASKS.BASE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create task
  createTask: async (taskData) => {
    try {
      const response = await api.post(API_ENDPOINTS.TASKS.BASE, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.TASKS.BASE}/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.TASKS.BASE}/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search tasks
  searchTasks: async (identifier) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.SEARCH}/${identifier}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get tasks by assigned user
  getTasksByUser: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get tasks by room
  getTasksByRoom: async (roomId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/room/${roomId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get tasks by status
  getTasksByStatus: async (status) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get today's tasks
  getTodaysTasks: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/today`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get overdue tasks
  getOverdueTasks: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/overdue`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign task to user
  assignTask: async (taskId, userId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/assign`, { userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Complete task
  completeTask: async (taskId, completionData = {}) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get task statistics
  getTaskStats: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get task types
  getTaskTypes: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/types`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get housekeeping tasks
  getHousekeepingTasks: async (params = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/housekeeping`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get maintenance tasks
  getMaintenanceTasks: async (params = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TASKS.BASE}/maintenance`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update task priority
  updateTaskPriority: async (taskId, priority) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.TASKS.BASE}/${taskId}/priority`, { priority });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default taskService;