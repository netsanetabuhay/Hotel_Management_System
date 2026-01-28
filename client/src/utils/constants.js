// User roles and permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  RECEPTIONIST: 'receptionist',
  HOUSEKEEPING: 'housekeeping',
  CHEF: 'chef',
  WAITER: 'waiter',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Room status constants
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  CLEANING: 'cleaning',
  MAINTENANCE: 'maintenance',
  OUT_OF_ORDER: 'out_of_order',
};

// Room types
export const ROOM_TYPES = {
  STANDARD: 'Standard',
  DELUXE: 'Deluxe',
  SUITE: 'Suite',
  PRESIDENTIAL: 'Presidential',
  FAMILY: 'Family',
};

// Reservation status
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked-in',
  CHECKED_OUT: 'checked-out',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit-card',
  DEBIT_CARD: 'debit-card',
  MOBILE_PAYMENT: 'mobile-payment',
  BANK_TRANSFER: 'bank-transfer',
  CHEQUE: 'cheque',
};

// Food order status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Food categories
export const FOOD_CATEGORIES = {
  APPETIZER: 'Appetizer',
  MAIN_COURSE: 'Main Course',
  DESSERT: 'Dessert',
  BEVERAGE: 'Beverage',
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
};

// Task status
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

// Task types
export const TASK_TYPES = {
  HOUSEKEEPING: 'housekeeping',
  MAINTENANCE: 'maintenance',
  DELIVERY: 'delivery',
  INSPECTION: 'inspection',
  OTHER: 'other',
};

// Task priority
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Activity types
export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  EXPORT: 'export',
  IMPORT: 'import',
  SYSTEM: 'system',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
};

// Validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[0-9\s\-\(\)]{10,}$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  ADDRESS_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 500,
};

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100],
};

// API response status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
  IDLE: 'idle',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};

// Role hierarchy (higher number = higher privilege)
export const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: 6,
  [USER_ROLES.MANAGER]: 5,
  [USER_ROLES.RECEPTIONIST]: 4,
  [USER_ROLES.CHEF]: 3,
  [USER_ROLES.HOUSEKEEPING]: 2,
  [USER_ROLES.WAITER]: 1,
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.RECEPTIONIST]: 'Receptionist',
  [USER_ROLES.HOUSEKEEPING]: 'Housekeeping',
  [USER_ROLES.CHEF]: 'Chef',
  [USER_ROLES.WAITER]: 'Waiter',
};

// Role permissions
export const ROLE_PERMISSIONS = {
  // Admin: Full access to everything
  [USER_ROLES.ADMIN]: {
    dashboard: ['view', 'manage'],
    users: ['view', 'create', 'edit', 'delete'],
    guests: ['view', 'create', 'edit', 'delete'],
    rooms: ['view', 'create', 'edit', 'delete', 'update_status'],
    reservations: ['view', 'create', 'edit', 'delete', 'check_in', 'check_out'],
    food: ['view_menu', 'edit_menu', 'view_orders', 'manage_orders'],
    payments: ['view', 'create', 'edit', 'delete', 'process'],
    tasks: ['view', 'create', 'edit', 'delete', 'assign'],
    reports: ['view', 'export'],
    settings: ['view', 'edit'],
    activities: ['view'],
  },
  
  // Manager: Managerial access
  [USER_ROLES.MANAGER]: {
    dashboard: ['view', 'manage'],
    users: ['view'],
    guests: ['view', 'create', 'edit', 'delete'],
    rooms: ['view', 'create', 'edit', 'update_status'],
    reservations: ['view', 'create', 'edit', 'delete', 'check_in', 'check_out'],
    food: ['view_menu', 'edit_menu', 'view_orders', 'manage_orders'],
    payments: ['view', 'create', 'edit', 'process'],
    tasks: ['view', 'create', 'edit', 'assign'],
    reports: ['view', 'export'],
    settings: ['view'],
    activities: ['view'],
  },
  
  // Receptionist: Front desk operations
  [USER_ROLES.RECEPTIONIST]: {
    dashboard: ['view'],
    users: [],
    guests: ['view', 'create', 'edit'],
    rooms: ['view', 'update_status'],
    reservations: ['view', 'create', 'edit', 'check_in', 'check_out'],
    food: ['view_menu', 'view_orders'],
    payments: ['view', 'create'],
    tasks: ['view'],
    reports: ['view'],
    settings: [],
    activities: [],
  },
  
  // Housekeeping: Room maintenance
  [USER_ROLES.HOUSEKEEPING]: {
    dashboard: ['view'],
    users: [],
    guests: ['view'],
    rooms: ['view', 'update_status'],
    reservations: ['view'],
    food: [],
    payments: [],
    tasks: ['view', 'edit'],
    reports: [],
    settings: [],
    activities: [],
  },
  
  // Chef: Kitchen operations
  [USER_ROLES.CHEF]: {
    dashboard: ['view'],
    users: [],
    guests: ['view'],
    rooms: [],
    reservations: ['view'],
    food: ['view_menu', 'edit_menu', 'view_orders', 'manage_orders'],
    payments: [],
    tasks: [],
    reports: [],
    settings: [],
    activities: [],
  },
  
  // Waiter: Food service
  [USER_ROLES.WAITER]: {
    dashboard: ['view'],
    users: [],
    guests: ['view'],
    rooms: [],
    reservations: ['view'],
    food: ['view_menu', 'view_orders', 'manage_orders'],
    payments: ['view'],
    tasks: [],
    reports: [],
    settings: [],
    activities: [],
  },
};