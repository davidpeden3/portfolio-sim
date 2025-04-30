import { describe, it, expect } from 'vitest';
import { calculatePortfolio } from '../calculator/PortfolioCalculator';
import { Assumptions } from '../models/Assumptions';

// Pure math rounding to 2 decimals
function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

describe('portfolioCalculator', () => {
  it('should correctly calculate amortization schedule and summary for sample data', () => {
    const assumptions: Assumptions = {
      initialShareCount: 0,
      initialInvestment: 200000,
      initialSharePrice: 22.50,
      dividendYieldPer4wPercent: 5.0,
      monthlyAppreciationPercent: -1.0,
      loanAmount: 200000,
      annualInterestRatePercent: 7.5,
      amortizationMonths: 240,
      baseIncome: 100000,
      surplusForDripToPrincipalPercent: 75,
      withholdTaxes: true
    };

    const { summary, amortization } = calculatePortfolio(assumptions);

    // --- Summary checks ---
    expect(round2(summary.initialShareCount)).toBe(8888.89);
    expect(round2(summary.annualizedDividendYieldPercent)).toBe(65.00);
    expect(round2(summary.monthlyLoanPayment)).toBe(1611.19);

    // --- Amortization checks ---

    // Month 0
    const m0 = amortization[0];
    expect(m0.month).toBe(0);
    expect(round2(m0.shareCount)).toBe(8888.89);
    expect(round2(m0.dividend)).toBe(0.00);
    expect(round2(m0.distribution)).toBe(0.00);
    expect(round2(m0.sharePrice)).toBe(22.50);
    expect(round2(m0.loanPrincipal)).toBe(200000.00);
    expect(round2(m0.netPortfolioValue)).toBe(0.00);

    // Month 1
    const m1 = amortization[1];
    expect(m1.month).toBe(1);
    expect(round2(m1.shareCount)).toBe(8888.89);
    expect(round2(m1.dividend)).toBe(1.11);
    expect(round2(m1.distribution)).toBe(9900.00);
    expect(round2(m1.ytdDistribution)).toBe(9900.00);
    expect(round2(m1.marginalTaxesWithheld)).toBe(2178.00);
    expect(round2(m1.loanPayment)).toBe(1611.19);
    expect(round2(m1.surplusForDrip)).toBe(6110.81);
    expect(round2(m1.additionalPrincipal)).toBe(4583.11);
    expect(round2(m1.actualDrip)).toBe(1527.70);
    expect(round2(m1.sharePrice)).toBe(22.28);
    expect(round2(m1.newSharesFromDrip)).toBe(68.58);
    expect(round2(m1.totalShares)).toBe(8957.47);
    expect(round2(m1.portfolioValue)).toBe(199527.70);
    expect(round2(m1.loanPrincipal)).toBe(195055.70);
    expect(round2(m1.netPortfolioValue)).toBe(4472.00);

    // Month 2
    const m2 = amortization[2];
    expect(m2.month).toBe(2);
    expect(round2(m2.shareCount)).toBe(8957.47);
    expect(round2(m2.dividend)).toBe(1.10);
    expect(round2(m2.distribution)).toBe(9876.62);
    expect(round2(m2.ytdDistribution)).toBe(19776.62);
    expect(round2(m2.marginalTaxesWithheld)).toBe(2172.86);
    expect(round2(m2.loanPayment)).toBe(1611.19);
    expect(round2(m2.surplusForDrip)).toBe(6092.58);
    expect(round2(m2.additionalPrincipal)).toBe(4569.43);
    expect(round2(m2.actualDrip)).toBe(1523.14);
    expect(round2(m2.sharePrice)).toBe(22.05);
    expect(round2(m2.newSharesFromDrip)).toBe(69.07);
    expect(round2(m2.totalShares)).toBe(9026.54);
    expect(round2(m2.portfolioValue)).toBe(199055.57);
    expect(round2(m2.loanPrincipal)).toBe(190094.18);
    expect(round2(m2.netPortfolioValue)).toBe(8961.39);

    // Month 3
    const m3 = amortization[3];
    expect(m3.month).toBe(3);
    expect(round2(m3.shareCount)).toBe(9026.54);
    expect(round2(m3.dividend)).toBe(1.09);
    expect(round2(m3.distribution)).toBe(9853.25);
    expect(round2(m3.ytdDistribution)).toBe(29629.87);
    expect(round2(m3.marginalTaxesWithheld)).toBe(2167.72);
    expect(round2(m3.loanPayment)).toBe(1611.19);
    expect(round2(m3.surplusForDrip)).toBe(6074.35);
    expect(round2(m3.additionalPrincipal)).toBe(4555.76);
    expect(round2(m3.actualDrip)).toBe(1518.59);
    expect(round2(m3.sharePrice)).toBe(21.83);
    expect(round2(m3.newSharesFromDrip)).toBe(69.56);
    expect(round2(m3.totalShares)).toBe(9096.10);
    expect(round2(m3.portfolioValue)).toBe(198583.60);
    expect(round2(m3.loanPrincipal)).toBe(185115.32);
    expect(round2(m3.netPortfolioValue)).toBe(13468.28);
  });
});