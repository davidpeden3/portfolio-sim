import {
  Assumptions,
  FilingType,
  VariableDistribution
} from "../models/Assumptions";
import { CalculatedSummary } from "../models/CalculatedSummary";
import { AmortizationEntry } from "../models/AmortizationEntry";
import {
  materializeContributions,
  groupContributionsByMonth,
  getMonthContribution
} from "./ContributionCalculator";

/**
 * Calculates the next share price based on linear change model
 * @param prevPrice The previous share price
 * @param linearChangeAmount The flat dollar amount to change per month
 * @returns The new share price after applying linear change
 */
function calculateLinearSharePrice(prevPrice: number, linearChangeAmount: number): number {
  // Ensure the price never goes below zero
  return Math.max(0, prevPrice + linearChangeAmount);
}

/**
 * Calculates the next share price based on geometric change model (percentage change)
 * @param prevPrice The previous share price
 * @param monthlyAppreciationPercent The percentage to change per month
 * @returns The new share price after applying geometric (percentage) change
 */
function calculateGeometricSharePrice(prevPrice: number, monthlyAppreciationPercent: number): number {
  return prevPrice * (1 + (monthlyAppreciationPercent / 100));
}

/**
 * Generates a random number from a uniform distribution
 * @param min The minimum value of the distribution
 * @param max The maximum value of the distribution
 * @returns A random number between min and max
 */
function getUniformRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random number from a normal distribution using the Box-Muller transform
 * @param mean The mean value of the normal distribution
 * @param stdDev The standard deviation of the normal distribution
 * @returns A random number from a normal distribution
 */
function getNormalRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
}

/**
 * Calculates the next share price based on a uniform distribution
 * @param prevPrice The previous share price
 * @param uniformMin The minimum percentage change
 * @param uniformMax The maximum percentage change
 * @returns The new share price after applying uniform random change
 */
function calculateUniformSharePrice(prevPrice: number, uniformMin: number, uniformMax: number): number {
  const percentChange = getUniformRandom(uniformMin, uniformMax);
  return prevPrice * (1 + (percentChange / 100));
}

/**
 * Calculates the next share price based on a normal distribution
 * @param prevPrice The previous share price
 * @param normalMean The mean percentage change
 * @param normalStdDev The standard deviation of percentage change
 * @returns The new share price after applying normal random change
 */
function calculateNormalSharePrice(prevPrice: number, normalMean: number, normalStdDev: number): number {
  const percentChange = getNormalRandom(normalMean, normalStdDev);
  return prevPrice * (1 + (percentChange / 100));
}

/**
 * Calculates the next share price based on Geometric Brownian Motion
 * @param prevPrice The previous share price
 * @param drift The drift parameter (annualized percentage)
 * @param volatility The volatility parameter (annualized percentage)
 * @returns The new share price after applying GBM
 */
function calculateGBMSharePrice(prevPrice: number, drift: number, volatility: number): number {
  // Convert annual rates to monthly
  const monthlyDrift = drift / 12 / 100;
  const monthlyVolatility = volatility / Math.sqrt(12) / 100;

  // GBM formula: S(t+Δt) = S(t) * exp((μ - σ²/2)Δt + σW√Δt)
  // Where W is a random sample from standard normal distribution
  // For monthly calculation, Δt = 1/12
  const deltaT = 1/12;
  const meanTerm = (monthlyDrift - (Math.pow(monthlyVolatility, 2) / 2)) * deltaT;
  const randomTerm = monthlyVolatility * getNormalRandom(0, 1) * Math.sqrt(deltaT);

  return prevPrice * Math.exp(meanTerm + randomTerm);
}

/**
 * Calculates the next share price based on variable model
 * @param prevPrice The previous share price
 * @param distribution The type of distribution to use
 * @param params Parameters specific to the distribution
 * @returns The new share price based on the specified distribution
 */
function calculateVariableSharePrice(
  prevPrice: number,
  distribution: VariableDistribution,
  params: {
    uniformMin?: number;
    uniformMax?: number;
    normalMean?: number;
    normalStdDev?: number;
    gbmDrift?: number;
    gbmVolatility?: number;
    actualPrices?: { month: number; price: number }[];
    currentMonth?: number;
  }
): number {
  switch (distribution) {
    case 'uniform':
      if (params.uniformMin !== undefined && params.uniformMax !== undefined) {
        return calculateUniformSharePrice(prevPrice, params.uniformMin, params.uniformMax);
      }
      break;

    case 'normal':
      if (params.normalMean !== undefined && params.normalStdDev !== undefined) {
        return calculateNormalSharePrice(prevPrice, params.normalMean, params.normalStdDev);
      }
      break;

    case 'gbm':
      if (params.gbmDrift !== undefined && params.gbmVolatility !== undefined) {
        return calculateGBMSharePrice(prevPrice, params.gbmDrift, params.gbmVolatility);
      }
      break;

    case 'actual':
      if (params.actualPrices && params.currentMonth !== undefined) {
        // Find the actual price for this month, or use the previous price if not found
        const priceEntry = params.actualPrices.find(p => p.month === params.currentMonth);
        if (priceEntry) {
          return priceEntry.price;
        }
      }
      break;
  }

  // Fallback to no change if invalid parameters or 'actual' with missing data
  return prevPrice;
}

/**
 * Main function to calculate the next share price based on the selected model
 * @param prevPrice The previous share price
 * @param assumptions The simulation assumptions containing model parameters
 * @param month The current month in the simulation
 * @returns The new share price based on the selected model
 */
function calculateNextSharePrice(prevPrice: number, assumptions: Assumptions, month: number): number {
  const {
    sharePriceModel = 'geometric', // Default to geometric for backward compatibility
    monthlyAppreciationPercent = 0, // Default to 0% if not specified
    linearChangeAmount = 0, // Default to $0 if not specified
    variableDistribution = 'uniform',
    uniformMin = -1,
    uniformMax = 1,
    normalMean = 0.5,
    normalStdDev = 1,
    gbmDrift = 0.5,
    gbmVolatility = 2,
    actualPrices = []
  } = assumptions;

  switch (sharePriceModel) {
    case 'linear':
      return calculateLinearSharePrice(prevPrice, linearChangeAmount);

    case 'variable':
      return calculateVariableSharePrice(
        prevPrice,
        variableDistribution,
        {
          uniformMin,
          uniformMax,
          normalMean,
          normalStdDev,
          gbmDrift,
          gbmVolatility,
          actualPrices,
          currentMonth: month
        }
      );

    case 'geometric':
    default:
      // Default to geometric model for backward compatibility
      return calculateGeometricSharePrice(prevPrice, monthlyAppreciationPercent);
  }
}

function calculatePmt(rate: number, nper: number, pv: number): number {
    // Handle 0% interest rate - just divide principal by number of periods
    if (rate === 0 || rate < 0.0000001) {
        return pv / nper;
    }
    // Standard payment calculation for non-zero interest rates
    return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

/**
 * Calculates the total tax owed based on taxable income using proper marginal tax brackets.
 * This implements the correct progressive tax calculation where each portion of income
 * is taxed at its corresponding bracket rate.
 * 
 * @param taxableIncome The taxable income after standard deduction
 * @param filingType The tax filing status (single, married, headOfHousehold)
 * @returns The total tax amount
 */
export function calculateTax(taxableIncome: number, filingType: FilingType = 'single'): number {
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

export function calculatePortfolio(assumptions: Assumptions): { summary: CalculatedSummary, amortization: AmortizationEntry[] } {
    const {
        // Investor Profile
        initialShareCount: preexistingShares,
        initialInvestment,
        baseIncome,
        surplusForDripToPrincipalPercent,
        withholdTaxes,
        
        // New Tax Settings
        taxWithholdingStrategy = 'monthly', // Default to monthly for backward compatibility
        taxWithholdingMethod = 'taxBracket', // Default to tax bracket for backward compatibility
        taxFilingType = 'single', // Default to single filing status for backward compatibility
        taxFixedAmount = 0,
        taxFixedPercent = 0,
        
        // DRIP Settings
        dripStrategy = 'percentage', // Default to percentage for backward compatibility
        dripPercentage = 100, // Default to reinvest 100% for backward compatibility
        dripFixedAmount = 0,
        fixedIncomeAmount = 0, // Monthly income amount for fixedIncome strategy
        
        // Supplemental Contributions
        supplementalContributions,
        
        // Simulation Parameters
        simulationMonths,
        startMonth = 1, // Default to January if not set
        initialSharePrice,
        dividendYieldPer4wPercent,
        
        // Loan Settings
        includeLoan,
        loanAmount: rawLoanAmount,
        annualInterestRatePercent,
        amortizationMonths
    } = assumptions;
    
    // If loan is not included, use 0 as effective loan amount
    const loanAmount = includeLoan ? rawLoanAmount : 0;

    // Calculate shares from investment and add any pre-existing shares
    const sharesFromInvestment = initialInvestment / initialSharePrice;
    const initialShareCount = sharesFromInvestment + preexistingShares;
    const annualizedDividendYieldPercent = 13 * dividendYieldPer4wPercent;
    const monthlyLoanInterestRate = annualInterestRatePercent / 12 / 100;
    const monthlyLoanPayment = calculatePmt(monthlyLoanInterestRate, amortizationMonths, loanAmount);

    // Process supplemental contributions
    // Ensure supplementalContributions is an array for backwards compatibility
    const contributionsToProcess = supplementalContributions || [];
    
    // Process and group contributions
    const materializedContributions = materializeContributions(
        contributionsToProcess,
        simulationMonths,
        startMonth
    );
    
    // Group contributions by month
    const monthlyContributions = groupContributionsByMonth(materializedContributions);

    const amortization: AmortizationEntry[] = [];

    // --- Month 0: Initial state ---
    amortization.push({
        month: 0,
        shareCount: initialShareCount,
        dividend: 0,
        distribution: 0,
        ytdDistribution: 0,
        marginalTaxesWithheld: 0,
        effectiveTaxRate: withholdTaxes ? 0 : undefined, // Only add effective tax rate if taxes are withheld
        loanPayment: 0,
        surplusForDrip: 0,
        additionalPrincipal: 0,
        income: 0,
        supplementalContribution: 0,
        actualDrip: 0,
        sharePrice: initialSharePrice,
        newSharesFromDrip: 0,
        newSharesFromContribution: 0, // Add this field for month 0
        totalShares: initialShareCount,
        portfolioValue: initialShareCount * initialSharePrice,
        loanPrincipal: loanAmount,
        netPortfolioValue: (initialShareCount * initialSharePrice) - loanAmount
    });

    // --- Months 1..simulationMonths ---
    for (let month = 1; month <= simulationMonths; month++) {
        const prev = amortization[month - 1];

        // Calculate calendar month (1-12) for current simulation month
        const calendarMonth = ((startMonth - 1 + month - 1) % 12) + 1;

        // Pass the current month and get the updated share price using our model
        const updatedSharePrice = calculateNextSharePrice(prev.sharePrice, {
            ...assumptions,
            // Pass along any needed properties that might not be in the original assumptions object
            // This ensures we have all parameters needed for price calculation
        }, month);

        // December (month 12) typically has double dividends
        const dividendMultiplier = (calendarMonth === 12) ? 2 : 1;
        const dividend = dividendMultiplier * (dividendYieldPer4wPercent / 100) * updatedSharePrice;

        const distribution = prev.totalShares * dividend;

        // Reset YTD distribution in January (month 1)
        const newYtdDistribution = (calendarMonth === 1) ? distribution : (prev.ytdDistribution + distribution);

        // Determine if this is a tax withholding month based on the withholding strategy
        // For quarterly, use calendar months: March (3), June (6), September (9), December (12)
        const isWithholdingMonth = 
            withholdTaxes && (
                taxWithholdingStrategy === 'monthly' || 
                (taxWithholdingStrategy === 'quarterly' && (calendarMonth === 3 || calendarMonth === 6 || calendarMonth === 9 || calendarMonth === 12))
            );
        
        // Calculate tax amount based on the withholding method
        let marginalTaxesWithheld = 0;
        
        if (isWithholdingMonth) {
            // Determine accumulated distribution for tax calculation
            let taxableDistribution = distribution;
            
            // For quarterly, include previous months in the quarter
            if (taxWithholdingStrategy === 'quarterly') {
                let quarterlyTotal = distribution;
                
                // Add previous 2 months for quarterly calculation
                // (potentially wrapping around to the previous year)
                if (month > 1) quarterlyTotal += amortization[month-2].distribution;
                if (month > 2) quarterlyTotal += amortization[month-3].distribution;
                
                taxableDistribution = quarterlyTotal;
            }
                
            if (taxWithholdingMethod === 'taxBracket') {
                // For tax bracket method, we need to:
                // 1. Calculate total income (base + YTD distributions)
                // 2. Calculate total tax owed on that
                // 3. Calculate what portion applies to this distribution
                
                // Standard deduction
                const standardDeduction = taxFilingType === 'married' ? 30000 : 
                                           taxFilingType === 'headOfHousehold' ? 22500 : 15000;
                
                if (taxWithholdingStrategy === 'monthly') {
                    // For monthly withholding, use the same calculation as before
                    // Calculate with and without this distribution to get the marginal tax
                    const totalIncome = baseIncome + newYtdDistribution;
                    
                    // If total income is below standard deduction, no tax is due
                    if (totalIncome <= standardDeduction) {
                        marginalTaxesWithheld = 0;
                    } else {
                        const taxableIncome = Math.max(0, totalIncome - standardDeduction);
                        const totalTax = calculateTax(taxableIncome, taxFilingType);
                        
                        // Calculate tax without this distribution
                        const prevDistribution = newYtdDistribution - taxableDistribution;
                        const prevTotalIncome = baseIncome + prevDistribution;
                        const prevTaxableIncome = Math.max(0, prevTotalIncome - standardDeduction);
                        const prevTotalTax = calculateTax(prevTaxableIncome, taxFilingType);
                        
                        // The most accurate and straightforward way to calculate the tax
                        // on just the distribution is to take the difference between
                        // total tax with and without the distribution
                        marginalTaxesWithheld = totalTax - prevTotalTax;
                    }
                } else if (taxWithholdingStrategy === 'quarterly') {
                    // For quarterly withholding, calculate the effective tax rate for the quarter
                    
                    // First, identify the quarterly distributions
                    
                    // Use the YTD distribution from the amortization entry for consistency
                    // This is what's displayed to the user and should match our tax withholding check
                    const yearToDateDistribution = newYtdDistribution;
                    
                    // Calculate total income and tax on year-to-date basis
                    const ytdTotalIncome = baseIncome + yearToDateDistribution;
                    
                    // We never withhold taxes if the YTD distributions are below the standard deduction.
                    // This ensures we don't tax distributions that would be covered by the standard deduction.
                    if (ytdTotalIncome <= standardDeduction) {
                        marginalTaxesWithheld = 0;
                    } 
                    // Never withhold taxes if just the YTD distribution (not including base income)
                    // is below the standard deduction - this ensures we don't tax small distributions
                    // with base income that's close to the standard deduction.
                    else if (yearToDateDistribution < standardDeduction) {
                        marginalTaxesWithheld = 0;
                    } else {
                        const ytdTaxableIncome = Math.max(0, ytdTotalIncome - standardDeduction);
                        const ytdTotalTax = calculateTax(ytdTaxableIncome, taxFilingType);
                        
                        // Calculate total income and tax without this quarter's distribution
                        const ytdWithoutQuarterDistribution = yearToDateDistribution - taxableDistribution;
                        const ytdWithoutQuarterIncome = baseIncome + ytdWithoutQuarterDistribution;
                        
                        // Special handling for the edge case where previous income is below standard deduction
                        // In this case, we only want to tax the portion of the current distribution
                        // that exceeds the standard deduction
                        if (ytdWithoutQuarterIncome <= standardDeduction) {
                            // Only tax the amount above the standard deduction
                            const taxableAmount = ytdTotalIncome - standardDeduction;
                            marginalTaxesWithheld = calculateTax(taxableAmount, taxFilingType);
                        } else {
                            const ytdWithoutQuarterTaxableIncome = Math.max(0, ytdWithoutQuarterIncome - standardDeduction);
                            const ytdWithoutQuarterTotalTax = calculateTax(ytdWithoutQuarterTaxableIncome, taxFilingType);
                            
                            // Tax on this quarter's distribution is the difference
                            marginalTaxesWithheld = ytdTotalTax - ytdWithoutQuarterTotalTax;
                        }
                    }
                }
            } else if (taxWithholdingMethod === 'fixedAmount') {
                marginalTaxesWithheld = taxFixedAmount;
            } else if (taxWithholdingMethod === 'fixedPercent') {
                marginalTaxesWithheld = taxableDistribution * (taxFixedPercent / 100);
            }
        }

        // Determine if loan is paid off
        const loanIsActive = prev.loanPrincipal > 0;
        
        // Only apply loan payments if loan is still active
        const loanPayment = loanIsActive ? monthlyLoanPayment : 0;
        const surplusForDrip = distribution - (marginalTaxesWithheld + loanPayment);
        
        // Only apply additional principal if loan is still active
        const additionalPrincipal = loanIsActive 
            ? Math.min(surplusForDrip * (surplusForDripToPrincipalPercent / 100), prev.loanPrincipal) 
            : 0;

        // Calculate income and actualDrip based on dripStrategy
        let actualDrip = 0;
        let income = 0;
        
        const availableForDrip = surplusForDrip - additionalPrincipal;
        
        if (dripStrategy === 'none') {
            // No DRIP - all surplus after principal payment goes as income, not reinvested
            income = availableForDrip;
            actualDrip = 0;
        } else if (dripStrategy === 'percentage') {
            // Percentage-based DRIP - reinvest a percentage of the surplus after principal payment
            actualDrip = availableForDrip * (dripPercentage / 100);
            income = availableForDrip - actualDrip;
        } else if (dripStrategy === 'fixedAmount') {
            // Fixed amount DRIP - reinvest a fixed dollar amount if available
            actualDrip = Math.min(dripFixedAmount, availableForDrip);
            income = availableForDrip - actualDrip;
        } else if (dripStrategy === 'fixedIncome') {
            // Fixed income amount - take fixed income first, then DRIP the remainder
            // If we have enough for the fixed income amount, DRIP the remainder
            if (availableForDrip >= fixedIncomeAmount) {
                income = fixedIncomeAmount;
                actualDrip = availableForDrip - fixedIncomeAmount;
            } else {
                // If we don't have enough for the fixed income, take what's available
                income = availableForDrip;
                actualDrip = 0;
            }
        } else {
            // Default to historical behavior
            actualDrip = availableForDrip;
            income = 0;
        }

        // Get the supplemental contribution for this month
        const supplementalContribution = getMonthContribution(monthlyContributions, month, startMonth);
        
        // Calculate new shares from DRIP and supplemental contributions
        const newSharesFromDrip = (actualDrip > 0 && updatedSharePrice > 0) ? actualDrip / updatedSharePrice : 0;
        const newSharesFromContribution = (supplementalContribution > 0 && updatedSharePrice > 0) 
            ? supplementalContribution / updatedSharePrice 
            : 0;
        
        const totalShares = prev.totalShares + newSharesFromDrip + newSharesFromContribution;

        const portfolioValue = totalShares * updatedSharePrice;

        // Calculate updated loan principal only if the loan is still active
        const updatedLoanPrincipal = loanIsActive
            ? Math.round(
                Math.max(
                    (prev.loanPrincipal * (1 + monthlyLoanInterestRate)) - loanPayment - additionalPrincipal,
                    0
                ) * 100
              ) / 100
            : 0;

        const netPortfolioValue = portfolioValue - updatedLoanPrincipal;

        // Calculate cumulative tax data for effective rate (only when tax withholding is enabled)
        let effectiveTaxRate;
        if (withholdTaxes) {
            // The effective tax rate should represent total taxes withheld divided by total distributions
            // for the year to date, regardless of withholding strategy
            
            // Determine if this is the first month of a year (January)
            const isFirstMonthOfYear = calendarMonth === 1;
            
            // Calculate the index of January for the current year in the simulation
            const yearStartMonthIndex = Math.max(1, month - (calendarMonth - 1));
            
            // For quarterly withholding, we need to track YTD tax impact, not just what's been withheld
            let yearTotalTaxes = 0;
            let yearTotalDistributions = 0;
            
            // Special handling for first month of the year
            if (isFirstMonthOfYear) {
                yearTotalTaxes = marginalTaxesWithheld;
                yearTotalDistributions = distribution;
            } else {
                // For all other months, calculate using all data from the start of the year
                // Add all distributions and taxes from the start of the year up to and including the current month
                for (let i = yearStartMonthIndex - 1; i < month; i++) {
                    if (i >= 0) { // Ensure we don't go out of bounds
                        yearTotalTaxes += amortization[i].marginalTaxesWithheld;
                        yearTotalDistributions += amortization[i].distribution;
                    }
                }
                
                // Add current month
                yearTotalTaxes += marginalTaxesWithheld;
                yearTotalDistributions += distribution;
            }
            
            // If no taxes are being withheld this month, the effective tax rate should be 0
        // This fixes cases like month 38 where taxes withheld is 0 but effective rate shows non-zero
        if (marginalTaxesWithheld === 0) {
            effectiveTaxRate = 0;
        }
        // If no taxes have been withheld at all in this year, effective rate is always 0
        else if (yearTotalTaxes === 0) {
            effectiveTaxRate = 0;
        }
        // For quarterly withholding, the effective tax rate needs special handling
        else if (taxWithholdingStrategy === 'quarterly') {
            // If this is a withholding month and taxes are being withheld, show the effective rate
            // based on the entire quarter's distributions and taxes
            if (isWithholdingMonth && marginalTaxesWithheld > 0) {
                // Calculate the distributions for this quarter only based on calendar months
                
                // Determine how many months in the current quarter we have data for
                let monthsInQuarter = (calendarMonth - 1) % 3 + 1; // 1, 2, or 3
                monthsInQuarter = Math.min(monthsInQuarter, month);
                
                // Sum distributions for this quarter only
                let quarterDistribution = distribution;
                for (let i = 1; i < monthsInQuarter; i++) {
                    if (month > i) {
                        quarterDistribution += amortization[month - 1 - i].distribution;
                    }
                }
                
                // Calculate the effective tax rate based on just this quarter's distributions and taxes
                effectiveTaxRate = quarterDistribution > 0 
                    ? Math.round((marginalTaxesWithheld / quarterDistribution) * 10000) / 100 
                    : 0;
            } else {
                // For non-withholding months or months with no taxes withheld, show 0%
                effectiveTaxRate = 0;
            }
        } else {
            // For monthly withholding, only show a rate if taxes are being withheld this month
            if (marginalTaxesWithheld > 0) {
                effectiveTaxRate = yearTotalDistributions > 0 
                    ? Math.round((yearTotalTaxes / yearTotalDistributions) * 10000) / 100 
                    : 0;
            } else {
                effectiveTaxRate = 0;
            }
        }
        }

        // Calculate the impact of supplemental contribution on shares and share count for display
        // The share count should include all shares from previous month (base shares + DRIP + contributions)
        const entry = {
            month,
            shareCount: prev.totalShares, // This properly includes all shares from previous month
            dividend,
            distribution,
            ytdDistribution: newYtdDistribution,
            marginalTaxesWithheld,
            effectiveTaxRate,
            loanPayment,
            surplusForDrip,
            additionalPrincipal,
            income,
            supplementalContribution,
            actualDrip,
            sharePrice: updatedSharePrice,
            newSharesFromDrip, // Shares from DRIP 
            newSharesFromContribution, // Add this field to track contribution shares separately
            totalShares, // Updated total including new DRIP shares and contribution shares
            portfolioValue,
            loanPrincipal: updatedLoanPrincipal,
            netPortfolioValue
        };
        
        amortization.push(entry);
    }

    const loanPayoffEntry = amortization.find(entry => entry.loanPrincipal <= 0);
    const loanPayoffMonth = loanPayoffEntry ? loanPayoffEntry.month : amortizationMonths;
    
    // Extract yearly portfolio values
    const yearlyPortfolioValues = amortization
        .filter(entry => entry.month > 0 && entry.month % 12 === 0)
        .map(entry => ({ 
            month: entry.month, 
            value: entry.netPortfolioValue
        }));

    const summary: CalculatedSummary = {
        initialShareCount,
        annualizedDividendYieldPercent,
        monthlyLoanPayment,
        loanPayoffMonth,
        yearlyPortfolioValues
    };

    return { summary, amortization };
}

