export interface Assumptions {
    initialShareCount: number;
    initialInvestment: number;
    initialSharePrice: number;
    dividendYieldPer4wPercent: number;
    monthlyAppreciationPercent: number;
    loanAmount: number;
    annualInterestRatePercent: number;
    amortizationMonths: number;
    baseIncome: number;
    surplusForDripToPrincipalPercent: number;
    withholdTaxes: boolean;
}