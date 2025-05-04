export interface AmortizationEntry {
    month: number;
    shareCount: number;
    dividend: number;
    distribution: number;
    ytdDistribution: number;
    marginalTaxesWithheld: number;
    effectiveTaxRate?: number; // Calculated effective tax rate for all distributions so far
    loanPayment: number;
    surplusForDrip: number;
    additionalPrincipal: number;
    income: number; // Income taken before DRIP (for fixed income strategy)
    actualDrip: number;
    sharePrice: number;
    newSharesFromDrip: number;
    totalShares: number;
    portfolioValue: number;
    loanPrincipal: number;
    netPortfolioValue: number;
}