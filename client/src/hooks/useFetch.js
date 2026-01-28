import { useState, useEffect, useCallback } from 'react';
import { API_STATUS } from '../utils/constants';

/**
 * Custom hook for fetching data
 * Similar to useApi but specifically for GET requests
 */
export const useFetch = (fetchFunction, immediate = true, ...args) => {
  const [status, setStatus] = useState(API_STATUS.IDLE);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...executeArgs) => {
    setLoading(true);
    setStatus(API_STATUS.LOADING);
    setError(null);

    try {
      const response = await fetchFunction(...executeArgs);
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
  }, [fetchFunction]);

  // Refetch function
  const refetch = useCallback(() => {
    return execute(...args);
  }, [execute, args]);

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      execute(...args);
    }
  }, [execute, immediate, args]);

  // Reset state
  const reset = useCallback(() => {
    setStatus(API_STATUS.IDLE);
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Set data manually
  const setDataManually = useCallback((newData) => {
    setData(newData);
  }, []);

  // Update data partially
  const updateData = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  return {
    // State
    status,
    data,
    error,
    loading,
    
    // Actions
    execute,
    refetch,
    reset,
    setData: setDataManually,
    updateData,
    
    // Status helpers
    isIdle: status === API_STATUS.IDLE,
    isLoading: status === API_STATUS.LOADING,
    isSuccess: status === API_STATUS.SUCCESS,
    isError: status === API_STATUS.ERROR,
    
    // Aliases
    isPending: loading,
    fetchData: execute,
  };
};

export default useFetch;