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
    const data = amortization.map((entry) => ({
        month: entry.month,
        portfolioValue: parseFloat(entry.portfolioValue.toFixed(2)),
        loanPrincipal: parseFloat(entry.loanPrincipal.toFixed(2)),
        netPortfolioValue: parseFloat(entry.netPortfolioValue.toFixed(2)),
    }));

    return (
        <div style={{ marginBottom: "2rem", height: "400px" }}>
            <h2>Portfolio Value Over Time</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="portfolioValue" stroke="#8884d8" name="Portfolio Value" />
                    <Line type="monotone" dataKey="loanPrincipal" stroke="#82ca9d" name="Loan Principal" />
                    <Line type="monotone" dataKey="netPortfolioValue" stroke="#ff7300" name="Net Portfolio Value" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PortfolioChart;