import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  SupplementalContribution, 
  ContributionType,
  ContributionFrequency,
  WeekDay
} from '../../models/SupplementalContribution';
import { DollarInput } from '../inputs';

// Helper function to format a date to YYYY-MM-DD for input
const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  try {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('Error formatting date:', date);
    return '';
  }
};

interface ContributionFormProps {
  contribution?: SupplementalContribution | null;
  onSave: (contribution: SupplementalContribution) => void;
  onCancel: () => void;
  simulationStartMonth?: number; // 1-12 for Jan-Dec
  simulationMonths?: number;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ 
  contribution, 
  onSave, 
  onCancel,
  simulationStartMonth = 1, // Default to January
  simulationMonths = 120 // Default to 10 years
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [type, setType] = useState<ContributionType>('dca');
  const [recurring, setRecurring] = useState(true);
  const [frequency, setFrequency] = useState<ContributionFrequency>('monthly');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [nameManuallySet, setNameManuallySet] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<WeekDay>(1); // Default to Monday
  
  // Calculate default simulation start and end dates
  const getDefaultStartDate = (): Date => {
    const today = new Date();
    const simStartDate = new Date(today.getFullYear(), simulationStartMonth - 1, 1);
    return simStartDate;
  };
  
  const getDefaultEndDate = (): Date => {
    const startDate = getDefaultStartDate();
    // Add simulation months to the start date
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + simulationMonths - 1);
    return endDate;
  };
  
  // Reset dates to defaults
  const resetStartDate = () => {
    setStartDate(formatDateForInput(getDefaultStartDate()));
  };
  
  const resetEndDate = () => {
    setEndDate(formatDateForInput(getDefaultEndDate()));
  };

  // Set up initial values if editing
  useEffect(() => {
    if (contribution) {
      // Set basic properties
      setName(contribution.name);
      setAmount(contribution.amount);
      setType(contribution.type);
      setRecurring(contribution.recurring);
      setFrequency(contribution.frequency);
      
      // Set day of week if available (for weekly/biweekly)
      if (contribution.dayOfWeek) {
        setDayOfWeek(contribution.dayOfWeek);
      }
      
      try {
        // Format dates safely - handle both Date objects and strings
        setStartDate(formatDateForInput(contribution.startDate));
        setEndDate(formatDateForInput(contribution.endDate));
      } catch (e) {
        console.error('Error formatting dates when loading contribution:', e);
        // Fall back to default dates if there's a problem
        resetStartDate();
        resetEndDate();
      }
      
      setNameManuallySet(true); // Consider the name manually set when editing
    } else {
      // Set default dates for new contributions
      resetStartDate();
      resetEndDate();
    }
  }, [contribution, simulationStartMonth, simulationMonths]);
  
  // Generate name based on form values
  const generateName = (): string => {
    if (!amount) return '';
    
    const amountFormatted = typeof amount === 'number' 
      ? `$${amount}` 
      : `$${parseFloat(amount.replace(/[^0-9.]/g, ''))}`;
      
    // Map frequency values to their display format to ensure we get the hyphenated versions
    let frequencyText = frequency;
    
    // These are only for display, not used as actual frequency values
    if (frequency === 'biweekly') {
      frequencyText = 'bi-weekly' as any; // Using 'as any' to bypass type checking for the display string
    } else if (frequency === 'semimonthly') {
      frequencyText = 'semi-monthly' as any; // Using 'as any' to bypass type checking for the display string
    }
    
    // Add weekday for weekly/biweekly frequencies
    let displayName = '';
    if (type === 'dca') {
      displayName = `DCA: ${amountFormatted} (${frequencyText}`;
    } else if (type === 'salary') {
      displayName = `Salary: ${amountFormatted} (${frequencyText}`;
    } else {
      return `One-time: ${amountFormatted}`;
    }
    
    // Add weekday for weekly/biweekly frequencies
    if ((frequency === 'weekly' || frequency === 'biweekly') && dayOfWeek) {
      displayName += ` on ${getWeekdayShortName(dayOfWeek)}`;
    }
    
    // Close the parenthesis
    if (type === 'dca' || type === 'salary') {
      displayName += ')';
    }
    
    return displayName;
  };
  
  // Auto-update name when form values change
  useEffect(() => {
    if (!nameManuallySet && amount) {
      setName(generateName());
    }
  }, [amount, type, frequency, dayOfWeek, nameManuallySet]);
  
  // Update recurring and frequency when type changes
  useEffect(() => {
    if (type === 'oneTime') {
      setRecurring(false);
      setFrequency('none');
    } else {
      setRecurring(true);
      if (type === 'dca' && frequency === 'biweekly' || frequency === 'semimonthly') {
        setFrequency('monthly');
      } else if (type === 'salary' && (frequency === 'daily' || frequency === 'quarterly' || frequency === 'yearly')) {
        setFrequency('monthly');
      }
    }
  }, [type]);
  
  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameManuallySet(true);
  };
  
  // Handle form submission - using useCallback to avoid circular dependencies
  const handleSubmit = useCallback(() => {
    // Validate required fields
    if (!name.trim() || !amount) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Validate that dayOfWeek is selected for weekly/biweekly contributions
    if ((frequency === 'weekly' || frequency === 'biweekly') && !dayOfWeek) {
      alert('Please select a day of the week for weekly/biweekly contributions');
      return;
    }
    
    // Helper function to safely parse a date string into a Date object
    // Creates date without time zone issues by parsing the date parts directly
    const createDateFromString = (dateString: string): Date => {
      if (!dateString) {
        console.log('No date string provided, using current date');
        return new Date(); // Default to today if no date provided
      }
      
      try {
        // Parse the date string into year, month, day components
        const [year, month, day] = dateString.split('-').map(Number);
        
        // Validate the parts to ensure they're valid numbers
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          throw new Error(`Invalid date parts: year=${year}, month=${month}, day=${day}`);
        }
        
        // Create a new Date object (month is 0-indexed in JavaScript)
        const date = new Date(year, month - 1, day);
        console.log(`Created date: ${date.toISOString()} from string: ${dateString}`);
        return date;
      } catch (e) {
        console.error('Error parsing date:', dateString, e);
        return new Date(); // Default to today if parsing fails
      }
    };

    // Create the contribution object based on type
    const baseContribution = {
      id: contribution?.id || uuidv4(),
      name: name.trim(),
      amount: typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount,
      type,
      enabled: contribution?.enabled ?? true,
      recurring,
      frequency,
      ...(startDate ? { startDate: createDateFromString(startDate) } : {}),
      ...(endDate ? { endDate: createDateFromString(endDate) } : {}),
      // Add dayOfWeek property only for weekly/biweekly contributions
      ...(frequency === 'weekly' || frequency === 'biweekly' ? { dayOfWeek } : {})
    };
    
    // Make sure one-time contributions have both dates the same if provided
    if (type === 'oneTime' && startDate) {
      baseContribution.endDate = createDateFromString(startDate);
    }
    
    onSave(baseContribution as SupplementalContribution);
  }, [name, amount, contribution, type, recurring, frequency, startDate, endDate, onSave]);
  
  // Filter frequency options based on the contribution type
  const getFrequencyOptions = () => {
    if (type === 'dca') {
      return [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'yearly', label: 'Yearly' }
      ];
    } else if (type === 'salary') {
      return [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly (26/y)' },
        { value: 'semimonthly', label: 'Semi-monthly (24/y)' },
        { value: 'monthly', label: 'Monthly' }
      ];
    }
    return [];
  };
  
  // Get full weekday name from number
  const getWeekdayName = (day: WeekDay): string => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return weekdays[day - 1];
  };
  
  // Get short weekday name from number
  const getWeekdayShortName = (day: WeekDay): string => {
    const weekdaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return weekdaysShort[day - 1];
  };
  
  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Prevent Enter key from submitting if within an input or select element
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        // Only if not in a textarea
        if (!(e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          handleSubmit();
        }
      } else {
        // If not in an input field, always trigger submit
        e.preventDefault();
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  }, [onCancel, handleSubmit]);
  
  // Add and remove keyboard event listeners
  useEffect(() => {
    // We need to cast to any because TypeScript doesn't recognize the argument type properly
    document.addEventListener('keydown', handleKeyDown as any);
    return () => {
      document.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [handleKeyDown]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-200">
        {contribution ? 'Edit Contribution' : 'Add New Contribution'}
      </h3>
      
      {/* Contribution Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Contribution Type *
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as ContributionType)}
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
          required
        >
          <option value="dca">Dollar-Cost Averaging</option>
          <option value="salary">Salary Contribution</option>
          <option value="oneTime">One-Time Contribution</option>
        </select>
      </div>
      
      {/* Dynamic grid layout that changes based on weekly/biweekly selection */}
      <div className={`grid ${(frequency === 'weekly' || frequency === 'biweekly') && recurring && type !== 'oneTime' ? 'grid-cols-12' : 'grid-cols-2'} gap-4`}>
        {/* Amount - 4/12 width when three columns */}
        <div className={`${(frequency === 'weekly' || frequency === 'biweekly') && recurring && type !== 'oneTime' ? 'col-span-4' : ''}`}>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
            Amount ($) *
          </label>
          <div className="mt-1">
            <DollarInput
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        
        {/* Frequency (only for recurring contributions) - 5/12 width when three columns */}
        {recurring && type !== 'oneTime' ? (
          <div className={`${(frequency === 'weekly' || frequency === 'biweekly') && recurring && type !== 'oneTime' ? 'col-span-5' : ''}`}>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Frequency *
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as ContributionFrequency)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
              required
            >
              {getFrequencyOptions().map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="hidden md:block"> {/* Empty column for layout when frequency isn't shown */}
          </div>
        )}
        
        {/* Day of Week (only for weekly/biweekly) - 3/12 width in three-column layout */}
        {(frequency === 'weekly' || frequency === 'biweekly') && recurring && type !== 'oneTime' && (
          <div className="col-span-3">
            <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Day *
            </label>
            <select
              id="dayOfWeek"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value) as WeekDay)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
              required
            >
              <option value={1}>Mon</option>
              <option value={2}>Tue</option>
              <option value={3}>Wed</option>
              <option value={4}>Thu</option>
              <option value={5}>Fri</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Name (below type/amount/frequency) */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
          placeholder="e.g., DCA: $100 (Monthly)"
          required
        />
        {!nameManuallySet && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Auto-generated based on your selections
          </p>
        )}
      </div>
      
      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
            {type === 'oneTime' ? 'Date' : 'Start Date'}
          </label>
          <div>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                // For one-time contributions, update end date to match start date
                if (type === 'oneTime') {
                  setEndDate(e.target.value);
                }
              }}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
            />
            <div className="text-right mt-1">
              <button 
                type="button" 
                onClick={resetStartDate}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                reset
              </button>
            </div>
          </div>
        </div>
        
        {type !== 'oneTime' && (
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              End Date
            </label>
            <div>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
                min={startDate}
              />
              <div className="text-right mt-1">
                <button 
                  type="button" 
                  onClick={resetEndDate}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 dark:bg-darkBlue-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-darkBlue-600 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 dark:bg-basshead-blue-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-basshead-blue-700 transition-colors duration-200"
        >
          {contribution ? 'Save Changes' : 'Add Contribution'}
        </button>
      </div>
    </div>
  );
};

export default ContributionForm;