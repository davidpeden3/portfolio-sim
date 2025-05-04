import React from 'react';
import { FilingType } from '../models/Assumptions';
import TaxBracketCell from './TaxBracketCell';

interface TaxBracketRowProps {
  taxRate: string;
  singleRange: string;
  marriedRange: string;
  hohRange: string;
  currentFilingType: FilingType;
}

/**
 * A reusable component for displaying a row in the tax bracket table
 * Contains tax rate and bracket ranges for all filing types
 */
const TaxBracketRow: React.FC<TaxBracketRowProps> = ({
  taxRate,
  singleRange,
  marriedRange,
  hohRange,
  currentFilingType
}) => {
  return (
    <tr>
      <td className="px-3 py-1">{taxRate}</td>
      <TaxBracketCell 
        rangeText={singleRange} 
        currentFilingType={currentFilingType} 
        cellFilingType="single" 
      />
      <TaxBracketCell 
        rangeText={marriedRange} 
        currentFilingType={currentFilingType} 
        cellFilingType="married" 
      />
      <TaxBracketCell 
        rangeText={hohRange} 
        currentFilingType={currentFilingType} 
        cellFilingType="headOfHousehold" 
      />
    </tr>
  );
};

export default TaxBracketRow;