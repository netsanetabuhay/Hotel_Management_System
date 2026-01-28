import { 
  USER_ROLES, 
  ROOM_STATUS, 
  RESERVATION_STATUS, 
  PAYMENT_STATUS,
  ORDER_STATUS,
  TASK_STATUS,
  ROOM_TYPES,
  PAYMENT_METHODS,
  FOOD_CATEGORIES,
  TASK_TYPES,
  TASK_PRIORITY
} from './constants';

// Format user role for display
export const formatUserRole = (role) => {
  const roleMap = {
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.MANAGER]: 'Manager',
    [USER_ROLES.RECEPTIONIST]: 'Receptionist',
    [USER_ROLES.HOUSEKEEPING]: 'Housekeeping',
    [USER_ROLES.CHEF]: 'Chef',
    [USER_ROLES.WAITER]: 'Waiter',
  };
  
  return roleMap[role] || role;
};

// Format room status for display
export const formatRoomStatus = (status) => {
  const statusMap = {
    [ROOM_STATUS.AVAILABLE]: 'Available',
    [ROOM_STATUS.OCCUPIED]: 'Occupied',
    [ROOM_STATUS.RESERVED]: 'Reserved',
    [ROOM_STATUS.CLEANING]: 'Cleaning',
    [ROOM_STATUS.MAINTENANCE]: 'Maintenance',
    [ROOM_STATUS.OUT_OF_ORDER]: 'Out of Order',
  };
  
  return statusMap[status] || status;
};

// Format reservation status for display
export const formatReservationStatus = (status) => {
  const statusMap = {
    [RESERVATION_STATUS.PENDING]: 'Pending',
    [RESERVATION_STATUS.CONFIRMED]: 'Confirmed',
    [RESERVATION_STATUS.CHECKED_IN]: 'Checked In',
    [RESERVATION_STATUS.CHECKED_OUT]: 'Checked Out',
    [RESERVATION_STATUS.CANCELLED]: 'Cancelled',
    [RESERVATION_STATUS.NO_SHOW]: 'No Show',
  };
  
  return statusMap[status] || status;
};

// Format payment status for display
export const formatPaymentStatus = (status) => {
  const statusMap = {
    [PAYMENT_STATUS.PENDING]: 'Pending',
    [PAYMENT_STATUS.PROCESSING]: 'Processing',
    [PAYMENT_STATUS.COMPLETED]: 'Completed',
    [PAYMENT_STATUS.FAILED]: 'Failed',
    [PAYMENT_STATUS.REFUNDED]: 'Refunded',
    [PAYMENT_STATUS.CANCELLED]: 'Cancelled',
  };
  
  return statusMap[status] || status;
};

// Format order status for display
export const formatOrderStatus = (status) => {
  const statusMap = {
    [ORDER_STATUS.PENDING]: 'Pending',
    [ORDER_STATUS.PREPARING]: 'Preparing',
    [ORDER_STATUS.READY]: 'Ready',
    [ORDER_STATUS.DELIVERED]: 'Delivered',
    [ORDER_STATUS.CANCELLED]: 'Cancelled',
  };
  
  return statusMap[status] || status;
};

// Format task status for display
export const formatTaskStatus = (status) => {
  const statusMap = {
    [TASK_STATUS.PENDING]: 'Pending',
    [TASK_STATUS.IN_PROGRESS]: 'In Progress',
    [TASK_STATUS.COMPLETED]: 'Completed',
    [TASK_STATUS.OVERDUE]: 'Overdue',
    [TASK_STATUS.CANCELLED]: 'Cancelled',
  };
  
  return statusMap[status] || status;
};

// Format room type for display
export const formatRoomType = (type) => {
  const typeMap = {
    [ROOM_TYPES.STANDARD]: 'Standard Room',
    [ROOM_TYPES.DELUXE]: 'Deluxe Room',
    [ROOM_TYPES.SUITE]: 'Suite',
    [ROOM_TYPES.PRESIDENTIAL]: 'Presidential Suite',
    [ROOM_TYPES.FAMILY]: 'Family Room',
  };
  
  return typeMap[type] || type;
};

