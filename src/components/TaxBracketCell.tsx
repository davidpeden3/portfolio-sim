import React from 'react';
import { FilingType } from '../models/Assumptions';

interface TaxBracketCellProps {
  rangeText: string;
  currentFilingType: FilingType;
  cellFilingType: FilingType;
}

/**
 * A reusable component for displaying tax bracket cells in the tax table
 * Handles highlighting and styling based on the current filing type
 */
const TaxBracketCell: React.FC<TaxBracketCellProps> = ({ 
  rangeText, 
  currentFilingType, 
  cellFilingType 
}) => {
  const isHighlighted = currentFilingType === cellFilingType;
  
  // Base classes for all cells
  const baseClasses = "px-3 py-1";
  
  // Additional classes for highlighted cells - lighter blue than headers, no border
  const highlightClasses = "bg-blue-50 dark:bg-blue-100 font-semibold text-gray-900 dark:text-gray-900";
  
  return (
    <td className={`${baseClasses} ${isHighlighted ? highlightClasses : ""}`}>
      {rangeText}
    </td>
  );
};

export default TaxBracketCell;