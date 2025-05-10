import React, { ReactNode } from 'react';

interface PanelProps {
  title: string | ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  description?: string;
  rightElement?: ReactNode;
  onHelp?: () => void;
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
  rightElement,
  onHelp
}) => {
  return (
    <div className={`bg-blue-50 dark:bg-darkBlue-900 rounded-lg p-5 border border-blue-100 dark:border-darkBlue-700 shadow-sm transition-colors duration-200 ${className}`}>
      <div className="relative mb-3 pb-2 border-b border-blue-200 dark:border-darkBlue-600 transition-colors duration-200">
        <div className="flex justify-between items-center">
          <h4 className={`text-md font-medium text-blue-800 dark:text-blue-300 transition-colors duration-200 ${titleClassName}`}>
            {title}
          </h4>

          <div className="flex items-center space-x-3">
            {onHelp && (
              <button
                onClick={onHelp}
                className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center text-xs font-medium dark:bg-darkBlue-700 dark:text-basshead-blue-300 dark:hover:bg-darkBlue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-basshead-blue-500"
                aria-label="View help information"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {/* Optional right element (e.g., toggle controls) */}
            {rightElement && (
              <div>
                {rightElement}
              </div>
            )}
          </div>
        </div>
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