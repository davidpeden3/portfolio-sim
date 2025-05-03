/**
 * Profile type constants
 */

// Profile types as constants
export const PROFILE_EARLY_CAREER = "earlyCareer";
export const PROFILE_MID_CAREER = "midCareer";
export const PROFILE_RETIREMENT = "retirement";
export const PROFILE_CUSTOM = "custom";

// Type for profile types (using the constants)
export type ProfileType = 
  | typeof PROFILE_EARLY_CAREER 
  | typeof PROFILE_MID_CAREER
  | typeof PROFILE_RETIREMENT
  | typeof PROFILE_CUSTOM;