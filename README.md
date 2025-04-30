# \$MSTY Portfolio Simulator

**🚀 Try it now: [https://portfolio.bassheadsoftware.com/](https://portfolio.bassheadsoftware.com/)**

## Overview

The \$MSTY Portfolio Simulator helps you model the long-term growth of a portfolio invested in \$MSTY, accounting for regular dividend payments, dividend reinvestment (DRIP), taxes, and loan financing scenarios. This tool is perfect for visualizing how your investment might grow over time, especially when leveraging loans to increase your initial position.

## What This Tool Can Help You With

- Calculate potential returns from \$MSTY investments over time
- Model how loans can be used to enhance your initial position
- Visualize the effect of dividend reinvestment (DRIP)
- Account for taxes on dividend income
- See when a loan would be paid off and how your net portfolio value grows
- Understand how different parameters affect your investment outcomes

## Inputs Explained

The simulator allows you to customize various parameters:

### Investment Parameters

- **Initial Share Count**: Number of \$MSTY shares you already own (not purchased with the loan)
- **Initial Investment**: Dollar amount you're investing now (will be used to purchase shares at the Initial Share Price)
- **Initial Share Price**: Current price per share of \$MSTY
- **Dividend Yield per 4w (%)**: The percentage yield for each 4-week dividend period
- **Monthly Appreciation (%)**: Expected monthly share price change (can be negative for a conservative model)

### Loan Parameters

- **Loan Amount**: Size of loan used to purchase additional shares
- **Annual Interest Rate (%)**: The loan's annual interest rate
- **Amortization Months**: Total number of months to pay off the loan
- **Surplus for DRIP to Principal (%)**: Percentage of dividend income (after taxes) that goes to paying down loan principal rather than purchasing more shares

### Tax Parameters

- **Base Income**: Your annual income (used for tax bracket calculations)
- **Withhold Taxes**: Toggle to include or exclude tax withholding from dividends

## How to Use the Simulator

1. **Enter Your Parameters**: Fill out the form with your investment details and assumptions
2. **Calculate**: Click the "Calculate" button to run the simulation
3. **View Results**: The results section will display:
   - A summary of key metrics
   - Charts showing portfolio growth over time
   - Detailed tables showing year-by-year and month-by-month data

## Running the Application Locally

To run the simulator on your own computer:

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 14 or higher)
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
- You can try different scenarios without losing your baseline configuration
- Use the "Reset to Defaults" button if you want to start fresh

## Understanding the Results

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
- Overall portfolio valuation

Hover over rows and columns in the table to highlight data and track values more easily.

## Disclaimer

This simulator provides projections based on constant growth rates and dividend yields. Actual results may vary due to market conditions, changes in dividend policies, interest rates, or tax laws. This tool is for educational purposes only and should not be considered financial advice.