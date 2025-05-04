// Tax withholding strategy and method types
export type TaxWithholdingStrategy = 'none' | 'monthly' | 'quarterly';
export type TaxWithholdingMethod = 'taxBracket' | 'fixedAmount' | 'fixedPercent';
export type FilingType = 'single' | 'married' | 'headOfHousehold';

// DRIP strategy types
export type DripStrategy = 'none' | 'percentage' | 'fixedAmount' | 'fixedIncome';

export interface Assumptions {
    // Investor Profile
    initialShareCount: number;
    initialInvestment: number;
    baseIncome: number;
    surplusForDripToPrincipalPercent: number;
    
    // Tax Settings
    withholdTaxes: boolean; // Kept for backward compatibility
    taxWithholdingStrategy?: TaxWithholdingStrategy;
    taxWithholdingMethod?: TaxWithholdingMethod;
    taxFilingType?: FilingType;
    taxFixedAmount?: number;
    taxFixedPercent?: number;
    
    // DRIP Settings
    dripStrategy?: DripStrategy;
    dripPercentage?: number;
    dripFixedAmount?: number;
    fixedIncomeAmount?: number; // Monthly income amount for fixedIncome strategy
    
    // Simulation Parameters
    simulationMonths: number;
    startMonth?: number; // 1-12 representing January-December
    initialSharePrice: number;
    dividendYieldPer4wPercent: number;
    monthlyAppreciationPercent: number;
    
    // Loan Settings
    includeLoan: boolean;
    loanAmount: number;
    annualInterestRatePercent: number;
    amortizationMonths: number;
}