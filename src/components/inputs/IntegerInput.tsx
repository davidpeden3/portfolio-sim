import React, { useState } from 'react';
import { formatMonthValue } from '../../utils/formatUtils';

interface IntegerInputProps {
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * A specialized input component for integer values like months
 * - Always rounds to integer
 * - Formats with commas for thousands
 * - No decimal places allowed
 */
const IntegerInput: React.FC<IntegerInputProps> = ({
  name,
  value,
  onChange,
  label,
  className = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Format for display when not editing
  const displayValue = !isEditing 
    ? formatMonthValue(typeof value === 'number' ? value : parseFloat(value?.toString() || '0') || 0) 
    : value;
  
  // Custom change handler to ensure integers only
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Strip commas from input
    const cleanValue = rawValue.replace(/,/g, '');
    
    // Handle empty string
    if (cleanValue === '') {
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
    
    // For non-empty values, try to parse as number and round immediately
    const numValue = parseFloat(cleanValue);
    if (!isNaN(numValue)) {
      // For integer fields, never keep decimals, instantly convert to integer
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: Math.round(numValue).toString()
        }
      };
      onChange(syntheticEvent);
    } else {
      // For invalid input, keep the cleaned value
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
  };
  
  // Focus handler
  const handleFocus = () => {
    setIsEditing(true);
  };
  
  // Blur handler
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    
    // Convert string values to integers on blur
    if (typeof value === 'string' && value !== '') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name,
            value: Math.round(numValue).toString()
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

export default IntegerInput;