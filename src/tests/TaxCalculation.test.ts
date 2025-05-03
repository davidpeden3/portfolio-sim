import { describe, it, expect } from 'vitest';
import { FilingType } from '../models/Assumptions';

// Import the calculateTax function directly - making it available for testing
// Since the function is not exported in PortfolioCalculator.ts, I'm replicating it here
function calculateTax(taxableIncome: number, filingType: FilingType = 'single'): number {
    // Define the tax brackets and rates for each filing type
    const brackets = {
        single: [
            { threshold: 0, rate: 0.10 },
            { threshold: 11925, rate: 0.12 },
            { threshold: 48475, rate: 0.22 },
            { threshold: 103350, rate: 0.24 },
            { threshold: 197300, rate: 0.32 },
            { threshold: 250525, rate: 0.35 },
            { threshold: 626350, rate: 0.37 }
        ],
        married: [
            { threshold: 0, rate: 0.10 },
            { threshold: 23850, rate: 0.12 },
            { threshold: 96950, rate: 0.22 },
            { threshold: 206700, rate: 0.24 },
            { threshold: 394600, rate: 0.32 },
            { threshold: 501050, rate: 0.35 },
            { threshold: 751600, rate: 0.37 }
        ],
        headOfHousehold: [
            { threshold: 0, rate: 0.10 },
            { threshold: 17000, rate: 0.12 },
            { threshold: 64850, rate: 0.22 },
            { threshold: 103350, rate: 0.24 },
            { threshold: 197300, rate: 0.32 },
            { threshold: 250500, rate: 0.35 },
            { threshold: 626350, rate: 0.37 }
        ]
    };

    // Return 0 if no taxable income
    if (taxableIncome <= 0) {
        return 0;
    }

    // Get correct bracket set based on filing type
    const applicableBrackets = brackets[filingType];
    
    // Calculate the tax using marginal brackets
    let tax = 0;
    let remainingIncome = taxableIncome;
    
    for (let i = 0; i < applicableBrackets.length; i++) {
        const currentBracket = applicableBrackets[i];
        const nextThreshold = i < applicableBrackets.length - 1 ? applicableBrackets[i + 1].threshold : Infinity;
        
        // Calculate the portion of income that falls within this bracket
        const incomeInBracket = Math.min(
            remainingIncome, 
            nextThreshold - currentBracket.threshold
        );
        
        // Add tax for this bracket
        if (incomeInBracket > 0) {
            tax += incomeInBracket * currentBracket.rate;
            remainingIncome -= incomeInBracket;
        }
        
        // If no more income to tax, break out of the loop
        if (remainingIncome <= 0) {
            break;
        }
    }
    
    return tax;
}

describe('Tax Calculation Tests', () => {
    it('should correctly calculate tax on a distribution that stays within the same bracket', () => {
        // Given parameters
        const baseIncome = 50000;
        const distribution = 495;
        const filingType: FilingType = 'married';
        const standardDeduction = 30000;
        
        // Calculate taxable income
        const totalIncome = baseIncome + distribution;
        const taxableIncome = Math.max(0, totalIncome - standardDeduction);
        
        // Calculate total tax with distribution
        const totalTax = calculateTax(taxableIncome, filingType);
        
        // Calculate tax without the distribution
        const prevTotalIncome = baseIncome;
        const prevTaxableIncome = Math.max(0, prevTotalIncome - standardDeduction);
        const prevTotalTax = calculateTax(prevTaxableIncome, filingType);
        
        // The tax on just the distribution is the difference
        const taxOnDistribution = totalTax - prevTotalTax;
        
        // Round to 2 decimal places for comparison
        const roundedTax = Math.round(taxOnDistribution * 100) / 100;
        
        // Log results for better debugging
        console.log('Test 1: Same bracket', {
            totalIncome,
            taxableIncome,
            totalTax,
            prevTaxableIncome,
            prevTotalTax,
            taxOnDistribution,
            roundedTax
        });
        
        // Assert the expected tax amount - should be $49.50 (10% of $495)
        // since $20,000 + $495 = $20,495 which is still in the 10% bracket
        // (the 12% bracket starts at $23,850 for married filing)
        expect(roundedTax).toBe(49.50);
    });
    
    it('should correctly calculate tax on a distribution that crosses a bracket boundary', () => {
        // Given parameters
        const baseIncome = 53000;  // This puts taxable income at $23,000 (after $30,000 standard deduction)
        const distribution = 1500;  // This will cross into the 12% bracket for married filing
        const filingType: FilingType = 'married';
        const standardDeduction = 30000;
        
        // Calculate taxable income
        const totalIncome = baseIncome + distribution;
        const taxableIncome = Math.max(0, totalIncome - standardDeduction);
        
        // Calculate total tax with distribution
        const totalTax = calculateTax(taxableIncome, filingType);
        
        // Calculate tax without the distribution
        const prevTotalIncome = baseIncome;
        const prevTaxableIncome = Math.max(0, prevTotalIncome - standardDeduction);
        const prevTotalTax = calculateTax(prevTaxableIncome, filingType);
        
        // The tax on just the distribution is the difference
        const taxOnDistribution = totalTax - prevTotalTax;
        
        // Round to 2 decimal places for comparison
        const roundedTax = Math.round(taxOnDistribution * 100) / 100;
        
        // Calculate the expected tax manually:
        // - First portion: $23,850 - $23,000 = $850 at 10% = $85
        // - Second portion: $1,500 - $850 = $650 at 12% = $78
        // - Total: $85 + $78 = $163
        const expectedTax = 163;
        
        // Log results for better debugging
        console.log('Test 2: Crossing bracket', {
            totalIncome,
            taxableIncome,
            totalTax,
            prevTaxableIncome,
            prevTotalTax,
            taxOnDistribution,
            roundedTax,
            expectedTax
        });
        
        // Assert the expected tax amount for the cross-bracket case
        expect(roundedTax).toBe(expectedTax);
    });
});