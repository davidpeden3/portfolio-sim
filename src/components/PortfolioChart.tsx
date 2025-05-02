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

interface PortfolioChartProps {
    amortization: AmortizationEntry[];
}

const PortfolioChart = ({ amortization }: PortfolioChartProps) => {
    const [activeTab, setActiveTab] = useState<"payoff" | "full">("payoff");
    
    // Find loan payoff month
    const loanPayoffMonth = amortization.findIndex(entry => entry.loanPrincipal <= 0);
    const payoffMonth = loanPayoffMonth > 0 ? loanPayoffMonth : amortization.length - 1;
    
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">Portfolio Value Over Time</h2>
            
            {/* Tabs */}
            <div className="flex border-b dark:border-darkBlue-700 mb-4 transition-colors duration-200">
                <button
                    className={`py-2 px-4 font-medium transition-colors duration-200 ${
                        activeTab === "payoff"
                            ? "text-blue-600 dark:text-basshead-blue-500 border-b-2 border-blue-600 dark:border-basshead-blue-500"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("payoff")}
                >
                    Until Loan Payoff
                </button>
                <button
                    className={`py-2 px-4 font-medium transition-colors duration-200 ${
                        activeTab === "full"
                            ? "text-blue-600 dark:text-basshead-blue-500 border-b-2 border-blue-600 dark:border-basshead-blue-500"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("full")}
                >
                    Full Amortization
                </button>
            </div>
            
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    {activeTab === "payoff" ? (
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
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioChart;