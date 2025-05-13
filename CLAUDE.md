# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The $MSTY Portfolio Simulator is a web application that helps users model the long-term growth of investment portfolios, accounting for:
- Regular dividend payments
- Dividend reinvestment (DRIP)
- Taxes
- Loan financing scenarios
- Supplemental contributions (DCA, salary investments)

The tool visualizes how investments might grow over time, especially when leveraging loans to increase initial positions.

## Development Commands

```bash
# Installation
npm install

# Start development server
npm run dev           # Access at http://localhost:5173

# Testing
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode

# Build and validation
npm run lint          # Run ESLint
npm run build         # Type-check and build for production

# Version management
npm run bumpPatch     # Increment patch version
npm run bumpMinor     # Increment minor version
npm run bumpMajor     # Increment major version
npm run getVersion    # Display current version
npm run setVersion    # Set specific version
```

## Architecture Overview

### Core Calculator Logic

The simulation is powered by two main calculators:

1. **PortfolioCalculator** (`src/calculator/PortfolioCalculator.ts`)
   - Implements various models for share price and dividend calculations
   - Handles tax calculations with proper marginal tax brackets
   - Contains the main `calculatePortfolio` function that generates amortization tables
   - Uses months as the basic unit for simulations

2. **ContributionCalculator** (`src/calculator/ContributionCalculator.ts`)
   - Manages supplemental contributions to the portfolio
   - Handles various contribution schedules with different frequencies
   - Materializes abstract contribution definitions into specific dates and amounts

### Data Models

1. **Assumptions** (`src/models/Assumptions.ts`)
   - Core data structure for simulation configuration
   - Contains investor profile, tax settings, DRIP settings, etc.

2. **SupplementalContribution** (`src/models/SupplementalContribution.ts`)
   - Defines contribution types (DCA, salary, one-time)
   - Specifies frequency options (daily, weekly, biweekly, etc.)

3. **AmortizationEntry** and **CalculatedSummary**
   - Output data structures from the simulation

### UI Components

1. **PortfolioSimulator** (`src/components/PortfolioSimulator.tsx`)
   - Main container that orchestrates the application
   - Manages state, form data, and profile selection
   - Coordinates between UI and calculators

2. **AssumptionsForm** (`src/components/AssumptionsForm.tsx`)
   - Form for all simulation inputs
   - Adapts to selected profile type

3. **Visualization Components**
   - Charts, tables, and summary displays

### Utility Functions

1. **Storage Utils** (`src/utils/storageUtils.ts`)
   - Handles persistent storage in localStorage

2. **Config Sharing** (`src/utils/configShare.ts`)
   - Implements configuration sharing via compressed URL parameters

## Data Flow

1. User selects profile or customizes settings (persisted to localStorage)
2. User triggers calculation, converting form data to Assumptions type
3. Calculators process these assumptions and return results
4. Results are displayed in charts and tables
5. Settings can be shared via URL parameters using compression

## Key Features to Know

- The application uses TailwindCSS for styling
- Recharts is used for data visualization
- React hooks are used extensively for state management
- The application includes a theming system with dark/light mode
- Profiles system allows predefined scenarios (Early Career, Mid Career, Retirement)
- Simulation parameters can be shared via URL
- Results can be exported to CSV format

## Common Development Patterns

- Form inputs are generally wrapped in custom components (see `src/components/inputs/`)
- Modals are used for help text and additional information
- Utility functions handle formatting for currency, percentages, and dates
- Calculator logic is separate from UI components for better testability
- Tests focus on the core calculation logic