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
    // Prepare data for chart
    const chartData = amortization.map(entry => ({
        month: entry.month,
        portfolioValue: Number(entry.portfolioValue.toFixed(2)),
        loanPrincipal: Number(entry.loanPrincipal.toFixed(2)),
        netPortfolioValue: Number(entry.netPortfolioValue.toFixed(2))
    }));

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Portfolio Value Over Time</h2>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
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
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioChart;