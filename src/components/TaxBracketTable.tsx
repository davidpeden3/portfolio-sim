import React from 'react';
import { FilingType } from './AssumptionsForm';
import TaxBracketRow from './TaxBracketRow';

interface TaxBracketTableProps {
  currentFilingType: FilingType;
}

/**
 * A reusable component for displaying the complete tax bracket table
 * Shows all tax brackets for all filing types
 */
const TaxBracketTable: React.FC<TaxBracketTableProps> = ({ 
  currentFilingType 
}) => {
  // Standard deduction amounts for 2025
  const standardDeductions = {
    single: 15000,       // Single Filers & Married Filing Separately
    married: 30000,      // Married Filing Jointly
    headOfHousehold: 22500 // Head of Household
  };
  // Tax brackets data for 2025
  const taxBrackets = [
    {
      rate: "10%",
      single: "$0 - $11,925",
      married: "$0 - $23,850",
      hoh: "$0 - $17,000"
    },
    {
      rate: "12%",
      single: "$11,926 - $48,475",
      married: "$23,851 - $96,950",
      hoh: "$17,000 - $64,850"
    },
    {
      rate: "22%",
      single: "$48,476 - $103,350",
      married: "$96,951 - $206,700",
      hoh: "$64,850 - $103,350"
    },
    {
      rate: "24%",
      single: "$103,351 - $197,300",
      married: "$206,701 - $394,600",
      hoh: "$103,350 - $197,300"
    },
    {
      rate: "32%",
      single: "$197,301 - $250,525",
      married: "$394,601 - $501,050",
      hoh: "$197,300 - $250,500"
    },
    {
      rate: "35%",
      single: "$250,526 - $626,350",
      married: "$501,051 - $751,600",
      hoh: "$250,500 - $626,350"
    },
    {
      rate: "37%",
      single: "Over $626,350",
      married: "Over $751,600",
      hoh: "Over $626,350"
    }
  ];

  return (
    <div className="mt-4 bg-gray-50 dark:bg-darkBlue-700 rounded-md p-4 transition-colors duration-200">
      <h5 className="text-sm font-medium text-gray-800 dark:text-white mb-2 transition-colors duration-200">
        2025 Federal Income Tax Brackets and Rates
      </h5>
      
      
      <div className="overflow-x-auto">
        {/* Tax Brackets Table */}
        <table className="min-w-full text-xs text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <thead>
            <tr className="bg-blue-200 dark:bg-blue-300 text-gray-900 dark:text-gray-900 transition-colors duration-200">
              <th className="px-3 py-2 text-left font-semibold w-1/4 text-gray-900 dark:text-gray-900">Tax Rate</th>
              <th className="px-3 py-2 text-left w-1/4 text-gray-900 dark:text-gray-900">Single Filers</th>
              <th className="px-3 py-2 text-left w-1/4 text-gray-900 dark:text-gray-900">Married Filing Jointly</th>
              <th className="px-3 py-2 text-left w-1/4 text-gray-900 dark:text-gray-900">Head of Household</th>
            </tr>
          </thead>
          <tbody>
            {taxBrackets.map((bracket, index) => (
              <TaxBracketRow
                key={index}
                taxRate={bracket.rate}
                singleRange={bracket.single}
                marriedRange={bracket.married}
                hohRange={bracket.hoh}
                currentFilingType={currentFilingType}
              />
            ))}
          </tbody>
        </table>
        
        {/* Standard Deduction Table */}
        <table className="min-w-full text-xs text-gray-700 dark:text-gray-300 transition-colors duration-200 mt-2">
          <thead>
            <tr className="bg-blue-200 dark:bg-blue-300 text-gray-900 dark:text-gray-900 transition-colors duration-200">
              <th className="px-3 py-2 text-left font-semibold w-1/4 text-gray-900 dark:text-gray-900">Standard Deduction</th>
              <th className="px-3 py-2 text-left w-1/4 text-gray-900 dark:text-gray-900">Single Filers</th>
              <th className="px-3 py-2 text-left w-1/4 text-gray-900 dark:text-gray-900">Married Filing Jointly</th>
              <th className="px-3 py-2 text-left w-1/4 text-gray-900 dark:text-gray-900">Head of Household</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-1 text-gray-500 dark:text-gray-400 italic">
                Reduces taxable income
              </td>
              <td className={`px-3 py-1 ${currentFilingType === 'single' ? "bg-blue-50 dark:bg-blue-100 font-semibold text-gray-900 dark:text-gray-900" : ""}`}>
                ${standardDeductions.single.toLocaleString()}
              </td>
              <td className={`px-3 py-1 ${currentFilingType === 'married' ? "bg-blue-50 dark:bg-blue-100 font-semibold text-gray-900 dark:text-gray-900" : ""}`}>
                ${standardDeductions.married.toLocaleString()}
              </td>
              <td className={`px-3 py-1 ${currentFilingType === 'headOfHousehold' ? "bg-blue-50 dark:bg-blue-100 font-semibold text-gray-900 dark:text-gray-900" : ""}`}>
                ${standardDeductions.headOfHousehold.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-200">
        Note: Standard deduction is subtracted from your total income (Base Income + YTD Dividends) before tax rates are applied.
      </p>
    </div>
  );
};

export default TaxBracketTable;