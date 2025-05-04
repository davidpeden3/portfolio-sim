import React from 'react';
import ProfileCard from '../ProfileCard';
import { CustomIcon } from '../ProfileIcons';
import { InvestorProfileData, CURRENT_SHARE_PRICE, DEFAULT_DIVIDEND_YIELD, DEFAULT_MONTHLY_APPRECIATION } from './ProfileData';
import { ProfileType } from './types';

// Custom profile metadata only - data values will be set by user
export const customProfile: InvestorProfileData = {
  name: "Custom Profile",
  description: "Your personalized settings",
  // The data property is still needed for the profile structure, 
  // but these values will be overwritten by the user's saved custom profile
  data: {
    // These values are placeholders and will be replaced
    initialShareCount: 0,
    initialInvestment: 0,
    baseIncome: 0,
    surplusForDripPercent: 0,
    withholdTaxes: true, // For backward compatibility
    taxWithholdingStrategy: 'none',
    taxWithholdingMethod: 'taxBracket',
    taxFilingType: 'single',
    taxFixedAmount: 0,
    taxFixedPercent: 0,
    dripStrategy: 'percentage',
    dripPercentage: 100,
    dripFixedAmount: 0,
    simulationMonths: 0,
    startMonth: 1, // January
    initialSharePrice: CURRENT_SHARE_PRICE,
    dividendYield4w: DEFAULT_DIVIDEND_YIELD,
    monthlyAppreciation: DEFAULT_MONTHLY_APPRECIATION,
    includeLoan: false,
    loanAmount: 0,
    annualInterestRate: 0,
    amortizationMonths: 0
  }
};

interface CustomProfileProps {
  selectedProfile: ProfileType;
  onClick: (profileType: ProfileType) => void;
}

/**
 * Custom investor profile component
 */
const CustomProfile: React.FC<CustomProfileProps> = ({ 
  selectedProfile, 
  onClick 
}) => {
  return (
    <ProfileCard
      profileType="custom"
      selectedProfile={selectedProfile}
      name={customProfile.name}
      description={customProfile.description}
      icon={<CustomIcon />}
      onClick={onClick}
    />
  );
};

export default CustomProfile;