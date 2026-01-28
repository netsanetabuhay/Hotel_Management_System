import { 
  format, 
  parseISO, 
  isValid, 
  addDays, 
  subDays, 
  isBefore, 
  isAfter, 
  isSameDay,
  differenceInDays,
  differenceInHours,
  startOfDay,
  endOfDay,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isWeekend,
  getDay,
  getMonth,
  getYear,
  parse,
  formatDistance,
  formatDistanceToNow
} from 'date-fns';

// Check if date is valid
export const isValidDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch (error) {
    return false;
  }
};

// Get today's date in YYYY-MM-DD format
export const getToday = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Get tomorrow's date
export const getTomorrow = () => {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd');
};

// Get yesterday's date
export const getYesterday = () => {
  return format(subDays(new Date(), 1), 'yyyy-MM-dd');
};

// Get date X days from now
export const getDateFromNow = (days) => {
  return format(addDays(new Date(), days), 'yyyy-MM-dd');
};

// Format date for API (YYYY-MM-DD)
export const formatDateForAPI = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

// Format datetime for API (YYYY-MM-DD HH:mm:ss)
export const formatDateTimeForAPI = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'yyyy-MM-dd HH:mm:ss');
  } catch (error) {
    return '';
  }
};

// Parse date from string
export const parseDateString = (dateString, formatStr = 'yyyy-MM-dd') => {
  if (!dateString) return null;
  
  try {
    const parsed = parse(dateString, formatStr, new Date());
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

// Check if date is in the past
export const isDateInPast = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    return isBefore(dateObj, new Date());
  } catch (error) {
    return false;
  }
};

// Check if date is in the future
export const isDateInFuture = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    return isAfter(dateObj, new Date());
  } catch (error) {
    return false;
  }
};

// Check if date is today
export const isDateToday = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    return isSameDay(dateObj, new Date());
  } catch (error) {
    return false;
  }
};

// Calculate age from birth date
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  try {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    if (!isValid(birth)) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return null;
  }
};

// Get start and end of current month
export const getCurrentMonthRange = () => {
  const today = new Date();
  return {
    start: format(startOfMonth(today), 'yyyy-MM-dd'),
    end: format(endOfMonth(today), 'yyyy-MM-dd')
  };
};

// Get start and end of current week
export const getCurrentWeekRange = () => {
  const today = new Date();
  return {
    start: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    end: format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  };
};

// Get date range for last N days
export const getLastNDaysRange = (days = 30) => {
  const today = new Date();
  const startDate = subDays(today, days - 1);
  
  return {
    start: format(startDate, 'yyyy-MM-dd'),
    end: format(today, 'yyyy-MM-dd')
  };
};

// Get date range for next N days
export const getNextNDaysRange = (days = 30) => {
  const today = new Date();
  const endDate = addDays(today, days - 1);
  
  return {
    start: format(today, 'yyyy-MM-dd'),
    end: format(endDate, 'yyyy-MM-dd')
  };
};

// Check if date is within range
export const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  
  try {
    const checkDate = typeof date === 'string' ? parseISO(date) : date;
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    if (!isValid(checkDate) || !isValid(start) || !isValid(end)) {
      return false;
    }
    
    return (
      (isSameDay(checkDate, start) || isAfter(checkDate, start)) &&
      (isSameDay(checkDate, end) || isBefore(checkDate, end))
    );
  } catch (error) {
    return false;
  }
};

// Get day name
export const getDayName = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'EEEE');
  } catch (error) {
    return '';
  }
};

// Get month name
export const getMonthName = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'MMMM');
  } catch (error) {
    return '';
  }
};

// Get quarter
export const getQuarter = (date) => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    
    const month = getMonth(dateObj);
    return Math.floor(month / 3) + 1;
  } catch (error) {
    return null;
  }
};

// Check if date is weekend
export const isWeekendDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    return isWeekend(dateObj);
  } catch (error) {
    return false;
  }
};

// Get business days between two dates
export const getBusinessDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    if (!isValid(start) || !isValid(end)) return 0;
    
    let businessDays = 0;
    let currentDate = startOfDay(start);
    const lastDate = startOfDay(end);
    
    while (currentDate <= lastDate) {
      if (!isWeekend(currentDate)) {
        businessDays++;
      }
      currentDate = addDays(currentDate, 1);
    }
    
    return businessDays;
  } catch (error) {
    return 0;
  }
};

// Format relative time (e.g., "2 hours ago", "in 3 days")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return '';
  }
};

// Get timezone offset string
export const getTimezoneOffset = () => {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const sign = offset <= 0 ? '+' : '-';
  
  return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};