// Format payment method for display
export const formatPaymentMethod = (method) => {
  const methodMap = {
    [PAYMENT_METHODS.CASH]: 'Cash',
    [PAYMENT_METHODS.CREDIT_CARD]: 'Credit Card',
    [PAYMENT_METHODS.DEBIT_CARD]: 'Debit Card',
    [PAYMENT_METHODS.MOBILE_PAYMENT]: 'Mobile Payment',
    [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
    [PAYMENT_METHODS.CHEQUE]: 'Cheque',
  };
  
  return methodMap[method] || method;
};

// Format food category for display
export const formatFoodCategory = (category) => {
  const categoryMap = {
    [FOOD_CATEGORIES.APPETIZER]: 'Appetizer',
    [FOOD_CATEGORIES.MAIN_COURSE]: 'Main Course',
    [FOOD_CATEGORIES.DESSERT]: 'Dessert',
    [FOOD_CATEGORIES.BEVERAGE]: 'Beverage',
    [FOOD_CATEGORIES.BREAKFAST]: 'Breakfast',
    [FOOD_CATEGORIES.LUNCH]: 'Lunch',
    [FOOD_CATEGORIES.DINNER]: 'Dinner',
    [FOOD_CATEGORIES.SNACK]: 'Snack',
  };
  
  return categoryMap[category] || category;
};

// Format task type for display
export const formatTaskType = (type) => {
  const typeMap = {
    [TASK_TYPES.HOUSEKEEPING]: 'Housekeeping',
    [TASK_TYPES.MAINTENANCE]: 'Maintenance',
    [TASK_TYPES.DELIVERY]: 'Delivery',
    [TASK_TYPES.INSPECTION]: 'Inspection',
    [TASK_TYPES.OTHER]: 'Other',
  };
  
  return typeMap[type] || type;
};

// Format task priority for display
export const formatTaskPriority = (priority) => {
  const priorityMap = {
    [TASK_PRIORITY.LOW]: 'Low',
    [TASK_PRIORITY.MEDIUM]: 'Medium',
    [TASK_PRIORITY.HIGH]: 'High',
    [TASK_PRIORITY.URGENT]: 'Urgent',
  };
  
  return priorityMap[priority] || priority;
};

// Format ID for display (remove prefix)
export const formatIdForDisplay = (id) => {
  if (!id) return '';
  // Remove common prefixes and show last part
  const parts = id.split('_');
  return parts.length > 1 ? parts[parts.length - 1] : id;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration
export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  const percentage = parseFloat(value);
  if (isNaN(percentage)) return '0%';
  
  return `${percentage.toFixed(decimals)}%`;
};

// Format rating
export const formatRating = (rating, max = 5) => {
  if (!rating) return 'No rating';
  
  const numRating = parseFloat(rating);
  if (isNaN(numRating)) return 'No rating';
  
  return `${numRating.toFixed(1)} / ${max}`;
};

// Format boolean for display
export const formatBoolean = (value, trueText = 'Yes', falseText = 'No') => {
  if (value === true || value === 'true' || value === 1 || value === '1') {
    return trueText;
  }
  return falseText;
};

// Format array to comma-separated string
export const formatArrayToString = (array, maxItems = 3) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return '';
  }
  
  if (array.length <= maxItems) {
    return array.join(', ');
  }
  
  return `${array.slice(0, maxItems).join(', ')} +${array.length - maxItems} more`;
};

// Format object keys to readable labels
export const formatObjectKeys = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const formatted = {};
  Object.keys(obj).forEach(key => {
    // Convert snake_case to Title Case
    const formattedKey = key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    formatted[formattedKey] = obj[key];
  });
  
  return formatted;
};

// Format number with commas
export const formatNumberWithCommas = (number) => {
  if (number === null || number === undefined) return '0';
  
  const num = parseFloat(number);
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-US');
};

// Format time ago
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
  return formatDate(date, 'MMM d, yyyy');
};