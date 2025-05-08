import { ReactNode, useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

/**
 * Reusable Modal component with ESC key handling
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true
}: ModalProps) => {
  // Add ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Add event listener when the modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    // Clean up the event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size classes for modal width
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity duration-200">
      <div className={`bg-white dark:bg-darkBlue-800 rounded-lg shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] flex flex-col overflow-hidden transition-all duration-200 transform`}>
        <div className="p-6 border-b border-gray-200 dark:border-darkBlue-700 flex justify-between items-center bg-gray-50 dark:bg-darkBlue-900 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 rounded-full p-1 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-darkBlue-700 flex justify-end bg-gray-50 dark:bg-darkBlue-900 transition-colors duration-200">
          <div className="text-sm text-gray-500 dark:text-gray-400 mr-auto flex items-center">
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-darkBlue-700 rounded shadow-sm text-xs mr-1 transition-colors duration-200">ESC</kbd> to close
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 dark:bg-basshead-blue-600 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-basshead-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;