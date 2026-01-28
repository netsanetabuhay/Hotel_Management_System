import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = true,
  hover = false,
  shadow = 'medium',
  border = true,
  className = '',
  ...props
}) => {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    medium: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const borderClass = border ? 'border border-gray-200' : '';
  const paddingClass = padding ? 'p-6' : '';
  const hoverClass = hover ? 'transition-shadow hover:shadow-lg' : '';

  return (
    <div
      className={`
        bg-white rounded-xl
        ${borderClass}
        ${shadowClasses[shadow]}
        ${hoverClass}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      <div className={paddingClass}>
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;