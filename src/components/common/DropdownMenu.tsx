import React, { useState, useRef, useEffect } from 'react';

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface DropdownMenuProps {
  label: string;
  icon?: React.ReactNode;
  items: DropdownMenuItem[];
  buttonClassName?: string;
}

/**
 * A dropdown menu component that can be used in the application header
 */
const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  label, 
  icon, 
  items,
  buttonClassName = "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-darkBlue-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-darkBlue-700 hover:bg-gray-50 dark:hover:bg-darkBlue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 transition-colors duration-200"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Close the dropdown when pressing Escape
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
        <svg 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-darkBlue-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all duration-200">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-darkBlue-700 flex items-center transition-colors duration-200"
                role="menuitem"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;