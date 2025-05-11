import { describe, it, expect } from 'vitest';
import { calculatePortfolio } from '../calculator/PortfolioCalculator';
import { Assumptions } from '../models/Assumptions';

// Helper function to get statistics from an array
function getStats(array: number[]) {
  const max = Math.max(...array);
  const min = Math.min(...array);
  const avg = array.reduce((sum, val) => sum + val, 0) / array.length;
  return { max, min, avg };
}

describe('GBM Dividend Model', () => {
  it('should correctly initialize and grow dividends using GBM', () => {
    // Create assumptions with GBM dividend model
    const assumptions: Assumptions = {
      // Basic simulation parameters
      initialShareCount: 100,
      initialInvestment: 0,
      baseIncome: 50000,
      surplusForDripToPrincipalPercent: 0,
      simulationMonths: 24,
      initialSharePrice: 50,
      
      // Loan settings (disabled)
      includeLoan: false,
      loanAmount: 0,
      annualInterestRatePercent: 0,
      amortizationMonths: 0,
      
      // DRIP settings
      withholdTaxes: false,
      dripStrategy: 'percentage',
      dripPercentage: 100,
      
      // Share price model - using geometric for simplicity
      sharePriceModel: 'geometric',
      monthlyAppreciationPercent: 0.5, // 0.5% per month
      
      // Dividend model settings - using GBM
      dividendModel: 'gbm',
      dividendGbmDrift: 2, // 2% annual drift
      dividendGbmVolatility: 30, // 30% annual volatility
      
      // Initial dividend settings
      initialDividendMethod: 'flatAmount',
      initialDividendAmount: 2.00, // $2.00 initial dividend
      initialDividendYield: 6 // 6% annual yield (fallback)
    };
    
    // Calculate portfolio with these settings
    const result = calculatePortfolio(assumptions);
    
    // Print first few months for debugging
    console.log("\nFirst few months:");
    result.amortization.slice(0, 5).forEach(month => {
      console.log(`Month ${month.month}: Share Price $${month.sharePrice.toFixed(2)}, Dividend $${month.dividend.toFixed(2)}`);
    });
    
    // Verify that initial dividend is set correctly in month 0
    expect(result.amortization[0].dividend).toBe(2);
    
    // Get all dividends
    const dividends = result.amortization.map(month => month.dividend);
    
    // Verify no dividends are exactly 0 (which would indicate initialization issue)
    const zeroMonths = dividends.filter(div => div === 0).length;
    expect(zeroMonths).toBe(0);
    
    // Get dividend statistics
    const { max: maxDividend, min: minDividend, avg: avgDividend } = getStats(dividends);
    console.log(`\nDividend Statistics:`);
    console.log(`- Maximum Dividend: $${maxDividend.toFixed(2)}`);
    console.log(`- Minimum Dividend: $${minDividend.toFixed(2)}`);
    console.log(`- Average Dividend: $${avgDividend.toFixed(2)}`);

    // With high volatility (30%), some dividends should exceed $2.00
    const monthsAbove2 = dividends.filter(div => div > 2.0).length;
    console.log(`- Months with dividend > $2.00: ${monthsAbove2} out of ${dividends.length}`);
    expect(monthsAbove2).toBeGreaterThan(0);

    // Due to random nature of GBM, we can't test exact values,
    // but we can test that dividends change over time and aren't all the same
    const uniqueDividendValues = new Set(dividends.map(d => d.toFixed(4))).size;
    expect(uniqueDividendValues).toBeGreaterThan(1);
  });
});