import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error = '',
  touched = false,
  disabled = false,
  required = false,
  helperText = '',
  className = '',
  ...props
}, ref) => {
  const hasError = error && touched;

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

      <select
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          block w-full rounded-lg border shadow-sm
          px-3 py-2
          ${hasError
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          appearance-none
          ${className}
        `}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        
        {options.map((option) => {
          if (typeof option === 'object') {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          }
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>

      {helperText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}

      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;