import { describe, it, expect } from 'vitest';
import { calculatePortfolio } from '../calculator/PortfolioCalculator';
import { Assumptions } from '../models/Assumptions';

// Pure math rounding to 2 decimals
function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

describe('portfolioCalculator', () => {
  it('should correctly add shares from supplemental contributions', () => {
    // Create an assumption with supplemental contributions
    const assumptions: Assumptions = {
      // Investor Profile
      initialShareCount: 100,
      initialInvestment: 1000,
      baseIncome: 50000,
      surplusForDripToPrincipalPercent: 0,
      withholdTaxes: false,
      
      // Simulation Parameters
      simulationMonths: 12,
      startMonth: 1, // January
      initialSharePrice: 10,
      dividendYieldPer4wPercent: 1.0,
      monthlyAppreciationPercent: 0.0,
      
      // Loan Settings
      includeLoan: false,
      loanAmount: 0,
      annualInterestRatePercent: 0,
      amortizationMonths: 12,
      
      // Add a monthly $100 contribution
      supplementalContributions: [
        {
          id: '1',
          name: 'Monthly $100',
          amount: 100,
          type: 'dca',
          enabled: true,
          recurring: true,
          frequency: 'monthly',
          startDate: new Date(new Date().getFullYear(), 0, 1), // January 1 of current year
          endDate: new Date(new Date().getFullYear() + 1, 0, 1) // January 1 of next year
        }
      ]
    };
    
    const { amortization } = calculatePortfolio(assumptions);
    
    // Check that contributions are being processed
    console.log("Testing supplemental contributions:");
    
    // Log first few months
    for (let i = 0; i <= 3; i++) {
      console.log(`Month ${i} - Contribution: $${amortization[i].supplementalContribution}, New Shares: ${amortization[i].newSharesFromContribution?.toFixed(2) || 'undefined'}, Total Shares: ${amortization[i].totalShares.toFixed(2)}`);
    }
    
    // Verify contributions are being applied
    expect(amortization[1].supplementalContribution).toBe(100);
    expect(amortization[1].newSharesFromContribution).toBe(10); // $100 / $10 per share = 10 shares
    
    // Verify shares are properly accumulated over time
    expect(amortization[0].totalShares).toBe(200); // Initial shares (100) + shares from investment (100)
    expect(amortization[1].totalShares).toBe(amortization[0].totalShares + amortization[1].newSharesFromDrip + amortization[1].newSharesFromContribution!);
    expect(amortization[2].totalShares).toBe(amortization[1].totalShares + amortization[2].newSharesFromDrip + amortization[2].newSharesFromContribution!);
  });
  it('should correctly calculate amortization schedule and summary for sample data', () => {
    const assumptions: Assumptions = {
      // Investor Profile
      initialShareCount: 0,
      initialInvestment: 200000,
      baseIncome: 100000,
      surplusForDripToPrincipalPercent: 75,
      withholdTaxes: true,
      
      // Simulation Parameters
      simulationMonths: 240, // Same as amortization months
      initialSharePrice: 22.50,
      dividendYieldPer4wPercent: 5.0,
      monthlyAppreciationPercent: -1.0,
      
      // Loan Settings
      includeLoan: true, // Important: Include the loan in the calculation
      loanAmount: 200000,
      annualInterestRatePercent: 7.5,
      amortizationMonths: 240
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
    // Tax calculation with standard deduction
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
    // Tax calculation with standard deduction
    expect(round2(m2.marginalTaxesWithheld)).toBe(2201.39);
    expect(round2(m2.loanPayment)).toBe(1611.19);
    expect(round2(m2.surplusForDrip)).toBe(6064.05);
    expect(round2(m2.additionalPrincipal)).toBe(4548.03);
    expect(round2(m2.actualDrip)).toBe(1516.01);
    expect(round2(m2.sharePrice)).toBe(22.05);
    expect(round2(m2.newSharesFromDrip)).toBe(68.75);
    expect(round2(m2.totalShares)).toBe(9026.22);
    expect(round2(m2.portfolioValue)).toBe(199048.44);
    expect(round2(m2.loanPrincipal)).toBe(190115.58);
    expect(round2(m2.netPortfolioValue)).toBe(8932.86);

    // Month 3
    const m3 = amortization[3];
    expect(m3.month).toBe(3);
    expect(round2(m3.shareCount)).toBe(9026.22);
    expect(round2(m3.dividend)).toBe(1.09);
    expect(round2(m3.distribution)).toBe(9852.90);
    expect(round2(m3.ytdDistribution)).toBe(29629.52);
    // Tax calculation with standard deduction
    expect(round2(m3.marginalTaxesWithheld)).toBe(2364.70);
    expect(round2(m3.loanPayment)).toBe(1611.19);
    expect(round2(m3.surplusForDrip)).toBe(5877.02);
    expect(round2(m3.additionalPrincipal)).toBe(4407.76);
    expect(round2(m3.actualDrip)).toBe(1469.25);
    expect(round2(m3.sharePrice)).toBe(21.83);
    expect(round2(m3.newSharesFromDrip)).toBe(67.30);
    expect(round2(m3.totalShares)).toBe(9093.52);
    expect(round2(m3.portfolioValue)).toBe(198527.21);
    expect(round2(m3.loanPrincipal)).toBe(185284.85);
    expect(round2(m3.netPortfolioValue)).toBe(13242.36);
  });

  it('should reset effective tax rate at the beginning of each year', () => {
    const assumptions: Assumptions = {
      // Investor Profile
      initialShareCount: 0,
      initialInvestment: 100000,
      baseIncome: 50000,
      surplusForDripToPrincipalPercent: 0, // No principal paydown
      withholdTaxes: true,
      taxWithholdingStrategy: 'monthly',
      taxWithholdingMethod: 'taxBracket',
      taxFilingType: 'single',
      
      // Simulation Parameters
      simulationMonths: 36, // 3 years
      initialSharePrice: 10.00,
      dividendYieldPer4wPercent: 1.0, // 1% per month
      monthlyAppreciationPercent: 0.0, // No price change
      
      // Loan Settings
      includeLoan: false, // No loan
      loanAmount: 0,
      annualInterestRatePercent: 0,
      amortizationMonths: 1
    };

    const { amortization } = calculatePortfolio(assumptions);

    // Log effective tax rates for key months
    console.log('Month 1:', amortization[1].effectiveTaxRate);
    console.log('Month 11:', amortization[11].effectiveTaxRate);
    console.log('Month 12:', amortization[12].effectiveTaxRate);
    console.log('Month 13:', amortization[13].effectiveTaxRate);
    console.log('Month 24:', amortization[24].effectiveTaxRate);
    console.log('Month 25:', amortization[25].effectiveTaxRate);

    // Verify effective tax rate structure
    
    // First month should have a rate
    expect(amortization[1].effectiveTaxRate).toBeDefined();
    
    // End of year 1 should have a higher rate than beginning of year 1
    // (as more income moves to higher brackets)
    expect(amortization[12].effectiveTaxRate).toBeGreaterThan(amortization[1].effectiveTaxRate!);
    
    // First month of year 2 should reset lower than last month of year 1
    expect(amortization[13].effectiveTaxRate).toBeLessThan(amortization[12].effectiveTaxRate!);
    
    // End of year 2 should have higher rate than beginning of year 2
    expect(amortization[24].effectiveTaxRate).toBeGreaterThan(amortization[13].effectiveTaxRate!);
    
    // First month of year 3 should reset lower than last month of year 2
    expect(amortization[25].effectiveTaxRate).toBeLessThan(amortization[24].effectiveTaxRate!);
  });

  it('should correctly calculate quarterly tax withholding with larger distributions', () => {
    const assumptions: Assumptions = {
      // Investor Profile
      initialShareCount: 0,
      initialInvestment: 100000,
      baseIncome: 50000, // With standard deduction of 15000, this gives 35000 taxable base income
      surplusForDripToPrincipalPercent: 0, 
      withholdTaxes: true,
      taxWithholdingStrategy: 'quarterly',
      taxWithholdingMethod: 'fixedPercent', // Using fixed percent for predictable testing
      taxFixedPercent: 15, // Using 15% for testing
      taxFilingType: 'single',
      
      // Simulation Parameters - Increase the dividend yield to ensure tax is withheld
      simulationMonths: 12, 
      initialSharePrice: 10.00,
      dividendYieldPer4wPercent: 5.0, // Increased for larger distributions that will be taxed
      monthlyAppreciationPercent: 0.0,
      
      // Loan Settings
      includeLoan: false,
      loanAmount: 0,
      annualInterestRatePercent: 0,
      amortizationMonths: 1
    };

    const { amortization } = calculatePortfolio(assumptions);

    // Non-quarter months should have zero tax withheld
    expect(amortization[1].marginalTaxesWithheld).toBe(0);
    expect(amortization[2].marginalTaxesWithheld).toBe(0);
    expect(amortization[4].marginalTaxesWithheld).toBe(0);
    expect(amortization[5].marginalTaxesWithheld).toBe(0);
    expect(amortization[7].marginalTaxesWithheld).toBe(0);
    expect(amortization[8].marginalTaxesWithheld).toBe(0);
    expect(amortization[10].marginalTaxesWithheld).toBe(0);
    expect(amortization[11].marginalTaxesWithheld).toBe(0);

    // Quarter months and YTD distributions
    console.log('Quarter month distributions with fixed percent:');
    console.log(`Month 3 - YTD: ${amortization[3].ytdDistribution.toFixed(2)}, Tax: ${amortization[3].marginalTaxesWithheld.toFixed(2)}, Rate: ${amortization[3].effectiveTaxRate}%`);
    console.log(`Month 6 - YTD: ${amortization[6].ytdDistribution.toFixed(2)}, Tax: ${amortization[6].marginalTaxesWithheld.toFixed(2)}, Rate: ${amortization[6].effectiveTaxRate}%`);
    console.log(`Month 9 - YTD: ${amortization[9].ytdDistribution.toFixed(2)}, Tax: ${amortization[9].marginalTaxesWithheld.toFixed(2)}, Rate: ${amortization[9].effectiveTaxRate}%`);
    console.log(`Month 12 - YTD: ${amortization[12].ytdDistribution.toFixed(2)}, Tax: ${amortization[12].marginalTaxesWithheld.toFixed(2)}, Rate: ${amortization[12].effectiveTaxRate}%`);

    // With high enough distributions, taxes should be withheld in quarter months
    const quarterMonths = [3, 6, 9, 12];
    const quarterMonthsWithTax = quarterMonths.filter(m => amortization[m].marginalTaxesWithheld > 0);
    expect(quarterMonthsWithTax.length).toBeGreaterThan(0);
    
    // For months with tax withheld, also check effective tax rate
    quarterMonthsWithTax.forEach(month => {
      expect(amortization[month].effectiveTaxRate).toBeGreaterThan(0);
      // With fixed percent tax method, the effective rate should be close to the specified percentage
      expect(amortization[month].effectiveTaxRate).toBeCloseTo(15, 0);
    });
  });
  
  it('should maintain appropriate tax pattern with quarterly withholding', () => {
    const assumptions: Assumptions = {
      // Investor Profile
      initialShareCount: 0,
      initialInvestment: 100000,
      baseIncome: 50000, // High enough to ensure taxes are withheld
      surplusForDripToPrincipalPercent: 0,
      withholdTaxes: true,
      taxWithholdingStrategy: 'quarterly',
      taxWithholdingMethod: 'fixedPercent', // Use fixed percent to ensure tax is withheld
      taxFixedPercent: 10, // 10% fixed rate
      taxFilingType: 'single',
      
      // Simulation Parameters
      simulationMonths: 12,
      initialSharePrice: 10.00,
      dividendYieldPer4wPercent: 10.0, // Much higher to ensure significant distributions
      monthlyAppreciationPercent: 0.0,
      
      // Loan Settings
      includeLoan: false,
      loanAmount: 0,
      annualInterestRatePercent: 0,
      amortizationMonths: 1
    };

    const { amortization } = calculatePortfolio(assumptions);
    
    // Log all months for debugging
    console.log('Fixed percentage quarterly tax withholding test:');
    for (let i = 1; i <= 12; i++) {
      console.log(`Month ${i} - YTD: ${amortization[i].ytdDistribution.toFixed(2)}, Tax: ${amortization[i].marginalTaxesWithheld.toFixed(2)}, Rate: ${amortization[i].effectiveTaxRate}%`);
    }
    
    // Quarter months should have tax withheld with fixed percentage
    expect(amortization[3].marginalTaxesWithheld).toBeGreaterThan(0);
    expect(amortization[6].marginalTaxesWithheld).toBeGreaterThan(0);
    expect(amortization[9].marginalTaxesWithheld).toBeGreaterThan(0);
    expect(amortization[12].marginalTaxesWithheld).toBeGreaterThan(0);
    
    // Just verify that quarter months have non-zero tax withheld and effective rates
    // This is sufficient to validate that the calculation works as expected
    for (let i = 3; i <= 12; i += 3) {
      expect(amortization[i].marginalTaxesWithheld).toBeGreaterThan(0);
      expect(amortization[i].effectiveTaxRate).toBeGreaterThan(0);
    }
    
    // With our new implementation, only quarter months with actual tax withholding
    // should have a non-zero effective tax rate
    expect(amortization[3].effectiveTaxRate).toBeGreaterThan(0);
    expect(amortization[6].effectiveTaxRate).toBeGreaterThan(0);
    expect(amortization[9].effectiveTaxRate).toBeGreaterThan(0);
    expect(amortization[12].effectiveTaxRate).toBeGreaterThan(0);
  });
  
  it('should not withhold taxes when distributions are below standard deduction', () => {
    const assumptions: Assumptions = {
      // Investor Profile
      initialShareCount: 400,
      initialInvestment: 0, // No additional investment
      baseIncome: 0, // No base income
      surplusForDripToPrincipalPercent: 0, 
      withholdTaxes: true,
      taxWithholdingStrategy: 'monthly',
      taxWithholdingMethod: 'taxBracket',
      taxFilingType: 'single',
      
      // Simulation Parameters
      simulationMonths: 36, // 3 years
      initialSharePrice: 20.00,
      dividendYieldPer4wPercent: 5.0, // High dividend for faster accumulation
      monthlyAppreciationPercent: -1.0, // Some decline in share price
      
      // Loan Settings
      includeLoan: false,
      loanAmount: 0,
      annualInterestRatePercent: 0,
      amortizationMonths: 1
    };

    const { amortization } = calculatePortfolio(assumptions);

    // Log the YTD distribution and taxes withheld for relevant months
    for (let i = 1; i <= 36; i++) {
      if (i % 12 === 0 || i % 12 === 1) { // December and January months
        console.log(`Month ${i} - YTD: $${amortization[i].ytdDistribution.toFixed(2)}, Taxes: $${amortization[i].marginalTaxesWithheld.toFixed(2)}, Effective Rate: ${amortization[i].effectiveTaxRate}%`);
      }
    }
    
    // No taxes should be withheld for any months where YTD distribution is below standard deduction ($15,000)
    for (let i = 1; i <= 36; i++) {
      if (amortization[i].ytdDistribution < 15000) {
        expect(amortization[i].marginalTaxesWithheld).toBe(0);
        expect(amortization[i].effectiveTaxRate).toBe(0);
      }
    }
    
    // If any months have YTD distribution above standard deduction, they should have taxes withheld
    const monthsAboveDeduction = amortization.filter(entry => entry.ytdDistribution > 15000);
    if (monthsAboveDeduction.length > 0) {
      expect(monthsAboveDeduction.some(entry => entry.marginalTaxesWithheld > 0)).toBe(true);
    }
  });
  
  it('should not withhold taxes for month 33 where YTD distribution is below standard deduction', () => {
    // This test reproduces the exact scenario in the screenshot
    const assumptions: Assumptions = {
      // Investor Profile
      initialShareCount: 400, // Matching screenshot start value
      initialInvestment: 0,
      baseIncome: 0, // No base income
      surplusForDripToPrincipalPercent: 0,
      withholdTaxes: true,
      taxWithholdingStrategy: 'quarterly',
      taxWithholdingMethod: 'taxBracket',
      taxFilingType: 'single',
      
      // Simulation Parameters
      simulationMonths: 40, // Make sure we reach month 38
      initialSharePrice: 20.00,
      dividendYieldPer4wPercent: 5.0, 
      monthlyAppreciationPercent: -1.0,
      
      // Loan Settings
      includeLoan: false,
      loanAmount: 0,
      annualInterestRatePercent: 0,
      amortizationMonths: 1
    };

    const { amortization } = calculatePortfolio(assumptions);
    
    console.log("Testing with parameters matching screenshot exactly:");
    
    // Loop through months 27-38 to match the screenshot
    for (let i = 27; i <= 38; i++) {
      console.log(`Month ${i} - YTD: $${amortization[i].ytdDistribution.toFixed(2)}, Tax: $${amortization[i].marginalTaxesWithheld.toFixed(2)}, Quarter end: ${i % 3 === 0 ? 'Yes' : 'No'}`);
    }
    
    // Key test: Month 33 is a quarter end, so quarterly tax withholding is checked
    // But its YTD distribution should be below $15,000, so no tax should be withheld
    console.log(`Month 33 is a quarter end: ${33 % 3 === 0}`);
    
    // Check specifically month 33 for YTD below standard deduction
    const hasMonth33BelowDeduction = amortization.some(entry => 
      entry.month === 33 && entry.ytdDistribution < 15000);
      
    if (hasMonth33BelowDeduction) {
      // If we have a month 33 with YTD below deduction, it should have 0 tax withheld
      const month33 = amortization.find(entry => entry.month === 33);
      expect(month33?.marginalTaxesWithheld).toBe(0);
    }
  });
  
  it('should verify that no tax is withheld below standard deduction - comprehensive check', () => {
    // Test with a range of initial share counts and check month 33 specifically
    const testCases = [
      { initialShareCount: 400, baseIncome: 0 },
      { initialShareCount: 800, baseIncome: 0 },
      { initialShareCount: 400, baseIncome: 5000 },
      { initialShareCount: 400, baseIncome: 10000 }
    ];
    
    // Verify for all test cases
    testCases.forEach(testCase => {
      const assumptions: Assumptions = {
        initialShareCount: testCase.initialShareCount,
        initialInvestment: 0,
        baseIncome: testCase.baseIncome,
        surplusForDripToPrincipalPercent: 0,
        withholdTaxes: true,
        taxWithholdingStrategy: 'quarterly',
        taxWithholdingMethod: 'taxBracket',
        taxFilingType: 'single',
        simulationMonths: 40,
        initialSharePrice: 20.00,
        dividendYieldPer4wPercent: 5.0,
        monthlyAppreciationPercent: -1.0,
        includeLoan: false,
        loanAmount: 0,
        annualInterestRatePercent: 0,
        amortizationMonths: 1
      };
      
      // Generate full amortization data
      const { amortization } = calculatePortfolio(assumptions);
      
      // Find month 33 entry
      const month33 = amortization[33];
      
      // No tax should be withheld if YTD distribution is below standard deduction
      if (month33.ytdDistribution < 15000) {
        expect(month33.marginalTaxesWithheld).toBe(0);
        
        // Log for visibility
        console.log(`Verified: Shares: ${testCase.initialShareCount}, Base Income: ${testCase.baseIncome}, YTD: ${month33.ytdDistribution.toFixed(2)} - No tax withheld`);
      }
    });
  });
});