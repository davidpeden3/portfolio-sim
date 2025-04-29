export interface AmortizationEntry {
    month: number;
    shareCount: number;
    dividend: number;
    distribution: number;
    ytdDistribution: number;
    marginalTaxesWithheld: number;
    loanPayment: number;
    surplusForDrip: number;
    additionalPrincipal: number;
    actualDrip: number;
    sharePrice: number;
    newSharesFromDrip: number;
    totalShares: number;
    portfolioValue: number;
    loanPrincipal: number;
    netPortfolioValue: number;
}