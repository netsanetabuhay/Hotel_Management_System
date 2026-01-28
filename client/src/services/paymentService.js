import api from './api';
import { API_ENDPOINTS } from './axiosConfig';

export const paymentService = {
  // Get all payments
  getAllPayments: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.BASE, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PAYMENTS.BASE, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update payment
  updatePayment: async (paymentId, paymentData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (paymentId, status) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.PAYMENTS.BASE}/status/${paymentId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete payment
  deletePayment: async (paymentId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search payments
  searchPayments: async (identifier) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PAYMENTS.SEARCH}/${identifier}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment statistics
  getPaymentStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get reservation payments
  getReservationPayments: async (reservationId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PAYMENTS.BASE}/reservation/${reservationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get guest payments
  getGuestPayments: async (guestId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PAYMENTS.BASE}/guest/${guestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Process payment
  processPayment: async (paymentId, paymentDetails) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}/process`, paymentDetails);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Refund payment
  refundPayment: async (paymentId, refundData) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate invoice
  generateInvoice: async (paymentId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}/invoice`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PAYMENTS.BASE}/methods`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get today's payments
  getTodaysPayments: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PAYMENTS.BASE}/today`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment summary
  getPaymentSummary: async (startDate, endDate) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PAYMENTS.BASE}/summary`, {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default paymentService;