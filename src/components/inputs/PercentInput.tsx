import React, { useState } from 'react';
import { formatPercentValue } from '../../utils/formatUtils';

interface PercentInputProps {
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * A specialized input component for percentage values
 * - Formats with % and appropriate decimal places when not being edited
 * - Shows raw value during editing
 * - Strips % and commas from input
 */
const PercentInput: React.FC<PercentInputProps> = ({
  name,
  value,
  onChange,
  label,
  className = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Format for display when not editing
  const displayValue = !isEditing && (typeof value === 'number' || value === '') 
    ? formatPercentValue(typeof value === 'number' ? value : parseFloat(value) || 0) 
    : value;
  
  // Custom change handler to strip % and commas
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Strip % and commas from input
    const cleanValue = rawValue.replace(/%/g, '').replace(/,/g, '');
    
    // Special handling for decimal points
    if (cleanValue.endsWith('.') || cleanValue.includes('.')) {
      // Create a synthetic event with the cleaned value (preserve string during editing)
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: cleanValue
        }
      };
      
      onChange(syntheticEvent);
      return;
    }
    
    // For non-decimal values
    if (cleanValue === '') {
      // Keep empty strings as is
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: cleanValue
        }
      };
      onChange(syntheticEvent);
    } else {
      // Try to convert to number
      const numValue = parseFloat(cleanValue);
      if (!isNaN(numValue)) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name,
            value: numValue.toString()
          }
        };
        onChange(syntheticEvent);
      } else {
        // For invalid input, just keep the cleaned value
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name,
            value: cleanValue
          }
        };
        onChange(syntheticEvent);
      }
    }
  };
  
  // Focus handler
  const handleFocus = () => {
    setIsEditing(true);
  };
  
  // Blur handler
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    
    // Convert string values back to numbers on blur
    if (typeof value === 'string' && value !== '') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name,
            value: numValue.toString()
          }
        };
        onChange(syntheticEvent);
      }
    }
  };
  
  const defaultClasses = "mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-700 dark:text-white shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 transition-colors duration-200";
  const disabledClasses = "disabled:bg-gray-100 dark:disabled:bg-darkBlue-600 disabled:cursor-not-allowed";
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">
          {label}
        </label>
      )}
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={`${defaultClasses} ${disabled ? disabledClasses : ''} ${className}`}
      />
    </div>
  );
};

export default PercentInput;