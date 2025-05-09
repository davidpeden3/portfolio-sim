import { InvestorProfileData, CURRENT_SHARE_PRICE, DEFAULT_DIVIDEND_YIELD, DEFAULT_MONTHLY_APPRECIATION } from './ProfileData';

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
    fixedIncomeAmount: 0,
    supplementalContributions: [],
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

// Early career profile metadata and default values
export const earlyCareerProfile: InvestorProfileData = {
  name: "Early Career",
  description: "Get started with periodic investments",
  data: {
    initialShareCount: 0,
    initialInvestment: 0,
    baseIncome: 0,
    surplusForDripPercent: 0,
    withholdTaxes: true,
    taxWithholdingStrategy: 'monthly',
    taxWithholdingMethod: 'taxBracket',
    taxFilingType: 'single',
    taxFixedAmount: 0,
    taxFixedPercent: 0,
    dripStrategy: 'percentage',
    dripPercentage: 100,
    dripFixedAmount: 0,
    fixedIncomeAmount: 0,
    supplementalContributions: [],
    simulationMonths: 60, // 5 years
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

// Mid-career profile metadata and default values
export const midCareerProfile: InvestorProfileData = {
  name: "Mid Career",
  description: "Maximize returns with a solid base",
  data: {
    initialShareCount: 100,
    initialInvestment: 2500,
    baseIncome: 0,
    surplusForDripPercent: 0,
    withholdTaxes: true,
    taxWithholdingStrategy: 'monthly',
    taxWithholdingMethod: 'taxBracket',
    taxFilingType: 'single',
    taxFixedAmount: 0,
    taxFixedPercent: 0,
    dripStrategy: 'percentage',
    dripPercentage: 100,
    dripFixedAmount: 0,
    fixedIncomeAmount: 0,
    supplementalContributions: [],
    simulationMonths: 120, // 10 years
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

// Retirement profile metadata and default values
export const retirementProfile: InvestorProfileData = {
  name: "Retirement",
  description: "Convert investments to income",
  data: {
    initialShareCount: 1000,
    initialInvestment: 25000,
    baseIncome: 0,
    surplusForDripPercent: 0,
    withholdTaxes: true,
    taxWithholdingStrategy: 'monthly',
    taxWithholdingMethod: 'taxBracket',
    taxFilingType: 'single',
    taxFixedAmount: 0,
    taxFixedPercent: 0,
    dripStrategy: 'fixedIncome',
    dripPercentage: 0,
    dripFixedAmount: 0,
    fixedIncomeAmount: 500,
    supplementalContributions: [],
    simulationMonths: 240, // 20 years
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