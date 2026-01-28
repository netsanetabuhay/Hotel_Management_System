import React, { forwardRef } from 'react';

const DatePicker = forwardRef(({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder = 'Select date',
  error = '',
  touched = false,
  disabled = false,
  required = false,
  helperText = '',
  minDate,
  maxDate,
  className = '',
  ...props
}, ref) => {
  const hasError = error && touched;

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return date;
  };

  const formattedValue = formatDateForInput(value);

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <input
          ref={ref}
          id={name}
          name={name}
          type="date"
          value={formattedValue}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          className={`
            block w-full rounded-lg border shadow-sm
            pl-10 pr-3 py-2
            ${hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${className}
          `}
          {...props}
        />
      </div>

      {helperText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}

      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;