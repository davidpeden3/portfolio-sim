import { useState } from "react";
import { AmortizationEntry } from "../models/AmortizationEntry";
import { downloadCSV } from "../utils/csvExport";

interface AmortizationTableProps {
    amortization: AmortizationEntry[];
    includeLoan?: boolean;
    includeTaxes?: boolean;
}

const AmortizationTable = ({ 
    amortization, 
    includeLoan = true, 
    includeTaxes = true 
}: AmortizationTableProps) => {
    const [activeTab, setActiveTab] = useState<"summary" | "detail">("summary");
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
    
    // Filter yearly entries for summary tab (months where n % 12 === 0)
    const yearlyAmortization = amortization.filter(entry => entry.month > 0 && entry.month % 12 === 0);
    
    // Function to handle CSV export
    const handleExportCSV = () => {
        // Determine which data to export based on the active tab
        const dataToExport = activeTab === "summary" ? yearlyAmortization : amortization;
        
        // Create column definitions for the CSV - only include visible columns
        const csvColumns = columns.map(col => ({
            key: col.key as keyof AmortizationEntry,
            header: col.label
        }));
        
        // Generate filename based on the active tab, loan, and tax inclusion
        const loanStatus = includeLoan ? "with-loan" : "no-loan";
        const taxStatus = includeTaxes ? "with-taxes" : "no-taxes";
        const filename = `portfolio-amortization-${activeTab === "summary" ? "yearly" : "monthly"}-${loanStatus}-${taxStatus}`;
        
        // Trigger the download
        downloadCSV(dataToExport, filename, csvColumns);
    };

    // Define all columns
    const allColumns = [
        { key: "month", label: "Month", sticky: true, loanRelated: false, taxRelated: false },
        { key: "shareCount", label: "Share Count", loanRelated: false, taxRelated: false, format: (val: number) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "dividend", label: "Dividend", loanRelated: false, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "distribution", label: "Distribution", loanRelated: false, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "ytdDistribution", label: "YTD Distribution", loanRelated: false, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "marginalTaxesWithheld", label: "Taxes Withheld", loanRelated: false, taxRelated: true, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "loanPayment", label: "Loan Payment", loanRelated: true, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "surplusForDrip", label: "Surplus for DRIP", loanRelated: false, taxRelated: true, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "additionalPrincipal", label: "Additional Principal", loanRelated: true, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "actualDrip", label: "Actual DRIP", loanRelated: false, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "sharePrice", label: "Share Price", loanRelated: false, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "newSharesFromDrip", label: "New Shares", loanRelated: false, taxRelated: false, format: (val: number) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "totalShares", label: "Total Shares", loanRelated: false, taxRelated: false, format: (val: number) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "portfolioValue", label: "Portfolio Value", loanRelated: false, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "loanPrincipal", label: "Loan Principal", loanRelated: true, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
        { key: "netPortfolioValue", label: "Net Portfolio Value", loanRelated: true, taxRelated: false, format: (val: number) => "$" + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }
    ];
    
    // Filter columns based on includeLoan and includeTaxes props
    const filteredColumns = allColumns.filter(col => {
        if (!includeLoan && col.loanRelated) return false;
        if (!includeTaxes && col.taxRelated) return false;
        return true;
    });
    
    const columns = filteredColumns;
    
    // CSS class helpers for highlighting
    const getHeaderCellClass = (colIndex: number) => {
        // Base styling without background
        let className = "px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-200";
        
        // Add sticky class for the first column
        if (colIndex === 0) {
            className += " sticky left-0 z-20";
        }
        
        // Add background last to ensure it's not overridden
        if (colIndex === hoveredColumn) {
            // Column is highlighted
            className += " bg-green-100 dark:bg-darkBlue-700";
        } else {
            // Normal header background
            className += " bg-gray-50 dark:bg-darkBlue-800";
        }
        
        return className;
    };
    
    const getDataCellClass = (rowIndex: number, colIndex: number, isEvenRow: boolean) => {
        const baseClass = "px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 transition-colors duration-200";
        
        // Start with base styling
        let className = baseClass;
        
        // Apply sticky positioning for month column
        if (colIndex === 0) {
            className += " sticky left-0 z-20";
        }
        
        // Determine cell background
        // First determine if this cell needs highlighting
        if (rowIndex === hoveredRow && colIndex === hoveredColumn) {
            // Intersection highlight (strongest)
            className += " bg-green-300 dark:bg-darkBlue-600";
        } else if (rowIndex === hoveredRow) {
            // Row highlight
            className += " bg-green-100 dark:bg-darkBlue-700";
        } else if (colIndex === hoveredColumn) {
            // Column highlight
            className += " bg-green-100 dark:bg-darkBlue-700";
        } else {
            // No highlighting, apply normal row striping
            className += isEvenRow ? " bg-white dark:bg-darkBlue-800" : " bg-gray-50 dark:bg-darkBlue-700";
        }
        
        return className;
    };
    
    // Render the amortization table with either yearly data or full detail
    const renderAmortizationTable = (entries: AmortizationEntry[]) => (
        <div className="max-h-[500px] overflow-auto">
            <div className="relative">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-darkBlue-700 table-fixed transition-colors duration-200">
                    <thead className="bg-gray-50 dark:bg-darkBlue-800 sticky top-0 z-30 transition-colors duration-200">
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
                    <tbody className="bg-white dark:bg-darkBlue-800 divide-y divide-gray-200 dark:divide-darkBlue-700 transition-colors duration-200">
                        {entries.map((entry, rowIndex) => (
                            <tr 
                                key={entry.month} 
                                className={rowIndex % 2 === 0 ? 'bg-white dark:bg-darkBlue-800' : 'bg-gray-50 dark:bg-darkBlue-700'}
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">Amortization Data</h2>
            
            {/* Tabs and Export Button */}
            <div className="flex justify-between border-b dark:border-darkBlue-700 mb-4 transition-colors duration-200">
                <div className="flex">
                    <button
                        className={`py-2 px-4 font-medium transition-colors duration-200 ${
                            activeTab === "summary"
                                ? "text-blue-600 dark:text-basshead-blue-500 border-b-2 border-blue-600 dark:border-basshead-blue-500"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab("summary")}
                    >
                        Yearly Summary
                    </button>
                    <button
                        className={`py-2 px-4 font-medium transition-colors duration-200 ${
                            activeTab === "detail"
                                ? "text-blue-600 dark:text-basshead-blue-500 border-b-2 border-blue-600 dark:border-basshead-blue-500"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab("detail")}
                    >
                        Full Detail
                    </button>
                </div>
                
                {/* CSV Export Button - right aligned with margin bottom */}
                <div className="mb-4">
                    <button
                        className="inline-flex items-center px-4 py-2 border border-indigo-300 dark:border-basshead-blue-600 rounded-md shadow-sm text-sm font-medium text-indigo-700 dark:text-white bg-white dark:bg-darkBlue-700 hover:bg-indigo-50 dark:hover:bg-darkBlue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 transition-colors duration-200"
                        onClick={handleExportCSV}
                    >
                        <svg className="h-5 w-5 mr-2 help-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span className="help-guide-text">Export CSV</span>
                    </button>
                </div>
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