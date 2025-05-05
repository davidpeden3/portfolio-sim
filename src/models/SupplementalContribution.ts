/**
 * Types for supplemental contributions to the portfolio
 */

// Types of supplemental contributions
export type ContributionType = 'dca' | 'salary' | 'oneTime';

// Frequency options for all contributions
export type ContributionFrequency = 'none' | 'daily' | 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'quarterly' | 'yearly';

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