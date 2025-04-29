import { AmortizationEntry } from "../models/AmortizationEntry";

interface AmortizationTableProps {
    amortization: AmortizationEntry[];
}

const AmortizationTable = ({ amortization }: AmortizationTableProps) => {
    return (
        <div style={{ marginBottom: "2rem", maxHeight: "500px", overflowY: "auto" }}>
            <h2>Amortization Schedule</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Share Count</th>
                        <th>Dividend</th>
                        <th>Distribution</th>
                        <th>YTD Distribution</th>
                        <th>Taxes Withheld</th>
                        <th>Loan Payment</th>
                        <th>Surplus for DRIP</th>
                        <th>Additional Principal</th>
                        <th>Actual DRIP</th>
                        <th>Share Price</th>
                        <th>New Shares</th>
                        <th>Total Shares</th>
                        <th>Portfolio Value</th>
                        <th>Loan Principal</th>
                        <th>Net Portfolio Value</th>
                    </tr>
                </thead>
                <tbody>
                    {amortization.map((entry) => (
                        <tr key={entry.month}>
                            <td>{entry.month}</td>
                            <td>{entry.shareCount.toFixed(2)}</td>
                            <td>{entry.dividend.toFixed(2)}</td>
                            <td>{entry.distribution.toFixed(2)}</td>
                            <td>{entry.ytdDistribution.toFixed(2)}</td>
                            <td>{entry.marginalTaxesWithheld.toFixed(2)}</td>
                            <td>{entry.loanPayment.toFixed(2)}</td>
                            <td>{entry.surplusForDrip.toFixed(2)}</td>
                            <td>{entry.additionalPrincipal.toFixed(2)}</td>
                            <td>{entry.actualDrip.toFixed(2)}</td>
                            <td>{entry.sharePrice.toFixed(2)}</td>
                            <td>{entry.newSharesFromDrip.toFixed(2)}</td>
                            <td>{entry.totalShares.toFixed(2)}</td>
                            <td>{entry.portfolioValue.toFixed(2)}</td>
                            <td>{entry.loanPrincipal.toFixed(2)}</td>
                            <td>{entry.netPortfolioValue.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AmortizationTable;