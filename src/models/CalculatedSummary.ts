export interface CalculatedSummary {
    initialShareCount: number;
    annualizedDividendYieldPercent: number;
    monthlyLoanPayment: number;
    loanPayoffMonth: number;
    yearlyPortfolioValues: { month: number; value: number }[];
}