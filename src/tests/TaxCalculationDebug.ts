/**
 * Debug script for tax calculation issue
 * 
 * This script tests a specific scenario:
 * - baseIncome = 50000
 * - distribution = 495
 * - standardDeduction (married) = 30000
 * 
 * Expected:
 * - Taxable income without distribution: $20,000 (10% bracket)
 * - Taxable income with distribution: $20,495 (crosses into 12% bracket)
 * - Tax on distribution should be at 12% rate
 */

import { calculateTax } from '../calculator/PortfolioCalculator';

// Test parameters
const baseIncome = 50000;
const distribution = 495;
const standardDeduction = 30000;
const filingType = 'married' as const;

// Calculate taxable income without distribution
const taxableIncomeWithoutDistribution = Math.max(0, baseIncome - standardDeduction);
console.log('Taxable income without distribution:', taxableIncomeWithoutDistribution);

// Calculate tax without distribution
const taxWithoutDistribution = calculateTax(taxableIncomeWithoutDistribution, filingType);
console.log('Tax without distribution:', taxWithoutDistribution);

// Calculate taxable income with distribution
const taxableIncomeWithDistribution = Math.max(0, baseIncome + distribution - standardDeduction);
console.log('Taxable income with distribution:', taxableIncomeWithDistribution);

// Calculate tax with distribution
const taxWithDistribution = calculateTax(taxableIncomeWithDistribution, filingType);
console.log('Tax with distribution:', taxWithDistribution);

// Calculate tax on just the distribution
const taxOnDistribution = taxWithDistribution - taxWithoutDistribution;
console.log('Tax on distribution:', taxOnDistribution);
console.log('Tax rate on distribution:', (taxOnDistribution / distribution * 100).toFixed(2) + '%');

// Display the expected tax for comparison
const expectedTaxOnDistribution = 0.12 * distribution;
console.log('Expected tax (12% of distribution):', expectedTaxOnDistribution);

// Check issue in the calculator function
console.log('\nIssue analysis:');
console.log('10% bracket upper limit for married:', 23850);
console.log('Income already takes up:', taxableIncomeWithoutDistribution);
console.log('Space left in 10% bracket:', 23850 - taxableIncomeWithoutDistribution);
console.log('Distribution amount:', distribution);
console.log('Amount of distribution in 10% bracket:', Math.min(23850 - taxableIncomeWithoutDistribution, distribution));
console.log('Amount of distribution in 12% bracket:', Math.max(0, taxableIncomeWithDistribution - 23850));