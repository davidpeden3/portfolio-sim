import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  options: Option[];
  disabled?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  value,
  onChange,
  label,
  options,
  disabled = false
}) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-800 dark:bg-darkBlue-700 dark:border-darkBlue-600 dark:text-white dark:focus:border-basshead-blue-500 dark:focus:ring-basshead-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;