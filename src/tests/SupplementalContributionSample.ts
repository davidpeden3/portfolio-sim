import { SupplementalContribution } from '../models/SupplementalContribution';

// Create a sample contribution for testing
export function getSampleContribution(): SupplementalContribution {
  return {
    id: '1',
    name: 'Monthly $100',
    amount: 100,
    type: 'dca',
    enabled: true,
    recurring: true,
    frequency: 'monthly',
    startDate: new Date(new Date().getFullYear(), 0, 1), // January 1 of current year
    endDate: new Date(new Date().getFullYear() + 1, 0, 1) // January 1 of next year
  };
}