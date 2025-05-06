import React from 'react';
import ProfileCard from '../ProfileCard';
import { RetirementIcon } from '../ProfileIcons';
import { InvestorProfileData, CURRENT_SHARE_PRICE, DEFAULT_DIVIDEND_YIELD, DEFAULT_MONTHLY_APPRECIATION } from './ProfileData';
import { ProfileType } from './types';

// Retirement profile data
export const retirementProfile: InvestorProfileData = {
  name: "Near/In Retirement (60+)",
  description: "For income-focused investors with substantial holdings",
  data: {
    // Investor Profile
    initialShareCount: 25000,
    initialInvestment: 0,
    baseIncome: 0, // Minimal external income
    surplusForDripPercent: 90, // focus on income
    withholdTaxes: true, // For backward compatibility
    taxWithholdingStrategy: 'monthly',
    taxWithholdingMethod: 'taxBracket',
    taxFilingType: 'married',
    taxFixedAmount: 0,
    taxFixedPercent: 0,
    dripStrategy: 'percentage',
    dripPercentage: 100,
    dripFixedAmount: 0,
    fixedIncomeAmount: 0,
    supplementalContributions: [
      {
        id: '8e32f4a1-5b9c-4d7e-9f3a-483e6c7d9b0e',
        name: 'One-time Bonus Investment',
        amount: 10000,
        type: 'oneTime',
        enabled: true,
        recurring: false,
        frequency: 'none',
        startDate: new Date('2025-06-15'),
        endDate: new Date('2025-06-15')
      }
    ],
    
    // Simulation Parameters
    simulationMonths: 120, // 10 years
    startMonth: 1, // January
    initialSharePrice: CURRENT_SHARE_PRICE,
    dividendYield4w: DEFAULT_DIVIDEND_YIELD,
    monthlyAppreciation: DEFAULT_MONTHLY_APPRECIATION,
    
    // Loan Settings
    includeLoan: false,
    loanAmount: 0,
    annualInterestRate: 7,
    amortizationMonths: 120 // 10 years but loan is excluded
  }
};

interface RetirementProfileProps {
  selectedProfile: ProfileType;
  onClick: (profileType: ProfileType) => void;
}

/**
 * Retirement investor profile component
 */
const RetirementProfile: React.FC<RetirementProfileProps> = ({ 
  selectedProfile, 
  onClick 
}) => {
  return (
    <ProfileCard
      profileType="retirement"
      selectedProfile={selectedProfile}
      name={retirementProfile.name}
      description={retirementProfile.description}
      icon={<RetirementIcon />}
      onClick={onClick}
    />
  );
};

export default RetirementProfile;