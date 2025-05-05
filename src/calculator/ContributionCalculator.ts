import { 
  SupplementalContribution, 
  MaterializedContribution
} from '../models/SupplementalContribution';

/**
 * Helper function to ensure a value is a Date object
 * When loading from localStorage or other serialization, dates can become strings
 * @param dateInput A Date object, ISO string, or undefined
 * @returns A proper Date object or undefined
 */
function ensureDate(dateInput: Date | string | undefined): Date | undefined {
  if (!dateInput) {
    return undefined;
  }
  
  if (dateInput instanceof Date) {
    return dateInput;
  }
  
  // If it's a string, try to parse it as a date
  try {
    return new Date(dateInput);
  } catch (e) {
    console.error('Failed to parse date:', dateInput);
    return undefined;
  }
}

/**
 * Calculates the actual date of the contribution based on the simulation month and calendar month
 * @param simulationMonth The current simulation month (1-based)
 * @param calendarMonth The current calendar month (1-12 representing January-December)
 * @param startMonth The starting calendar month for the simulation (1-12)
 * @param day The day of the month for the contribution (defaults to 1)
 * @returns A Date object representing the contribution date
 */
function calculateContributionDate(
  simulationMonth: number, 
  calendarMonth: number, 
  startMonth: number, 
  day: number = 1
): Date {
  // Calculate the year offset based on simulation month and start month
  const yearOffset = Math.floor((startMonth - 1 + simulationMonth - 1) / 12);
  
  // Current year (we'll use the current year as the base year for simulation)
  const currentYear = new Date().getFullYear();
  
  // Calculate the actual date
  return new Date(currentYear + yearOffset, calendarMonth - 1, day);
}

/**
 * Checks if a contribution should be applied based on its frequency and the current date
 * @param contribution The contribution to check
 * @param currentDate The current date in the simulation
 * @returns Boolean indicating if the contribution should be applied
 */
function shouldApplyContribution(
  contribution: SupplementalContribution,
  currentDate: Date,
  startMonth: number
): boolean {
  if (!contribution.enabled) {
    return false;
  }
  
  // Get simulation start date (using the 1st of the simulation start month in the current year)
  const simulationStartDate = new Date(currentDate.getFullYear(), startMonth - 1, 1);
  
  // Use provided dates or defaults
  // Ensure dates are Date objects - when loaded from localStorage they might be strings
  const startDate = ensureDate(contribution.startDate) || simulationStartDate;
  const endDate = ensureDate(contribution.endDate) || new Date(simulationStartDate.getFullYear() + 100, 0, 1); // Default to 100 years in the future
  
  // Check if current date is within the contribution period
  if (currentDate < startDate || currentDate > endDate) {
    return false;
  }
  
  // For non-recurring contributions, only apply once on the start date
  if (!contribution.recurring) {
    // For one-time contributions, we consider them to fall in the same month if the month and year match
    return (
      currentDate.getMonth() === startDate.getMonth() &&
      currentDate.getFullYear() === startDate.getFullYear()
    );
  }
  
  // For recurring contributions, check if this is a contribution date based on frequency
  switch (contribution.frequency) {
    case 'daily':
      return true; // Apply every day
      
    case 'weekly':
      // If dayOfWeek is specified, use that as the weekday (1-5 for Mon-Fri)
      if (contribution.dayOfWeek) {
        // JavaScript getDay() returns 0-6 (Sun-Sat), where Sunday is 0, Monday is 1, etc.
        // Our WeekDay type uses 1-5 (Mon-Fri), where Monday is 1, Tuesday is 2, etc.
        // These align perfectly for weekdays, so we can compare directly
        return currentDate.getDay() === contribution.dayOfWeek;
      } else {
        // Fall back to old behavior if no dayOfWeek is specified
        return currentDate.getDay() === startDate.getDay();
      }
      
    case 'biweekly':
      // Calculate weeks since the start date
      const msPerWeek = 7 * 24 * 60 * 60 * 1000;
      const weeksSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / msPerWeek);
      
      // Check if this is an even number of weeks since start
      const isEvenWeek = weeksSinceStart % 2 === 0;
      
      // If dayOfWeek is specified, use that as the weekday
      if (contribution.dayOfWeek) {
        // JavaScript getDay() returns 0-6 (Sun-Sat), where Sunday is 0, Monday is 1, etc.
        // Our WeekDay type uses 1-5 (Mon-Fri), where Monday is 1, Tuesday is 2, etc.
        return isEvenWeek && currentDate.getDay() === contribution.dayOfWeek;
      } else {
        // Fall back to old behavior if no dayOfWeek is specified
        return isEvenWeek && currentDate.getDay() === startDate.getDay();
      }
      
    case 'semimonthly':
      // Apply on the 1st and 15th of each month
      const day = currentDate.getDate();
      return day === 1 || day === 15;
      
    case 'monthly':
      // Apply if the day of month matches
      return currentDate.getDate() === startDate.getDate();
      
    case 'quarterly':
      // Apply if the month is a quarter boundary (Jan, Apr, Jul, Oct) and the day matches
      const quarterMonths = [0, 3, 6, 9]; // 0-indexed months (Jan, Apr, Jul, Oct)
      return quarterMonths.includes(currentDate.getMonth()) && currentDate.getDate() === startDate.getDate();
      
    case 'yearly':
      // Apply if the month and day match the start date
      return (
        currentDate.getMonth() === startDate.getMonth() &&
        currentDate.getDate() === startDate.getDate()
      );
      
    default:
      return false;
  }
}

