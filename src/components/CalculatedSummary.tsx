import { CalculatedSummary } from "../models/CalculatedSummary";

interface CalculatedSummaryProps {
    summary: CalculatedSummary;
}

const CalculatedSummaryDisplay = ({ summary }: CalculatedSummaryProps) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Calculated Summary</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/2">Initial Share Count:</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{summary.initialShareCount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Annualized Dividend Yield (%):</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{summary.annualizedDividendYieldPercent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Monthly Loan Payment:</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${summary.monthlyLoanPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Loan Payoff Month:</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{summary.loanPayoffMonth}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {summary.yearlyPortfolioValues.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Portfolio Value by Year</h3>
                    <div className="bg-white shadow overflow-hidden rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="divide-y divide-gray-200">
                                {summary.yearlyPortfolioValues.map((entry) => (
                                    <tr key={entry.month}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/2">
                                            Portfolio Value at {entry.month} months:
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${entry.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalculatedSummaryDisplay;