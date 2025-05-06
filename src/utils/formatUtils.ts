/**
 * Utility functions for formatting display values
 * These functions are used by the specialized input components
 */

/**
 * Helper function to check if a value is empty or NaN
 */
export function isEmptyOrInvalid(value: number | string): boolean {
  if (value === '') return true;
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num);
  }
  return isNaN(value);
}

/**
 * Format a value as currency with two decimal places and $ symbol
 * @param value The number value to format
 * @returns Formatted string with $ symbol and commas
 */
export function formatDollarValue(value: number | string): string {
  // Handle empty or invalid values
  if (isEmptyOrInvalid(value)) return '';
  
  // Convert to number
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return '$' + numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Format a value as a percentage with two decimal places and % symbol
 * @param value The number value to format
 * @returns Formatted string with % symbol and commas
 */
export function formatPercentValue(value: number | string): string {
  // Handle empty or invalid values
  if (isEmptyOrInvalid(value)) return '';
  
  // Convert to number
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + '%';
}

/**
 * Format a value as a whole number (for months or other integer values)
 * @param value The number value to format
 * @returns Formatted string as an integer
 */
export function formatMonthValue(value: number | string): string {
  // Handle empty or invalid values
  if (isEmptyOrInvalid(value)) return '';
  
  // Convert to number and round
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return Math.round(numValue).toString();
}

/**
 * Format a regular number with commas (for values like share count)
 * @param value The number value to format
 * @returns Formatted string with commas
 */
export function formatNumber(value: number | string): string {
  // Handle empty or invalid values
  if (isEmptyOrInvalid(value)) return '';
  
  // Convert to number
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue.toLocaleString();
}

/**
 * Format a value as currency for display (alias for formatDollarValue)
 * @param value The number value to format
 * @returns Formatted string with $ symbol and commas
 */
export function formatUSD(value: number | string): string {
  return formatDollarValue(value);
}