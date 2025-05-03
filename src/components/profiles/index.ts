/**
 * Export all profile components and data
 */

// Export profile components
export { default as EarlyCareerProfile } from './EarlyCareerProfile';
export { default as MidCareerProfile } from './MidCareerProfile';
export { default as RetirementProfile } from './RetirementProfile';
export { default as CustomProfile } from './CustomProfile';

// Export profile data
export { earlyCareerProfile } from './EarlyCareerProfile';
export { midCareerProfile } from './MidCareerProfile';
export { retirementProfile } from './RetirementProfile';
export { customProfile } from './CustomProfile';

// Export shared types and constants
export type { ProfileType } from './types';
export {CURRENT_SHARE_PRICE} from './ProfileData';
export type { InvestorProfileData } from './ProfileData';

