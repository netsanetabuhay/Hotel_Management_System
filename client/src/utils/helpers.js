import { DATE_FORMATS } from './constants';
import { format, parseISO, isValid } from 'date-fns';

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Format date
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// Format date range
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);
  
  return `${formattedStart} - ${formattedEnd}`;
};

// Calculate number of nights
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  
  try {
    const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
    const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
    
    if (!isValid(start) || !isValid(end)) return 0;
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Calculate nights error:', error);
    return 0;
  }
};

// Generate display name
export const getDisplayName = (firstName, lastName) => {
  if (!firstName && !lastName) return 'Unknown';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

// Generate initials
export const getInitials = (name) => {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  // Return original if format doesn't match
  return phone;
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    // Success/Positive statuses
    'active': 'green',
    'available': 'green',
    'completed': 'green',
    'confirmed': 'blue',
    'delivered': 'green',
    'ready': 'green',
    'checked-out': 'green',
    
    // Warning/Processing statuses
    'pending': 'yellow',
    'processing': 'yellow',
    'preparing': 'yellow',
    'in-progress': 'yellow',
    'cleaning': 'yellow',
    'reserved': 'blue',
    
    // Danger/Negative statuses
    'inactive': 'red',
    'cancelled': 'red',
    'failed': 'red',
    'overdue': 'red',
    'no-show': 'red',
    'maintenance': 'orange',
    'occupied': 'purple',
    'checked-in': 'purple',
  };
  
  return colors[status] || 'gray';
};

// Get status label
export const getStatusLabel = (status) => {
  if (!status) return '';
  
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

// Generate random ID
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`.toUpperCase();
};

// Parse API error
export const parseApiError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  
  return 'An unexpected error occurred';
};