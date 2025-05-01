export interface Assumptions {
    // Investor Profile
    initialShareCount: number;
    initialInvestment: number;
    baseIncome: number;
    surplusForDripToPrincipalPercent: number;
    withholdTaxes: boolean;
    
    // Simulation Parameters
    simulationMonths: number;
    initialSharePrice: number;
    dividendYieldPer4wPercent: number;
    monthlyAppreciationPercent: number;
    
    // Loan Settings
    includeLoan: boolean;
    loanAmount: number;
    annualInterestRatePercent: number;
    amortizationMonths: number;
}