import React from 'react';

const InfoCard = ({
  title,
  description,
  icon: Icon,
  variant = 'info', // info, success, warning, danger
  actions,
  className = '',
}) => {
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconColors = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  };

  return (
    <div className={`rounded-xl border p-4 ${variantClasses[variant]} ${className}`}>
      <div className="flex">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColors[variant]}`} />
          </div>
        )}
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          
          {description && (
            <div className="mt-1 text-sm">
              {description}
            </div>
          )}
          
          {actions && (
            <div className="mt-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;