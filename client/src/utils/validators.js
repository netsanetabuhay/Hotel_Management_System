import { VALIDATION } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!VALIDATION.EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  if (email.length > VALIDATION.EMAIL_MAX_LENGTH) return `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`;
  return '';
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
  return '';
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!VALIDATION.PHONE_REGEX.test(phone)) return 'Please enter a valid phone number';
  if (phone.length > VALIDATION.PHONE_MAX_LENGTH) return `Phone number must be less than ${VALIDATION.PHONE_MAX_LENGTH} characters`;
  return '';
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (name.length > VALIDATION.NAME_MAX_LENGTH) return `${fieldName} must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`;
  return '';
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value && value !== 0) return `${fieldName} is required`;
  if (typeof value === 'string' && value.trim() === '') return `${fieldName} is required`;
  return '';
};

// Number validation
export const validateNumber = (value, fieldName, min = null, max = null) => {
  const requiredError = validateRequired(value, fieldName);
  if (requiredError) return requiredError;
  
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (min !== null && num < min) return `${fieldName} must be at least ${min}`;
  if (max !== null && num > max) return `${fieldName} must be at most ${max}`;
  return '';
};

// Date validation
export const validateDate = (date, fieldName) => {
  const requiredError = validateRequired(date, fieldName);
  if (requiredError) return requiredError;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `${fieldName} must be a valid date`;
  if (dateObj > new Date('2100-01-01')) return `${fieldName} cannot be in the far future`;
  return '';
};

// Future date validation
export const validateFutureDate = (date, fieldName) => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) return `${fieldName} cannot be in the past`;
  return '';
};

// Date range validation
export const validateDateRange = (startDate, endDate, startField = 'Check-in', endField = 'Check-out') => {
  const startError = validateDate(startDate, startField);
  if (startError) return startError;
  
  const endError = validateDate(endDate, endField);
  if (endError) return endError;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end <= start) return `${endField} must be after ${startField}`;
  
  // Check if stay is too long (more than 30 days)
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 30) return 'Maximum stay is 30 days';
  
  return '';
};

// Email/Phone validation (either one is required)
export const validateEmailOrPhone = (email, phone) => {
  if (!email && !phone) return 'Either email or phone number is required';
  if (email) {
    const emailError = validateEmail(email);
    if (emailError) return emailError;
  }
  if (phone) {
    const phoneError = validatePhone(phone);
    if (phoneError) return phoneError;
  }
  return '';
};

// Array validation
export const validateArray = (array, fieldName, minLength = 1) => {
  if (!array || !Array.isArray(array)) return `${fieldName} must be an array`;
  if (array.length < minLength) return `${fieldName} must have at least ${minLength} item${minLength > 1 ? 's' : ''}`;
  return '';
};

// Object validation
export const validateObject = (obj, fieldName) => {
  if (!obj || typeof obj !== 'object') return `${fieldName} must be an object`;
  if (Object.keys(obj).length === 0) return `${fieldName} cannot be empty`;
  return '';
};

// URL validation
export const validateURL = (url) => {
  if (!url) return '';
  
  try {
    new URL(url);
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};

// Validate guest form
export const validateGuestForm = (data) => {
  const errors = {};
  
  errors.firstName = validateName(data.firstName, 'First name');
  errors.lastName = validateName(data.lastName, 'Last name');
  errors.email = validateEmailOrPhone(data.email, data.phone);
  errors.phone = data.phone ? validatePhone(data.phone) : '';
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return errors;
};

// Validate reservation form
export const validateReservationForm = (data) => {
  const errors = {};
  
  errors.guestId = validateRequired(data.guestId, 'Guest');
  errors.roomId = validateRequired(data.roomId, 'Room');
  errors.checkIn = validateDate(data.checkIn, 'Check-in date');
  errors.checkOut = validateDate(data.checkOut, 'Check-out date');
  errors.adults = validateNumber(data.adults, 'Number of adults', 1, 10);
  
  if (data.children !== undefined && data.children !== null && data.children !== '') {
    errors.children = validateNumber(data.children, 'Number of children', 0, 10);
  }
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return errors;
};

// Validate room form
export const validateRoomForm = (data) => {
  const errors = {};
  
  errors.roomNumber = validateRequired(data.roomNumber, 'Room number');
  errors.roomType = validateRequired(data.roomType, 'Room type');
  errors.price = validateNumber(data.price, 'Price', 1, 10000);
  errors.capacity = validateNumber(data.capacity, 'Capacity', 1, 10);
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return errors;
};