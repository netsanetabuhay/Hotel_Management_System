import React from 'react';

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral', // positive, negative, neutral
  icon: Icon,
  trendIcon: TrendIcon,
  description,
  loading = false,
  className = '',
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  const iconColors = {
    primary: 'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    danger: 'text-red-600 bg-red-50',
    info: 'text-indigo-600 bg-indigo-50',
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
          ) : (
            <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg ${iconColors.primary}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-4 flex items-center justify-between">
          {change && (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
              {TrendIcon && <TrendIcon className="w-3 h-3 mr-1" />}
              {change}
            </div>
          )}
          
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;