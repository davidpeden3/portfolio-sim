import React from 'react';
import ProfileCard from '../ProfileCard';
import { MidCareerIcon } from '../ProfileIcons';
import { InvestorProfileData, CURRENT_SHARE_PRICE, DEFAULT_DIVIDEND_YIELD, DEFAULT_MONTHLY_APPRECIATION } from './ProfileData';
import { ProfileType } from './types';

// Mid-Career profile data
export const midCareerProfile: InvestorProfileData = {
  name: "Mid-Career Professional (40s-50s)",
  description: "For established professionals with higher income and existing position",
  data: {
    // Investor Profile
    initialShareCount: 5000,
    initialInvestment: 50000,
    baseIncome: 120000,
    surplusForDripPercent: 50, // balanced approach
    withholdTaxes: true,
    
    // Simulation Parameters
    simulationMonths: 240, // 20 years
    initialSharePrice: CURRENT_SHARE_PRICE,
    dividendYield4w: DEFAULT_DIVIDEND_YIELD,
    monthlyAppreciation: DEFAULT_MONTHLY_APPRECIATION,
    
    // Loan Settings
    includeLoan: true,
    loanAmount: 75000,
    annualInterestRate: 7.5,
    amortizationMonths: 240 // 20 years
  }
};

interface MidCareerProfileProps {
  selectedProfile: ProfileType;
  onClick: (profileType: ProfileType) => void;
}

/**
 * Mid-Career investor profile component
 */
const MidCareerProfile: React.FC<MidCareerProfileProps> = ({ 
  selectedProfile, 
  onClick 
}) => {
  return (
    <ProfileCard
      profileType="midCareer"
      selectedProfile={selectedProfile}
      name={midCareerProfile.name}
      description={midCareerProfile.description}
      icon={<MidCareerIcon />}
      onClick={onClick}
    />
  );
};

export default MidCareerProfile;