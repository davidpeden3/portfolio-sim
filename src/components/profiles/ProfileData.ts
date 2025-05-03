/**
 * Shared data structures for investor profiles
 */
import { PortfolioFormData } from '../AssumptionsForm';
import { ProfileType } from './types';

// Re-export the ProfileType
export type { ProfileType };

// Base interface for profile data
export interface InvestorProfileData {
  name: string;
  description: string;
  data: PortfolioFormData;
}

// Base investor profile data for consistency
export const CURRENT_SHARE_PRICE = 24.33;

// Common dividend yield used across profiles
export const DEFAULT_DIVIDEND_YIELD = 5;

// Common monthly appreciation rate
export const DEFAULT_MONTHLY_APPRECIATION = -1;