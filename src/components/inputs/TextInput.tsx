import React, { useState } from 'react';
import { formatNumber } from '../../utils/formatUtils';

interface TextInputProps {
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  type?: string;
  // If true, will format numbers with commas (e.g. 1,000)
  formatWithCommas?: boolean;
}

/**
 * A basic text input component with consistent styling
 * - Can be used for regular text fields that don't need special formatting
 * - Has option to format numbers with commas when not editing
 */
const TextInput: React.FC<TextInputProps> = ({
  name,
  value,
  onChange,
  label,
  className = '',
  disabled = false,
  type = 'text',
  formatWithCommas = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Format display value if formatWithCommas is true and the field is not being edited
  const displayValue = formatWithCommas && !isEditing && (typeof value === 'number' || value === '') 
    ? formatNumber(value) 
    : value;
  
  // Custom change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Strip commas if we're formatting with commas
    if (formatWithCommas) {
      const cleanValue = rawValue.replace(/,/g, '');
      
      // Create a synthetic event with the cleaned value
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
      // Pass through unchanged for regular text fields
      onChange(e);
    }
  };
  
  // Focus handler
  const handleFocus = () => {
    setIsEditing(true);
  };
  
  // Blur handler
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    
    // Only convert string values to numbers if we're formatting with commas
    if (formatWithCommas && typeof value === 'string' && value !== '') {
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
        type={type}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onFocus={formatWithCommas ? handleFocus : undefined}
        onBlur={formatWithCommas ? handleBlur : undefined}
        disabled={disabled}
        className={`${defaultClasses} ${disabled ? disabledClasses : ''} ${className}`}
      />
    </div>
  );
};

export default TextInput;