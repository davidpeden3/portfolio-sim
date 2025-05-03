/**
 * Utility functions for formatting display values
 */

/**
 * Format a value for display based on field type
 * @param fieldName The name of the field being formatted
 * @param value The value to format
 * @returns Formatted string value for display
 */
export function formatDisplayValue(fieldName: string, value: number | string): string {
  // Return empty strings as is
  if (value === '') return '';
  
  // Convert to number for processing
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Return empty string if not a valid number
  if (isNaN(numValue)) return '';
  
  // Categorize fields by formatting type
  const dollarFields = [
    'initialInvestment', 
    'baseIncome', 
    'loanAmount',
    'initialSharePrice'
  ];
  
  const percentFields = [
    'dividendYield4w', 
    'monthlyAppreciation', 
    'annualInterestRate', 
    'surplusForDripPercent'
  ];
  
  const monthFields = [
    'simulationMonths', 
    'amortizationMonths'
  ];
  
  // Format by field type
  if (dollarFields.includes(fieldName)) {
    return formatDollarValue(numValue);
  }
  
  if (percentFields.includes(fieldName)) {
    return formatPercentValue(numValue);
  }
  
  if (monthFields.includes(fieldName)) {
    return formatMonthValue(numValue);
  }
  
  // For fields like initialShareCount that don't need special formatting
  // but may benefit from comma separation for larger numbers
  return numValue.toLocaleString();
}

/**
 * Format a value as currency with two decimal places
 */
export function formatDollarValue(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Format a value as a percentage with two decimal places
 */
export function formatPercentValue(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Format a value as a whole number (for months)
 */
export function formatMonthValue(value: number): string {
  return Math.round(value).toString();
}