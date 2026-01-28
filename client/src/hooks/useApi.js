import { useState, useCallback } from 'react';
import { API_STATUS } from '../utils/constants';

/**
 * Custom hook for making API calls
 * Provides loading, error, and data state management
 */
export const useApi = () => {
  const [status, setStatus] = useState(API_STATUS.IDLE);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Execute an API call
   * @param {Function} apiCall - The API function to call
   * @param {Array} args - Arguments to pass to the API function
   * @returns {Promise} - The API response
   */
  const execute = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setStatus(API_STATUS.LOADING);
    setError(null);

    try {
      const response = await apiCall(...args);
      
      setData(response);
      setStatus(API_STATUS.SUCCESS);
      return response;
    } catch (err) {
      const errorMessage = err?.message || err?.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      setStatus(API_STATUS.ERROR);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setStatus(API_STATUS.IDLE);
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    // State
    status,
    data,
    error,
    loading,
    
    // Actions
    execute,
    reset,
    setData,
    setError,
    
    // Status helpers
    isIdle: status === API_STATUS.IDLE,
    isLoading: status === API_STATUS.LOADING,
    isSuccess: status === API_STATUS.SUCCESS,
    isError: status === API_STATUS.ERROR,
    
    // Aliases
    isPending: loading,
  };
};

export default useApi;