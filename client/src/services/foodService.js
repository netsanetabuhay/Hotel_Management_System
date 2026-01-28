import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const foodService = {
  // Food Items Management
  // Get all food items
  getAllFoodItems: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.FOOD.ITEMS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get food item by ID
  getFoodItemById: async (foodId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.FOOD.ITEMS}/${foodId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create food item
  createFoodItem: async (foodData) => {
    try {
      const response = await api.post(API_ENDPOINTS.FOOD.ITEMS, foodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update food item
  updateFoodItem: async (foodId, foodData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.FOOD.ITEMS}/${foodId}`, foodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete food item
  deleteFoodItem: async (foodId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.FOOD.ITEMS}/${foodId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search food items
  searchFoodItems: async (identifier) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.FOOD.SEARCH}/${identifier}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Food Orders Management
  // Get all food orders
  getAllFoodOrders: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.FOOD.ORDERS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get food order by ID
  getFoodOrderById: async (orderId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create food order
  createFoodOrder: async (orderData) => {
    try {
      const response = await api.post(API_ENDPOINTS.FOOD.ORDERS, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update food order
  updateFoodOrder: async (orderId, orderData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update food order status
  updateFoodOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete food order
  deleteFoodOrder: async (orderId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search food orders
  searchFoodOrders: async (identifier) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.FOOD.ORDERS}/search/${identifier}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order items
  getOrderItems: async (orderId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}/items`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add item to order
  addOrderItem: async (orderId, itemData) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}/items`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove item from order
  removeOrderItem: async (orderId, itemId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get kitchen orders (pending/preparing)
  getKitchenOrders: async (status = 'preparing') => {
    try {
      const response = await api.get(`${API_ENDPOINTS.FOOD.ORDERS}/kitchen`, { params: { status } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark order as ready
  markOrderAsReady: async (orderId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}/ready`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark order as delivered
  markOrderAsDelivered: async (orderId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.FOOD.ORDERS}/${orderId}/delivered`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default foodService;