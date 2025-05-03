import React from 'react';
import ProfileCard from '../ProfileCard';
import { EarlyCareerIcon } from '../ProfileIcons';
import { InvestorProfileData, CURRENT_SHARE_PRICE, DEFAULT_DIVIDEND_YIELD, DEFAULT_MONTHLY_APPRECIATION } from './ProfileData';
import { ProfileType } from './types';

// Early Career profile data
export const earlyCareerProfile: InvestorProfileData = {
  name: "Early Career (20s-30s)",
  description: "For young investors focusing on growth with moderate income",
  data: {
    // Investor Profile
    initialShareCount: 0,
    initialInvestment: 10000,
    baseIncome: 60000,
    surplusForDripPercent: 25, // pay loan down faster
    withholdTaxes: true,
    
    // Simulation Parameters
    simulationMonths: 300, // 25 years
    initialSharePrice: CURRENT_SHARE_PRICE,
    dividendYield4w: DEFAULT_DIVIDEND_YIELD,
    monthlyAppreciation: DEFAULT_MONTHLY_APPRECIATION,
    
    // Loan Settings
    includeLoan: true,
    loanAmount: 15000,
    annualInterestRate: 9.0,
    amortizationMonths: 300 // 25 years
  }
};

interface EarlyCareerProfileProps {
  selectedProfile: ProfileType;
  onClick: (profileType: ProfileType) => void;
}

/**
 * Early Career investor profile component
 */
const EarlyCareerProfile: React.FC<EarlyCareerProfileProps> = ({ 
  selectedProfile, 
  onClick 
}) => {
  return (
    <ProfileCard
      profileType="earlyCareer"
      selectedProfile={selectedProfile}
      name={earlyCareerProfile.name}
      description={earlyCareerProfile.description}
      icon={<EarlyCareerIcon />}
      onClick={onClick}
    />
  );
};

export default EarlyCareerProfile;