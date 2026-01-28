import React, { forwardRef } from 'react';

const Radio = forwardRef(({
  label,
  name,
  value,
  checked,
  onChange,
  onBlur,
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
      <div className="flex items-center">
        <input
          ref={ref}
          id={`${name}-${value}`}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            h-4 w-4
            ${hasError
              ? 'border-red-300 text-red-600 focus:ring-red-500'
              : 'border-gray-300 text-blue-600 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
            focus:ring-2 focus:ring-opacity-50
            ${className}
          `}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={`${name}-${value}`}
            className={`
              ml-2 block text-sm
              ${disabled ? 'text-gray-500' : 'text-gray-900'}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
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

Radio.displayName = 'Radio';

export default Radio;