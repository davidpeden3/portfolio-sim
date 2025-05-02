import { CalculatedSummary } from "../models/CalculatedSummary";

interface CalculatedSummaryProps {
    summary: CalculatedSummary;
}

const CalculatedSummaryDisplay = ({ summary }: CalculatedSummaryProps) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">Calculated Summary</h2>
            <div className="bg-white dark:bg-darkBlue-800 shadow overflow-hidden rounded-lg transition-colors duration-200">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-darkBlue-700 transition-colors duration-200">
                    <tbody className="divide-y divide-gray-200 dark:divide-darkBlue-700 transition-colors duration-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-darkBlue-700 w-1/2 transition-colors duration-200">Initial Share Count:</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">{summary.initialShareCount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-darkBlue-700 transition-colors duration-200">Annualized Dividend Yield (%):</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">{summary.annualizedDividendYieldPercent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-darkBlue-700 transition-colors duration-200">Monthly Loan Payment:</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">${summary.monthlyLoanPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-darkBlue-700 transition-colors duration-200">Loan Payoff Month:</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">{summary.loanPayoffMonth}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CalculatedSummaryDisplay;