// Tax withholding strategy and method types
export type TaxWithholdingStrategy = 'none' | 'monthly' | 'quarterly';
export type TaxWithholdingMethod = 'taxBracket' | 'fixedAmount' | 'fixedPercent';
export type FilingType = 'single' | 'married' | 'headOfHousehold';

// DRIP strategy types
export type DripStrategy = 'none' | 'percentage' | 'fixedAmount' | 'fixedIncome';

// Share price change model types
export type SharePriceModel = 'linear' | 'geometric' | 'uniform' | 'normal' | 'gbm';
export type VariableDistribution = 'uniform' | 'normal' | 'gbm';

// Dividend model types
export type DividendModel = 'linear' | 'yieldBased' | 'uniform' | 'normal' | 'gbm';
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
    withholdTaxes: boolean; // Basic tax withholding flag
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
    dividendYieldPer4wPercent?: number; // Basic 4-week dividend yield percentage

    // Dividend Model
    dividendModel?: DividendModel; // Default to 'yieldBased'
    flatDividendAmount?: number; // For flatAmount model
    linearDividendChangeAmount?: number; // For linear model - incremental change per month
    yieldPeriod?: YieldPeriod; // '4w' or 'yearly'
    dividend4wYieldPercent?: number; // For yieldBased model with 4-week period
    dividendYearlyYieldPercent?: number; // For yieldBased model with yearly period
    dividendYieldPercent?: number; // Standard yield field
    dividendVariableDistribution?: VariableDistribution;

    // Parameters for dividend uniform distribution - separate for 4w and yearly
    dividendUniformMin4w?: number; // Min yield for 4-week period
    dividendUniformMax4w?: number; // Max yield for 4-week period
    dividendUniformMinYearly?: number; // Min yield for yearly period
    dividendUniformMaxYearly?: number; // Max yield for yearly period
    // Standard uniform parameters
    dividendUniformMin?: number;
    dividendUniformMax?: number;
    // Parameters for dividend normal distribution - separate for 4w and yearly
    dividendNormalMean4w?: number; // Mean yield for 4-week period
    dividendNormalStdDev4w?: number; // Standard deviation for 4-week period
    dividendNormalMeanYearly?: number; // Mean yield for yearly period
    dividendNormalStdDevYearly?: number; // Standard deviation for yearly period
    // Standard normal parameters
    dividendNormalMean?: number;
    dividendNormalStdDev?: number;
    dividendGbmDrift?: number;
    dividendGbmVolatility?: number;

    // Initial dividend parameters
    initialDividendMethod?: 'flatAmount' | 'yieldBased';
    initialDividendAmount?: number; // Used when initialDividendMethod is 'flatAmount'
    initialDividendYield?: number; // Used when initialDividendMethod is 'yieldBased'

    // Share Price Model
    monthlyAppreciationPercent?: number; // For geometric model
    sharePriceModel?: SharePriceModel; // Default to 'geometric'

    // Linear Model (flat $ amount per month)
    linearChangeAmount?: number; // Positive for increase, negative for decrease

    // Geometric Model (percentage change) - uses monthlyAppreciationPercent

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