/**
 * Materializes a list of supplemental contributions into specific dates and amounts
 * @param contributions Array of supplemental contributions
 * @param simulationMonths Number of months to simulate
 * @param startMonth Starting calendar month (1-12)
 * @returns Array of materialized contributions sorted by date
 */
export function materializeContributions(
  contributions: SupplementalContribution[] = [],
  simulationMonths: number,
  startMonth: number = 1
): MaterializedContribution[] {
  if (!contributions || contributions.length === 0) {
    return [];
  }
  
  
  const materializedContributions: MaterializedContribution[] = [];
  
  // For each simulation month
  for (let month = 1; month <= simulationMonths; month++) {
    // Calculate the calendar month (1-12) for the current simulation month
    const calendarMonth = ((startMonth - 1 + month - 1) % 12) + 1;
    
    // Calculate the date for this month (we'll use the 1st by default)
    const currentDate = calculateContributionDate(month, calendarMonth, startMonth);
    
    // Determine which specific days of the month to check based on contribution types
    const daysToCheck = new Set<number>();
    
    // Add relevant days based on contribution frequencies
    for (const contribution of contributions) {
      if (!contribution.enabled) continue;
      
      switch (contribution.frequency) {
        case 'daily':
          // For daily contributions, we'll need all days
          const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          for (let d = 1; d <= daysInMonth; d++) {
            daysToCheck.add(d);
          }
          break;
        
        case 'weekly':
        case 'biweekly':
          // For weekly/biweekly, we need to check dates that correspond to the specified day of week
          // Since these are based on day of week, we need to check all days in the month
          // to find matching weekdays
          const daysInMonthForWeekly = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          
          // Check all days for potential weekday matches
          for (let d = 1; d <= daysInMonthForWeekly; d++) {
            const specificDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            
            // If dayOfWeek is specified, check if this date matches the day of week
            if (contribution.dayOfWeek) {
              // JavaScript getDay() returns 0-6 (Sun-Sat), where Sunday is 0, Monday is 1, etc.
              // Our WeekDay type uses 1-5 (Mon-Fri), where Monday is 1, Tuesday is 2, etc.
              if (specificDate.getDay() === contribution.dayOfWeek) {
                daysToCheck.add(d);
              }
            } else if (contribution.startDate) {
              // Use the start date's day of week as fallback
              const startDate = ensureDate(contribution.startDate);
              if (startDate && specificDate.getDay() === startDate.getDay()) {
                daysToCheck.add(d);
              }
            }
          }
          break;
          
        case 'semimonthly':
          // For semi-monthly, add both the 1st and 15th
          daysToCheck.add(1);
          daysToCheck.add(15);
          break;
          
        case 'monthly':
          // For monthly, use the start date's day or 1st if not specified
          if (contribution.startDate) {
            const startDate = ensureDate(contribution.startDate);
            const day = startDate ? startDate.getDate() : 1;
            daysToCheck.add(day);
          } else {
            daysToCheck.add(1);
          }
          break;
          
        case 'quarterly':
          // For quarterly, check if this is a quarter month (Jan, Apr, Jul, Oct)
          const quarterMonths = [0, 3, 6, 9]; // 0-indexed months
          if (quarterMonths.includes(currentDate.getMonth())) {
            if (contribution.startDate) {
              const startDate = ensureDate(contribution.startDate);
              const day = startDate ? startDate.getDate() : 1;
              daysToCheck.add(day);
            } else {
              daysToCheck.add(1);
            }
          }
          break;
          
        case 'yearly':
          // For yearly, check if this is the start month
          if (contribution.startDate) {
            const startDate = ensureDate(contribution.startDate);
            if (startDate && startDate.getMonth() === currentDate.getMonth()) {
              daysToCheck.add(startDate.getDate());
            }
          } else {
            // Default to January 1st if no start date
            if (currentDate.getMonth() === 0) { // January
              daysToCheck.add(1);
            }
          }
          break;
          
        default:
          // For other frequencies or one-time, add the start date's day
          if (contribution.startDate) {
            const startDate = ensureDate(contribution.startDate);
            const day = startDate ? startDate.getDate() : 1;
            daysToCheck.add(day);
          } else {
            daysToCheck.add(1);
          }
          break;
      }
    }
    
    // Convert to array and sort
    const daysArray = Array.from(daysToCheck).sort((a, b) => a - b);
    
    // Now process only the days we need to check
    for (const day of daysArray) {
      // Check each contribution
      for (const contribution of contributions) {
        if (!contribution.enabled) continue;
        
        // Set the day for this specific check
        const specificDate = calculateContributionDate(month, calendarMonth, startMonth, day);
        
        if (shouldApplyContribution(contribution, specificDate, startMonth)) {
          materializedContributions.push({
            amount: contribution.amount,
            date: new Date(specificDate), // Create a new date object to avoid references
            sourceId: contribution.id,
            sourceName: contribution.name
          });
        }
      }
    }
  }
  
  // Sort by date
  return materializedContributions.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Groups materialized contributions by calendar month
 * @param materializedContributions Array of materialized contributions
 * @returns An object with month keys (format: 'YYYY-MM') and total amount values
 */
export function groupContributionsByMonth(
  materializedContributions: MaterializedContribution[]
): Record<string, number> {
  const monthlyContributions: Record<string, number> = {};
  
  for (const contribution of materializedContributions) {
    const year = contribution.date.getFullYear();
    const month = contribution.date.getMonth() + 1; // 1-based month
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    
    if (!monthlyContributions[key]) {
      monthlyContributions[key] = 0;
    }
    
    monthlyContributions[key] += contribution.amount;
  }
  
  return monthlyContributions;
}

/**
 * Gets the total contributions for a specific simulation month
 * @param monthlyContributions Record of monthly contributions
 * @param simulationMonth Current simulation month
 * @param startMonth Starting calendar month (1-12)
 * @returns The total contribution amount for the month
 */
export function getMonthContribution(
  monthlyContributions: Record<string, number>,
  simulationMonth: number,
  startMonth: number = 1
): number {
  // Calculate the calendar month and year for this simulation month
  const calendarMonth = ((startMonth - 1 + simulationMonth - 1) % 12) + 1;
  const yearOffset = Math.floor((startMonth - 1 + simulationMonth - 1) / 12);
  const currentYear = new Date().getFullYear() + yearOffset;
  
  // Create the month key
  const key = `${currentYear}-${calendarMonth.toString().padStart(2, '0')}`;
  
  // Return the contribution amount or 0 if none
  return monthlyContributions[key] || 0;
}