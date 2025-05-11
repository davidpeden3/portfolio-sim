import { useState } from "react";
import { AmortizationEntry } from "../models/AmortizationEntry";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Calculate intelligent Y axis domain based on data range
const calculateIntelligentYDomain = (values: number[]): [number, number] => {
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // If all values are the same or nearly the same, create a range around them
    if (maxValue - minValue < maxValue * 0.01) {
        const midPoint = (maxValue + minValue) / 2;
        const padding = midPoint * 0.1 || 1; // Use 10% padding or at least 1
        return [Math.max(0, midPoint - padding), midPoint + padding];
    }

    // Find good min/max values to show the variations clearly
    // Start from a percentage of the minimum, or 0 if it's close to 0
    const min = minValue < maxValue * 0.2 ? 0 : minValue * 0.9;
    // Add padding to the top
    const max = maxValue * 1.1;

    return [min, max];
};

interface PortfolioChartProps {
    amortization: AmortizationEntry[];
    includeLoan?: boolean;
}

const PortfolioChart = ({ amortization, includeLoan = false }: PortfolioChartProps) => {
    const [activeTab, setActiveTab] = useState<"dividendShare" | "netPortfolio" | "loanPayoff">("dividendShare");
    
    // Find loan payoff month
    const loanPayoffMonth = amortization.findIndex(entry => entry.loanPrincipal <= 0);
    const payoffMonth = loanPayoffMonth > 0 ? loanPayoffMonth : amortization.length - 1;
    
    // Prepare data for dividend and share price chart - dividend first for better tooltip order
    const shareDividendData = amortization.map(entry => ({
        month: entry.month,
        dividend: Number(entry.dividend.toFixed(2)),
        sharePrice: Number(entry.sharePrice.toFixed(2))
    }));
    
    // We're using calculateIntelligentYDomain for Y-axis scaling
    
    // Prepare data for payoff chart
    const payoffChartData = amortization
        .slice(0, payoffMonth + 1)
        .map(entry => ({
            month: entry.month,
            portfolioValue: Number(entry.portfolioValue.toFixed(2)),
            loanPrincipal: Number(entry.loanPrincipal.toFixed(2)),
            netPortfolioValue: Number(entry.netPortfolioValue.toFixed(2))
        }));
    
    // Prepare data for full chart
    const fullChartData = amortization.map(entry => ({
        month: entry.month,
        netPortfolioValue: Number(entry.netPortfolioValue.toFixed(2))
    }));

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">Portfolio Analysis</h2>

            {/* Tabs */}
            <div className="flex border-b dark:border-darkBlue-700 mb-4 transition-colors duration-200">
                <button
                    className={`py-2 px-4 font-medium transition-colors duration-200 ${
                        activeTab === "dividendShare"
                            ? "text-blue-600 dark:text-basshead-blue-500 border-b-2 border-blue-600 dark:border-basshead-blue-500"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("dividendShare")}
                >
                    Dividend & Share Price
                </button>
                <button
                    className={`py-2 px-4 font-medium transition-colors duration-200 ${
                        activeTab === "netPortfolio"
                            ? "text-blue-600 dark:text-basshead-blue-500 border-b-2 border-blue-600 dark:border-basshead-blue-500"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("netPortfolio")}
                >
                    Net Portfolio Growth
                </button>
                {includeLoan && (
                    <button
                        className={`py-2 px-4 font-medium transition-colors duration-200 ${
                            activeTab === "loanPayoff"
                                ? "text-blue-600 dark:text-basshead-blue-500 border-b-2 border-blue-600 dark:border-basshead-blue-500"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab("loanPayoff")}
                    >
                        Loan Payoff
                    </button>
                )}
            </div>
            
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    {activeTab === "dividendShare" ? (
                        <LineChart
                            data={shareDividendData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="month" />
                            {/* Primary Y axis for dividend (now on left) */}
                            <YAxis
                                yAxisId="left"
                                domain={calculateIntelligentYDomain(amortization.map(entry => entry.dividend))}
                                tickFormatter={(value) => `$${value.toFixed(2)}`}
                                allowDecimals={true}
                                tickCount={7}
                            />
                            {/* Secondary Y axis for share price (now on right) */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={calculateIntelligentYDomain(amortization.map(entry => entry.sharePrice))}
                                tickFormatter={(value) => `$${value.toFixed(2)}`}
                                allowDecimals={true}
                                tickCount={7}
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                                formatter={(value, name) => {
                                    // Fix the name display to show the correct labels
                                    const formattedName = name === "dividend"
                                        ? "Dividend"
                                        : name === "sharePrice"
                                        ? "Share Price"
                                        : name;
                                    return [`$${value}`, formattedName];
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="dividend"
                                name="Dividend"
                                stroke="#f59e0b"
                                yAxisId="left"
                                activeDot={{ r: 8 }}
                                // Scale dividend value to make it more visible
                                scale="auto"
                            />
                            <Line
                                type="monotone"
                                dataKey="sharePrice"
                                name="Share Price"
                                stroke="#3b82f6"
                                yAxisId="right"
                            />
                        </LineChart>
                    ) : activeTab === "netPortfolio" ? (
                        <LineChart
                            data={fullChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="month" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="netPortfolioValue"
                                name="Net Portfolio Value"
                                stroke="#10b981"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    ) : activeTab === "loanPayoff" && includeLoan ? (
                        <LineChart
                            data={payoffChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="month" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="portfolioValue"
                                name="Portfolio Value"
                                stroke="#3b82f6"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="loanPrincipal"
                                name="Loan Principal"
                                stroke="#ef4444"
                            />
                            <Line
                                type="monotone"
                                dataKey="netPortfolioValue"
                                name="Net Portfolio Value"
                                stroke="#10b981"
                            />
                        </LineChart>
                    ) : (
                        // Fallback to default chart if no valid tab is selected
                        <LineChart
                            data={shareDividendData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="month" />
                            {/* Primary Y axis for dividend (now on left) */}
                            <YAxis
                                yAxisId="left"
                                domain={calculateIntelligentYDomain(amortization.map(entry => entry.dividend))}
                                tickFormatter={(value) => `$${value.toFixed(2)}`}
                                allowDecimals={true}
                                tickCount={7}
                            />
                            {/* Secondary Y axis for share price (now on right) */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={calculateIntelligentYDomain(amortization.map(entry => entry.sharePrice))}
                                tickFormatter={(value) => `$${value.toFixed(2)}`}
                                allowDecimals={true}
                                tickCount={7}
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                                formatter={(value, name) => {
                                    const formattedName = name === "dividend"
                                        ? "Dividend"
                                        : name === "sharePrice"
                                        ? "Share Price"
                                        : name;
                                    return [`$${value}`, formattedName];
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="dividend"
                                name="Dividend"
                                stroke="#f59e0b"
                                yAxisId="left"
                                activeDot={{ r: 8 }}
                                scale="auto"
                            />
                            <Line
                                type="monotone"
                                dataKey="sharePrice"
                                name="Share Price"
                                stroke="#3b82f6"
                                yAxisId="right"
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioChart;