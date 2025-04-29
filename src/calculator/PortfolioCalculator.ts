import { Assumptions } from "../models/Assumptions";
import { CalculatedSummary } from "../models/CalculatedSummary";
import { AmortizationEntry } from "../models/AmortizationEntry";

function calculatePmt(rate: number, nper: number, pv: number): number {
    return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

function lookupTaxRate(baseIncome: number, ytdDistribution: number): number {
    const income = baseIncome + ytdDistribution;
    if (income >= 751601) return 0.37;
    if (income >= 501051) return 0.35;
    if (income >= 394601) return 0.32;
    if (income >= 206701) return 0.24;
    if (income >= 96951) return 0.22;
    if (income >= 23851) return 0.12;
    return 0.10;
}

export function calculatePortfolio(assumptions: Assumptions): { summary: CalculatedSummary, amortization: AmortizationEntry[] } {
    const {
        initialInvestment,
        initialSharePrice,
        dividendYieldPer4wPercent,
        monthlyAppreciationPercent,
        loanAmount,
        annualInterestRatePercent,
        amortizationMonths,
        baseIncome,
        surplusForDripToPrincipalPercent,
        withholdTaxes
    } = assumptions;

    const initialShareCount = initialInvestment / initialSharePrice;
    const annualizedDividendYieldPercent = 13 * dividendYieldPer4wPercent;
    const monthlyLoanInterestRate = annualInterestRatePercent / 12 / 100;
    const monthlyLoanPayment = calculatePmt(monthlyLoanInterestRate, amortizationMonths, loanAmount);

    const amortization: AmortizationEntry[] = [];

    // --- Month 0: Initial state ---
    amortization.push({
        month: 0,
        shareCount: initialShareCount,
        dividend: 0,
        distribution: 0,
        ytdDistribution: 0,
        marginalTaxesWithheld: 0,
        loanPayment: 0,
        surplusForDrip: 0,
        additionalPrincipal: 0,
        actualDrip: 0,
        sharePrice: initialSharePrice,
        newSharesFromDrip: 0,
        totalShares: initialShareCount,
        portfolioValue: initialShareCount * initialSharePrice,
        loanPrincipal: loanAmount,
        netPortfolioValue: (initialShareCount * initialSharePrice) - loanAmount
    });

    // --- Months 1..amortizationMonths ---
    for (let month = 1; month <= amortizationMonths; month++) {
        const prev = amortization[month - 1];

        const updatedSharePrice = prev.sharePrice * (1 + (monthlyAppreciationPercent / 100));

        const dividendMultiplier = (month % 12 === 0) ? 2 : 1;
        const dividend = dividendMultiplier * (dividendYieldPer4wPercent / 100) * updatedSharePrice;

        const distribution = prev.totalShares * dividend;

        const newYtdDistribution = (month % 12 === 1) ? distribution : (prev.ytdDistribution + distribution);

        const marginalTaxRate = lookupTaxRate(baseIncome, newYtdDistribution);
        const marginalTaxesWithheld = withholdTaxes ? distribution * marginalTaxRate : 0;

        // Determine if loan is paid off
        const loanIsActive = prev.loanPrincipal > 0;
        
        // Only apply loan payments if loan is still active
        const loanPayment = loanIsActive ? monthlyLoanPayment : 0;
        const surplusForDrip = distribution - (marginalTaxesWithheld + loanPayment);
        
        // Only apply additional principal if loan is still active
        const additionalPrincipal = loanIsActive 
            ? Math.min(surplusForDrip * (surplusForDripToPrincipalPercent / 100), prev.loanPrincipal) 
            : 0;

        const actualDrip = surplusForDrip - additionalPrincipal;

        const newSharesFromDrip = (actualDrip > 0 && updatedSharePrice > 0) ? actualDrip / updatedSharePrice : 0;
        const totalShares = prev.totalShares + newSharesFromDrip;

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

        amortization.push({
            month,
            shareCount: prev.totalShares,
            dividend,
            distribution,
            ytdDistribution: newYtdDistribution,
            marginalTaxesWithheld,
            loanPayment,
            surplusForDrip,
            additionalPrincipal,
            actualDrip,
            sharePrice: updatedSharePrice,
            newSharesFromDrip,
            totalShares,
            portfolioValue,
            loanPrincipal: updatedLoanPrincipal,
            netPortfolioValue
        });
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