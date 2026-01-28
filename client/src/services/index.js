// Export all services from one file
export { default as api } from './api';
export * from './axiosConfig';

// Export individual services
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as guestService } from './guestService';
export { default as roomService } from './roomService';
export { default as reservationService } from './reservationService';
export { default as foodService } from './foodService';
export { default as paymentService } from './paymentService';
export { default as taskService } from './taskService';
export { default as activityService } from './activityService';