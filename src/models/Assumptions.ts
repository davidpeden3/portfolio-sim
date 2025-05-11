// Tax withholding strategy and method types
export type TaxWithholdingStrategy = 'none' | 'monthly' | 'quarterly';
export type TaxWithholdingMethod = 'taxBracket' | 'fixedAmount' | 'fixedPercent';
export type FilingType = 'single' | 'married' | 'headOfHousehold';

// DRIP strategy types
export type DripStrategy = 'none' | 'percentage' | 'fixedAmount' | 'fixedIncome';

// Share price change model types
export type SharePriceModel = 'linear' | 'geometric' | 'variable';
export type VariableDistribution = 'uniform' | 'normal' | 'gbm';

// Dividend model types
export type DividendModel = 'flatAmount' | 'yieldBased' | 'variable';
export type YieldPeriod = '4w' | 'yearly';

// Import supplemental contribution types
import { SupplementalContribution } from './SupplementalContribution';

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

    // Supplemental Contributions
    supplementalContributions?: SupplementalContribution[];

    // Simulation Parameters
    simulationMonths: number;
    startMonth?: number; // 1-12 representing January-December
    initialSharePrice: number;
    dividendYieldPer4wPercent?: number; // Kept for backward compatibility

    // Dividend Model
    dividendModel?: DividendModel; // Default to 'yieldBased' for backward compatibility
    flatDividendAmount?: number; // For flatAmount model
    yieldPeriod?: YieldPeriod; // '4w' or 'yearly'
    dividendYieldPercent?: number; // For yieldBased model
    dividendVariableDistribution?: VariableDistribution;

    // Parameters for dividend variable distributions
    dividendUniformMin?: number;
    dividendUniformMax?: number;
    dividendNormalMean?: number;
    dividendNormalStdDev?: number;
    dividendGbmDrift?: number;
    dividendGbmVolatility?: number;

    // Initial dividend parameters
    initialDividendMethod?: 'flatAmount' | 'yieldBased';
    initialDividendAmount?: number; // Used when initialDividendMethod is 'flatAmount'
    initialDividendYield?: number; // Used when initialDividendMethod is 'yieldBased'

    // Share Price Model
    monthlyAppreciationPercent?: number; // Kept for backward compatibility
    sharePriceModel?: SharePriceModel; // Default to 'geometric' for backward compatibility

    // Linear Model (flat $ amount per month)
    linearChangeAmount?: number; // Positive for increase, negative for decrease

    // Geometric Model (percentage change) - uses monthlyAppreciationPercent for backward compatibility

    // Variable Model
    variableDistribution?: VariableDistribution;

    // Parameters for distributions
    uniformMin?: number;
    uniformMax?: number;

    normalMean?: number;
    normalStdDev?: number;

    gbmDrift?: number;
    gbmVolatility?: number;


    // Loan Settings
    includeLoan: boolean;
    loanAmount: number;
    annualInterestRatePercent: number;
    amortizationMonths: number;
}