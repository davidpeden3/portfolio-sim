import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  SupplementalContribution, 
  ContributionType,
  ContributionFrequency,
  WeekDay
} from '../../models/SupplementalContribution';
import { DollarInput } from '../inputs';

// Array of month names for friendly display
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

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
  const [customStartDate, setCustomStartDate] = useState<string>(''); // Store custom date when toggling modes
  const [customEndDate, setCustomEndDate] = useState<string>(''); // Store custom date when toggling modes
  const [nameManuallySet, setNameManuallySet] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<WeekDay>(5); // Default to Friday
  const [useCustomDateRange, setUseCustomDateRange] = useState(false); // Default to using full simulation period
  
  // Calculate default simulation start and end dates
  const getDefaultStartDate = (): Date => {
    const today = new Date();
    const simStartDate = new Date(today.getFullYear(), simulationStartMonth - 1, 1);
    return simStartDate;
  };
  
  const getDefaultEndDate = (): Date => {
    const startDate = getDefaultStartDate();
    // Add simulation months to the start date (no subtraction)
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + simulationMonths);
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
      // Save the contribution type to a local variable to avoid triggering other effects
      const contributionType = contribution.type;
      
      // Set basic properties - careful about the order to minimize effect triggers
      setNameManuallySet(true); // Consider the name manually set when editing
      setName(contribution.name);
      setAmount(contribution.amount);
      setDayOfWeek(contribution.dayOfWeek || 5); // Default to Friday if not set
      setFrequency(contribution.frequency);
      setRecurring(contribution.recurring);
      
      // Handle dates based on contribution type
      try {
        // For one-time contributions, set the date directly
        if (contributionType === 'oneTime') {
          // Set the date
          const formattedStartDate = formatDateForInput(contribution.startDate);
          setStartDate(formattedStartDate);
          setEndDate(formattedStartDate); // End date same as start date for one-time
        } else {
          // For recurring contributions, check if custom date range is used
          // We consider a contribution to have custom dates if it has the useCustomDateRange flag set
          // or if it has date values stored
          const hasCustomDates = contribution.useCustomDateRange === true || 
                              (contribution.startDate !== undefined || contribution.endDate !== undefined);
          
          setUseCustomDateRange(hasCustomDates);
          
          if (hasCustomDates) {
            // If using custom dates, show those dates
            const formattedStartDate = formatDateForInput(contribution.startDate);
            const formattedEndDate = formatDateForInput(contribution.endDate);
            
            setStartDate(formattedStartDate);
            setEndDate(formattedEndDate);
            
            // Also store in custom date fields so they're preserved when toggling
            setCustomStartDate(formattedStartDate);
            setCustomEndDate(formattedEndDate);
          } else {
            // If using full simulation period, show simulation dates
            resetStartDate();
            resetEndDate();
            
            // Clear custom dates
            setCustomStartDate('');
            setCustomEndDate('');
          }
        }
      } catch (e) {
        console.error('Error formatting dates when loading contribution:', e);
        // Fall back to default dates if there's a problem
        resetStartDate();
        resetEndDate();
        setCustomStartDate('');
        setCustomEndDate('');
      }
      
      // Set the type last to avoid triggering effects
      setType(contributionType);
    } else {
      // Set default dates for new contributions
      resetStartDate();
      resetEndDate();
      // For new contributions, default to full simulation period for recurring types
      setUseCustomDateRange(type !== 'oneTime' ? false : undefined);
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
  
  // Function to update the name when form values change
  const updateName = useCallback(() => {
    if (!nameManuallySet && amount) {
      setName(generateName());
    }
  }, [amount, type, frequency, dayOfWeek, nameManuallySet, generateName]);
  
  // Auto-update name when form values change
  useEffect(() => {
    updateName();
  }, [amount, type, frequency, dayOfWeek, nameManuallySet, updateName]);
  
  // Handle type changes for both new and edited contributions
  useEffect(() => {
    // No logging to avoid issues with hooks
    if (type === 'oneTime') {
      setRecurring(false);
      setFrequency('none');
      
      // If we have a start date, ensure end date matches
      if (startDate) {
        setEndDate(startDate);
      }
    } else {
      // For non-one-time contributions
      setRecurring(true);
      
      // Set appropriate default frequency when switching types
      // Only set default if we're changing from oneTime to dca/salary
      if (frequency === 'none') {
        if (type === 'dca') {
          setFrequency('monthly');
        } else if (type === 'salary') {
          setFrequency('monthly');
        }
      }
      
      // When switching to non-one-time and creating a new contribution, 
      // ensure we use full simulation period
      if (!contribution) {
        setUseCustomDateRange(false);
        resetStartDate();
        resetEndDate();
      }
    }
  }, [type]);
  
  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameManuallySet(true);
  };
  
  // Reset name to auto-generated value
  const resetName = () => {
    setName(generateName());
    setNameManuallySet(false);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Get direct references to DOM elements for fallback validation
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const amountInput = document.getElementsByName("amount")[0] as HTMLInputElement;
    
    // Try to use DOM values if React state is failing
    let actualName = nameInput?.value || name;
    let actualAmount = amountInput?.value || amount;
    
    // Treat empty string values as empty
    if (actualName === '') actualName = null;
    if (actualAmount === '') actualAmount = null;
    
    // Simple validation with fallback values
    if (!actualName || !actualAmount) {
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
        return new Date(); // Default to today if no date provided
      }
      
      try {
        // Parse the date string into year, month, day components
        const [year, month, day] = dateString.split('-').map(Number);
        
        // Validate the parts to ensure they're valid numbers
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          throw new Error(`Invalid date parts`);
        }
        
        // Create a new Date object (month is 0-indexed in JavaScript)
        // Set time to 00:00:00 to avoid timezone issues when storing in ISO format
        const date = new Date(year, month - 1, day);
        // Reset time part to avoid timezone issues
        date.setHours(0, 0, 0, 0);
        return date;
      } catch (e) {
        return new Date(); // Default to today if parsing fails
      }
    };

    // Create the contribution object
    const baseContribution = {
      id: contribution?.id || uuidv4(),
      enabled: contribution?.enabled ?? true,
    };
    
    // Parse the amount value
    let parsedAmount: number;
    if (typeof actualAmount === 'string') {
      // Remove any non-numeric characters except decimals
      const cleanedAmount = actualAmount.replace(/[^0-9.]/g, '');
      parsedAmount = parseFloat(cleanedAmount);
      if (isNaN(parsedAmount)) {
        parsedAmount = 0;
      }
    } else if (typeof actualAmount === 'number') {
      parsedAmount = actualAmount;
    } else {
      parsedAmount = 0;
    }
    
    // Set the properties
    Object.assign(baseContribution, {
      name: actualName.trim(),
      amount: parsedAmount,
      type,
      recurring,
      frequency,
      // Handle dates based on contribution type
      ...(type === 'oneTime' && startDate ? { 
        startDate: createDateFromString(startDate),
        endDate: createDateFromString(startDate)
      } : (
        // For recurring, only include dates if using custom date range
        useCustomDateRange ? {
          ...(startDate ? { startDate: createDateFromString(startDate) } : {}),
          ...(endDate ? { endDate: createDateFromString(endDate) } : {}),
          useCustomDateRange
        } : {}
      )),
      // Always explicitly set dayOfWeek regardless of frequency
      dayOfWeek
    });
    
    // No logging to avoid issues
    
    // Save the contribution
    onSave(baseContribution as SupplementalContribution);
  };
  
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
  
  // Add function to handle day of week changes
  const handleDayOfWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDayOfWeek = Number(e.target.value) as WeekDay;
    setDayOfWeek(newDayOfWeek);
    
    // If name is auto-generated, update it with the new day of week
    if (!nameManuallySet) {
      updateName();
    }
  };
  
  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Prevent Enter key from submitting if within an input or select element
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        // Only if not in a textarea
        if (!(e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          // Use setTimeout to ensure all state updates have completed
          setTimeout(() => handleSubmit(), 0);
        }
      } else {
        // If not in an input field, always trigger submit
        e.preventDefault();
        // Use setTimeout to ensure all state updates have completed
        setTimeout(() => handleSubmit(), 0);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  }, [onCancel, name, amount, type, frequency, dayOfWeek, startDate, endDate]);
  
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
              onChange={handleDayOfWeekChange}
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
        <div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="e.g., DCA: $100 (Monthly)"
            required
          />
          <div className="flex justify-between items-center mt-1">
            {!nameManuallySet ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Auto-generated based on your selections
              </p>
            ) : (
              <div className="text-right w-full">
                <button 
                  type="button" 
                  onClick={resetName}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Date Inputs Section */}
      <div className="mb-4">
        {/* Date Range Selection Radio - Only for recurring contributions */}
        {type !== 'oneTime' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Duration
            </label>
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-basshead-blue-500"
                  name="dateRangeType"
                  checked={!useCustomDateRange}
                  onChange={() => {
                    // Save current dates as custom dates
                    if (useCustomDateRange) {
                      setCustomStartDate(startDate);
                      setCustomEndDate(endDate);
                    }
                    
                    setUseCustomDateRange(false);
                    // Update date fields to show simulation dates
                    resetStartDate();
                    resetEndDate();
                  }}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">Full Simulation Period</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-basshead-blue-500"
                  name="dateRangeType"
                  checked={useCustomDateRange}
                  onChange={() => {
                    setUseCustomDateRange(true);
                    
                    // Restore custom dates if they exist
                    if (customStartDate) {
                      setStartDate(customStartDate);
                    }
                    
                    if (customEndDate) {
                      setEndDate(customEndDate);
                    }
                  }}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">Custom Date Range</span>
              </label>
            </div>
          </div>
        )}
        
        {/* CONDITIONAL RENDERING FOR ONE-TIME VS RECURRING */}
        {/* ONE-TIME: Single date field */}
        {type === 'oneTime' && (
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Date *
            </label>
            <div>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setStartDate(newDate);
                  setEndDate(newDate); // Ensure end date matches for one-time contributions
                }}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>
        )}
        
        {/* RECURRING: Date range fields */}
        {type !== 'oneTime' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                {!useCustomDateRange ? "Simulation Start" : "Start Date"}
              </label>
              <div>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setStartDate(newDate);
                    // Also update the stored custom date
                    setCustomStartDate(newDate);
                    
                    // If changing from default simulation dates, switch to custom mode
                    if (!useCustomDateRange) {
                      setUseCustomDateRange(true);
                    }
                  }}
                  disabled={!useCustomDateRange}
                  className={`mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200 ${!useCustomDateRange ? 'bg-gray-100 dark:bg-darkBlue-800 opacity-75' : ''}`}
                />
                {useCustomDateRange && (
                  <div className="text-right mt-1">
                    <button 
                      type="button" 
                      onClick={() => {
                        setCustomStartDate('');
                        resetStartDate();
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      reset
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                {!useCustomDateRange ? "Simulation End" : "End Date"}
              </label>
              <div>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setEndDate(newDate);
                    // Also update the stored custom date
                    setCustomEndDate(newDate);
                    
                    // If changing from default simulation dates, switch to custom mode
                    if (!useCustomDateRange) {
                      setUseCustomDateRange(true);
                    }
                  }}
                  disabled={!useCustomDateRange}
                  className={`mt-1 block w-full p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200 ${!useCustomDateRange ? 'bg-gray-100 dark:bg-darkBlue-800 opacity-75' : ''}`}
                  min={startDate}
                />
                {useCustomDateRange && (
                  <div className="text-right mt-1">
                    <button 
                      type="button" 
                      onClick={() => {
                        setCustomEndDate('');
                        resetEndDate();
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      reset
                    </button>
                  </div>
                )}
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