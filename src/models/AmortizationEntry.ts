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
    supplementalContribution: number; // Additional contribution for the month
    actualDrip: number;
    sharePrice: number;
    newSharesFromDrip: number;
    newSharesFromContribution?: number; // Shares from supplemental contributions
    totalShares: number;
    portfolioValue: number;
    loanPrincipal: number;
    netPortfolioValue: number;
}