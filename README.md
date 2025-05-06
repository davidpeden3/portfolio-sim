# \$MSTY Portfolio Simulator

**🚀 Try it now: [https://portfolio.bassheadsoftware.com/](https://portfolio.bassheadsoftware.com/)**

## Overview

The \$MSTY Portfolio Simulator helps you model the long-term growth of a portfolio invested in \$MSTY, accounting for regular dividend payments, dividend reinvestment (DRIP), taxes, loan financing scenarios, and supplemental contributions like dollar-cost averaging (DCA) and recurring salary investments. This tool is perfect for visualizing how your investment might grow over time, especially when leveraging loans to increase your initial position.

## What This Tool Can Help You With

- Calculate potential returns from \$MSTY investments over time
- Model how loans can be used to enhance your initial position
- Visualize the effect of dividend reinvestment (DRIP)
- Account for taxes on dividend income
- See when a loan would be paid off and how your net portfolio value grows
- Model supplemental contributions like dollar-cost averaging and salary investments
- Compare different DRIP strategies (percentage-based or fixed amount)
- Understand how different parameters affect your investment outcomes

## Inputs Explained

The simulator allows you to customize various parameters:

### Investment Parameters

- **Initial Share Count**: Number of \$MSTY shares you already own (not purchased with the loan)
- **Initial Investment**: Dollar amount you're investing now (will be used to purchase shares at the Initial Share Price)
- **Initial Share Price**: Current price per share of \$MSTY
- **Dividend Yield per 4w (%)**: The percentage yield for each 4-week dividend period
- **Monthly Appreciation (%)**: Expected monthly share price change (can be negative for a conservative model)
- **Simulation Start Month**: The month of the year to start the simulation (1-12 for Jan-Dec)

### DRIP Strategy

- **DRIP Strategy**: Choose how dividend reinvestment is handled:
  - *Percentage*: Reinvest a percentage of dividends
  - *Fixed Amount*: Reinvest a fixed dollar amount each period
- **DRIP Percentage**: Percentage of dividends to reinvest when using percentage strategy
- **DRIP Fixed Amount**: Dollar amount to reinvest when using fixed amount strategy
- **Fixed Income**: Dollar amount of fixed income to receive regardless of DRIP strategy

### Loan Parameters

- **Loan Amount**: Size of loan used to purchase additional shares
- **Annual Interest Rate (%)**: The loan's annual interest rate
- **Amortization Months**: Total number of months to pay off the loan
- **Surplus for DRIP to Principal (%)**: Percentage of dividend income (after taxes) that goes to paying down loan principal rather than purchasing more shares

### Tax Withholding Parameters

- **Withholding Strategy**: Choose between no withholding, monthly withholding, or quarterly withholding
- **Withholding Method**: Select how tax amounts are calculated:
  - *Tax Bracket Based*: Calculates taxes based on your income tax bracket
  - *Fixed Amount*: Withholds a specific dollar amount each period
  - *Fixed Percentage*: Withholds a fixed percentage of dividend income
- **Tax Filing Type**: Filing status (single, married filing jointly, etc.) for tax bracket calculations
- **Base Income**: Your annual income (used for tax bracket calculations)
- **Fixed Amount**: Dollar amount withheld per period when using the fixed amount method
- **Fixed Percentage**: Percentage of dividends withheld when using the fixed percentage method

### Supplemental Contributions

- **Add Contribution**: Add supplemental contributions to your portfolio over time
- **Types of Contributions**:
  - *Dollar-Cost Averaging (DCA)*: Regular fixed-amount investments at specified intervals
  - *Salary Contribution*: Regular contributions from salary at standard pay periods
  - *One-Time Contribution*: Single lump-sum addition to your portfolio
- **Frequency Options**: Daily, weekly, bi-weekly, semi-monthly, monthly, quarterly, or yearly depending on type
- **Date Range**: Set full simulation period or custom date range for each contribution
- **Toggle Contributions**: Enable/disable individual contributions without deleting them

## How to Use the Simulator

1. **Select a Profile**: Choose from Early Career, Mid-Career, Retirement, or Custom profile
2. **Enter Your Parameters**: Fill out the form with your investment details and assumptions
3. **Add Supplemental Contributions**: Click "Add Contribution" to set up DCA, salary, or one-time contributions
4. **Calculate**: Click the "Calculate" button to run the simulation
5. **View Results**: The results section will display:
   - A summary of key metrics
   - Charts showing portfolio growth over time
   - Detailed tables showing year-by-year and month-by-month data

## Running the Application Locally

To run the simulator on your own computer:

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or higher)
2. Clone this repository:
   ```
   git clone https://github.com/davidpeden3/portfolio-sim.git
   cd portfolio-sim
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

The application will automatically reload if you make changes to the code.

### Your Settings Are Saved

Your inputs are automatically saved to your browser's local storage. This means:
- Your settings will still be there if you close the browser and come back later
- The selected profile (Early Career, Mid-Career, Retirement, or Custom) is preserved
- Your custom profile is saved separately from the built-in profiles
- All supplemental contributions are stored and remembered
- You can try different scenarios without losing your baseline configuration

## Understanding the Results

### Dynamic Display

The results adapt to your settings:
- Loan-related columns are hidden when "Include Loan" is turned off
- Tax-related columns are hidden when "Withhold Taxes" is turned off
- Contribution-related columns are hidden when no supplemental contributions are enabled

### Summary Tab

The summary shows your initial share count, annualized dividend yield, monthly loan payment, and when the loan will be paid off.

### Charts

The charts visualize your portfolio growth in two ways:
- **Until Loan Payoff**: Shows portfolio value, loan principal, and net portfolio value until the loan is paid off
- **Full Amortization**: Shows net portfolio value for the entire amortization period

### Detailed Tables

The amortization schedule provides a detailed breakdown of what happens each month or year:
- How dividends accumulate and are distributed
- Tax implications of dividend income
- Loan payment progress
- New shares acquired through DRIP
- Contributions made during each period
- Overall portfolio valuation

Hover over rows and columns in the table to highlight data and track values more easily.

### Data Export

You can export the amortization data to CSV format for further analysis:
- Click the "Export CSV" button in the top-right corner of the table
- The exported file will reflect the current tab selection (Yearly Summary or Full Detail)
- Only visible columns will be included in the export (based on Loan, Tax, and Contribution settings)

## Disclaimer

This simulator provides projections based on constant growth rates and dividend yields. Actual results may vary due to market conditions, changes in dividend policies, interest rates, or tax laws. This tool is for educational purposes only and should not be considered financial advice.