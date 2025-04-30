// src/pages/HomePage.tsx
import { useState } from "react";
import { Assumptions } from "../models/Assumptions";
import { CalculatedSummary } from "../models/CalculatedSummary";
import { AmortizationEntry } from "../models/AmortizationEntry";
import { calculatePortfolio } from "../calculator/PortfolioCalculator";
import AssumptionsForm from "../components/AssumptionsForm";
import CalculatedSummaryDisplay from "../components/CalculatedSummary";
import AmortizationTable from "../components/AmortizationTable";
import PortfolioChart from "../components/PortfolioChart";

const HomePage = () => {
    // We use this state to track the current assumptions
    const [, setAssumptions] = useState<Assumptions | null>(null);
    const [summary, setSummary] = useState<CalculatedSummary | null>(null);
    const [amortization, setAmortization] = useState<AmortizationEntry[]>([]);

    const handleCalculate = (newAssumptions: Assumptions) => {
        const result = calculatePortfolio(newAssumptions);
        setAssumptions(newAssumptions);
        setSummary(result.summary);
        setAmortization(result.amortization);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Portfolio Simulator</h1>

            <AssumptionsForm onCalculate={handleCalculate} />

            {summary && (
                <>
                    <CalculatedSummaryDisplay summary={summary} />
                    <PortfolioChart amortization={amortization} />
                    <AmortizationTable amortization={amortization} />
                </>
            )}
        </div>
    );
};

export default HomePage;