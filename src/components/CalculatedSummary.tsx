import { CalculatedSummary } from "../models/CalculatedSummary";

interface CalculatedSummaryProps {
    summary: CalculatedSummary;
}

const CalculatedSummaryDisplay = ({ summary }: CalculatedSummaryProps) => {
    return (
        <div style={{ marginBottom: "2rem" }}>
            <h2>Calculated Summary</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Initial Share Count:</td>
                        <td>{summary.initialShareCount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Annualized Dividend Yield (%):</td>
                        <td>{summary.annualizedDividendYieldPercent.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Monthly Loan Payment:</td>
                        <td>${summary.monthlyLoanPayment.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Loan Payoff Month:</td>
                        <td>{summary.loanPayoffMonth}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CalculatedSummaryDisplay;