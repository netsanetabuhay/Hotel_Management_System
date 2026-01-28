// Axios configuration constants
export const API_TIMEOUT = 30000;
export const MAX_RETRIES = 3;

// Common headers
export const COMMON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    LOGOUT: '/users/logout',
  },
  USERS: {
    BASE: '/users',
    STATS: '/users/stats/overview',
  },
  GUESTS: {
    BASE: '/guests',
    SEARCH: '/guests/search',
    STATS: '/guests/stats/statistics',
  },
  ROOMS: {
    BASE: '/rooms',
    AVAILABLE: '/rooms/status/available',
    STATS: '/rooms/stats',
    SEARCH: '/rooms/search',
  },
  RESERVATIONS: {
    BASE: '/reservations',
    CHECK_AVAILABILITY: '/reservations/check-availability',
    AVAILABLE_ROOMS: '/reservations/available-rooms',
    SEARCH: '/reservations/search',
  },
  FOOD: {
    ITEMS: '/food-items',
    ORDERS: '/food-orders',
    SEARCH: '/food-items/search',
  },
  PAYMENTS: {
    BASE: '/payments',
    STATS: '/payments/stats/statistics',
    SEARCH: '/payments/search',
  },
  TASKS: {
    BASE: '/tasks',
    SEARCH: '/tasks/search',
  },
  ACTIVITIES: {
    BASE: '/activities',
    STATS: '/activities/stats/overview',
  },
};