/**
 * Types for supplemental contributions to the portfolio
 */

// Types of supplemental contributions
export type ContributionType = 'dca' | 'salary' | 'oneTime';

// Frequency options for all contributions
export type ContributionFrequency = 'none' | 'daily' | 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'quarterly' | 'yearly';

// Weekday type for weekly/biweekly contributions (Monday through Friday)
// Note: JavaScript getDay() returns 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
// We use the same numbering as JavaScript for weekdays (1-5 for Mon-Fri)
export type WeekDay = 1 | 2 | 3 | 4 | 5; // 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday

// Base interface for all contribution types
export interface BaseContribution {
  id: string; // Unique identifier
  name: string; // User-friendly name
  amount: number; // Dollar amount
  type: ContributionType; // Type of contribution
  enabled: boolean; // Whether this contribution is active
  recurring: boolean; // Whether this is a recurring contribution
  frequency: ContributionFrequency; // Frequency of contribution (none for one-time)
  startDate?: Date; // Optional start date, defaults to simulation start
  endDate?: Date; // Optional end date, defaults to simulation end
  dayOfWeek?: WeekDay; // Optional day of week (1-5, Monday-Friday) for weekly/biweekly contributions
}

// Interface for dollar-cost averaging contributions
export interface DcaContribution extends BaseContribution {
  type: 'dca';
  recurring: true;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

// Interface for salary contributions
export interface SalaryContribution extends BaseContribution {
  type: 'salary';
  recurring: true;
  frequency: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
}

// Interface for one-time contributions
export interface OneTimeContribution extends BaseContribution {
  type: 'oneTime';
  recurring: false;
  frequency: 'none';
  // For one-time contributions, startDate and endDate will have the same value
}

// Union type for all contribution types
export type SupplementalContribution = DcaContribution | SalaryContribution | OneTimeContribution;

// Utility type for a materialized contribution with a specific date
export interface MaterializedContribution {
  amount: number;
  date: Date;
  sourceId: string; // Reference to the original contribution ID
  sourceName: string; // Reference to the original contribution name
}