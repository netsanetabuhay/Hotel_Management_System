// Supported currencies
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  MXN: { symbol: 'MX$', name: 'Mexican Peso', code: 'MXN' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL' },
  RUB: { symbol: '₽', name: 'Russian Ruble', code: 'RUB' },
  KRW: { symbol: '₩', name: 'South Korean Won', code: 'KRW' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', code: 'NZD' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', code: 'HKD' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', code: 'SEK' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', code: 'NOK' },
  DKK: { symbol: 'kr', name: 'Danish Krone', code: 'DKK' },
  PLN: { symbol: 'zł', name: 'Polish Złoty', code: 'PLN' },
  TRY: { symbol: '₺', name: 'Turkish Lira', code: 'TRY' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', code: 'AED' },
  SAR: { symbol: 'ر.س', name: 'Saudi Riyal', code: 'SAR' },
  THB: { symbol: '฿', name: 'Thai Baht', code: 'THB' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', code: 'MYR' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', code: 'IDR' },
  PHP: { symbol: '₱', name: 'Philippine Peso', code: 'PHP' },
  VND: { symbol: '₫', name: 'Vietnamese Dong', code: 'VND' },
};

// Default currency
export const DEFAULT_CURRENCY = 'USD';

// Format currency amount
export const formatCurrency = (amount, currencyCode = DEFAULT_CURRENCY) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency.symbol}0.00`;
  }
  
  const amountNum = parseFloat(amount);
  
  // Format based on currency
  switch (currencyCode) {
    case 'JPY':
    case 'KRW':
    case 'VND':
    case 'IDR':
      // No decimal places for these currencies
      return `${currency.symbol}${amountNum.toFixed(0)}`;
    
    default:
      // Two decimal places for most currencies
      return `${currency.symbol}${amountNum.toFixed(2)}`;
  }
};

// Format currency with thousands separator
export const formatCurrencyWithSeparator = (amount, currencyCode = DEFAULT_CURRENCY) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency.symbol}0.00`;
  }
  
  const amountNum = parseFloat(amount);
  
  // Use Intl.NumberFormat for proper formatting
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amountNum);
};

// Extract numeric value from currency string
export const extractCurrencyValue = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove all non-numeric characters except decimal point
  const numericString = currencyString.replace(/[^\d.-]/g, '');
  
  const value = parseFloat(numericString);
  return isNaN(value) ? 0 : value;
};

// Convert between currencies (mock function - in real app, use API)
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (!amount || !fromCurrency || !toCurrency) return 0;
  
  // Mock conversion rates (in real app, fetch from API)
  const conversionRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    AUD: 1.35,
    CAD: 1.25,
    CHF: 0.92,
    CNY: 6.45,
    INR: 74.5,
  };
  
  const fromRate = conversionRates[fromCurrency] || 1;
  const toRate = conversionRates[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
};

// Calculate tax amount
export const calculateTax = (amount, taxRate = 0.10) => {
  if (!amount || isNaN(amount)) return 0;
  
  const amountNum = parseFloat(amount);
  return amountNum * taxRate;
};

// Calculate total with tax
export const calculateTotalWithTax = (amount, taxRate = 0.10) => {
  if (!amount || isNaN(amount)) return 0;
  
  const amountNum = parseFloat(amount);
  const tax = amountNum * taxRate;
  return amountNum + tax;
};

// Calculate discount
export const calculateDiscount = (amount, discountPercentage = 0) => {
  if (!amount || isNaN(amount) || !discountPercentage) return 0;
  
  const amountNum = parseFloat(amount);
  return amountNum * (discountPercentage / 100);
};

// Calculate amount after discount
export const calculateAmountAfterDiscount = (amount, discountPercentage = 0) => {
  if (!amount || isNaN(amount)) return 0;
  
  const amountNum = parseFloat(amount);
  const discount = discountPercentage ? amountNum * (discountPercentage / 100) : 0;
  return amountNum - discount;
};

// Calculate service charge
export const calculateServiceCharge = (amount, serviceRate = 0.05) => {
  if (!amount || isNaN(amount)) return 0;
  
  const amountNum = parseFloat(amount);
  return amountNum * serviceRate;
};

// Calculate grand total (amount + tax + service charge)
export const calculateGrandTotal = (amount, taxRate = 0.10, serviceRate = 0.05, discountPercentage = 0) => {
  if (!amount || isNaN(amount)) return 0;
  
  const amountNum = parseFloat(amount);
  const discount = discountPercentage ? amountNum * (discountPercentage / 100) : 0;
  const subtotal = amountNum - discount;
  const tax = subtotal * taxRate;
  const serviceCharge = subtotal * serviceRate;
  
  return subtotal + tax + serviceCharge;
};

// Split amount among people
export const splitAmount = (amount, numberOfPeople) => {
  if (!amount || isNaN(amount) || !numberOfPeople || numberOfPeople <= 0) return 0;
  
  const amountNum = parseFloat(amount);
  return amountNum / numberOfPeople;
};

// Round to nearest cent
export const roundToNearestCent = (amount) => {
  if (!amount || isNaN(amount)) return 0;
  
  const amountNum = parseFloat(amount);
  return Math.round(amountNum * 100) / 100;
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  const percentage = parseFloat(value);
  return `${percentage.toFixed(decimals)}%`;
};

// Validate currency amount
export const isValidCurrencyAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return false;
  
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum)) return false;
  
  return amountNum >= 0;
};

// Get currency symbol by code
export const getCurrencySymbol = (currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  return currency.symbol;
};

// Get currency name by code
export const getCurrencyName = (currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  return currency.name;
};

// Get all currencies as array
export const getAllCurrencies = () => {
  return Object.values(CURRENCIES).sort((a, b) => a.code.localeCompare(b.code));
};

// Parse currency string to object
export const parseCurrencyString = (currencyString) => {
  if (!currencyString) return { amount: 0, currency: DEFAULT_CURRENCY };
  
  // Try to extract currency code and amount
  const match = currencyString.match(/([A-Z]{3})\s?([\d.,]+)/);
  
  if (match) {
    const [, currencyCode, amountStr] = match;
    const amount = parseFloat(amountStr.replace(/,/g, ''));
    
    return {
      amount: isNaN(amount) ? 0 : amount,
      currency: CURRENCIES[currencyCode] ? currencyCode : DEFAULT_CURRENCY
    };
  }
  
  // If no currency code found, try to extract just the amount
  const amountMatch = currencyString.match(/([\d.,]+)/);
  if (amountMatch) {
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    return {
      amount: isNaN(amount) ? 0 : amount,
      currency: DEFAULT_CURRENCY
    };
  }
  
  return { amount: 0, currency: DEFAULT_CURRENCY };
};