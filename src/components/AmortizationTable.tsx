import { useState } from "react";
import { AmortizationEntry } from "../models/AmortizationEntry";

interface AmortizationTableProps {
    amortization: AmortizationEntry[];
}

const AmortizationTable = ({ amortization }: AmortizationTableProps) => {
    const [activeTab, setActiveTab] = useState<"summary" | "detail">("summary");
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
    
    // Filter yearly entries for summary tab (months where n % 12 === 0)
    const yearlyAmortization = amortization.filter(entry => entry.month > 0 && entry.month % 12 === 0);

    // Column definitions for more programmatic handling
    const columns = [
        { key: "month", label: "Month", sticky: true },
        { key: "shareCount", label: "Share Count", format: (val: number) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "dividend", label: "Dividend", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "distribution", label: "Distribution", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "ytdDistribution", label: "YTD Distribution", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "marginalTaxesWithheld", label: "Taxes Withheld", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "loanPayment", label: "Loan Payment", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "surplusForDrip", label: "Surplus for DRIP", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "additionalPrincipal", label: "Additional Principal", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "actualDrip", label: "Actual DRIP", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "sharePrice", label: "Share Price", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "newSharesFromDrip", label: "New Shares", format: (val: number) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "totalShares", label: "Total Shares", format: (val: number) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "portfolioValue", label: "Portfolio Value", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "loanPrincipal", label: "Loan Principal", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "netPortfolioValue", label: "Net Portfolio Value", format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }
    ];
    
    // CSS class helpers for highlighting
    const getHeaderCellClass = (colIndex: number) => {
        let className = "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50";
        
        // Add sticky class for the first column
        if (colIndex === 0) {
            className += " sticky left-0 z-50";
        }
        
        // Add hover highlight for the column
        if (colIndex === hoveredColumn) {
            className += " bg-blue-200 bg-opacity-70";
        }
        
        return className;
    };
    
    const getDataCellClass = (rowIndex: number, colIndex: number, isEvenRow: boolean) => {
        const baseClass = "px-3 py-2 whitespace-nowrap text-sm text-gray-900";
        const rowBgClass = isEvenRow ? "bg-white" : "bg-gray-50";
        
        // Start with base styling
        let className = baseClass;
        
        // Special handling for the first column (month)
        if (colIndex === 0) {
            // Start with basic styling for month column
            className += " sticky left-0 z-50";
            
            // Apply base background
            if (rowIndex === hoveredRow && hoveredColumn === 0) {
                // Intersection of row and column hover on month
                className += " bg-blue-300";
            } else if (rowIndex === hoveredRow) {
                // Row hover on month
                className += " bg-blue-200";
            } else if (colIndex === hoveredColumn) {
                // Column hover on month
                className += " bg-blue-200";
            } else {
                // Default background
                className += ` ${rowBgClass}`;
            }
        } else {
            // For all other columns
            // Apply base background
            className += ` ${rowBgClass}`;
            
            // Apply hover styles
            if (rowIndex === hoveredRow && colIndex === hoveredColumn) {
                // Intersection highlight
                className += " bg-blue-300";
            } else if (rowIndex === hoveredRow) {
                // Row highlight
                className += " bg-blue-200";
            } else if (colIndex === hoveredColumn) {
                // Column highlight
                className += " bg-blue-200";
            }
        }
        
        return className;
    };
    
    // Render the amortization table with either yearly data or full detail
    const renderAmortizationTable = (entries: AmortizationEntry[]) => (
        <div className="max-h-[500px] overflow-auto">
            <div className="isolation-auto">
                <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
                    <thead className="bg-gray-50 sticky top-0 z-20">
                        <tr>
                            {columns.map((column, colIndex) => (
                                <th 
                                    key={column.key}
                                    className={getHeaderCellClass(colIndex)}
                                    onMouseEnter={() => setHoveredColumn(colIndex)}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {entries.map((entry, rowIndex) => (
                            <tr 
                                key={entry.month} 
                                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                onMouseEnter={() => setHoveredRow(rowIndex)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                {columns.map((column, colIndex) => (
                                    <td 
                                        key={`${entry.month}-${column.key}`}
                                        className={getDataCellClass(rowIndex, colIndex, rowIndex % 2 === 0)}
                                        onMouseEnter={() => setHoveredColumn(colIndex)}
                                        onMouseLeave={() => setHoveredColumn(null)}
                                    >
                                        {column.key === 'month' 
                                            ? entry.month 
                                            : column.format ? column.format(entry[column.key as keyof AmortizationEntry] as number) : entry[column.key as keyof AmortizationEntry]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Amortization Data</h2>
            
            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === "summary"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("summary")}
                >
                    Yearly Summary
                </button>
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === "detail"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("detail")}
                >
                    Full Detail
                </button>
            </div>
            
            <div className="overflow-hidden">
                {activeTab === "summary" 
                    ? renderAmortizationTable(yearlyAmortization)
                    : renderAmortizationTable(amortization)
                }
            </div>
        </div>
    );
};

export default AmortizationTable;