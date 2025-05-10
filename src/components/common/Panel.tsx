import React, { ReactNode } from 'react';

interface PanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  description?: string;
  rightElement?: ReactNode;
}

/**
 * A reusable panel component with consistent styling for form sections
 */
const Panel: React.FC<PanelProps> = ({
  title,
  children,
  className = '',
  titleClassName = '',
  description,
  rightElement
}) => {
  return (
    <div className={`bg-blue-50 dark:bg-darkBlue-900 rounded-lg p-5 border border-blue-100 dark:border-darkBlue-700 shadow-sm transition-colors duration-200 ${className}`}>
      <div className="relative mb-3 pb-2 border-b border-blue-200 dark:border-darkBlue-600 transition-colors duration-200">
        <h4 className={`text-md font-medium text-blue-800 dark:text-blue-300 transition-colors duration-200 ${titleClassName}`}>
          {title}
        </h4>
        
        {/* Optional right element (e.g., toggle controls) */}
        {rightElement && (
          <div className="absolute top-0 right-0">
            {rightElement}
          </div>
        )}
      </div>
      
      {/* Optional description */}
      {description && (
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 transition-colors duration-200">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
};

export default Panel;