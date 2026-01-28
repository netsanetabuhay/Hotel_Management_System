import React from 'react';

const ButtonGroup = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`inline-flex rounded-lg shadow-sm ${className}`}
      role="group"
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        const isMiddle = !isFirst && !isLast;

        let roundedClasses = '';
        if (isFirst) {
          roundedClasses = 'rounded-l-lg rounded-r-none';
        } else if (isLast) {
          roundedClasses = 'rounded-r-lg rounded-l-none';
        } else if (isMiddle) {
          roundedClasses = 'rounded-none';
        }

        return React.cloneElement(child, {
          className: `
            ${child.props.className || ''}
            ${roundedClasses}
            -ml-px
            focus:z-10
            relative
          `,
        });
      })}
    </div>
  );
};

export default ButtonGroup;