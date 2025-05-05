import React from 'react';
import { SupplementalContribution } from '../../models/SupplementalContribution';
import { formatUSD } from '../../utils/formatUtils';

interface ContributionListProps {
  contributions: SupplementalContribution[];
  onEdit: (contribution: SupplementalContribution) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

const ContributionList: React.FC<ContributionListProps> = ({
  contributions,
  onEdit,
  onRemove,
  onToggle
}) => {
  // Helper to format the contribution frequency
  const formatFrequency = (contribution: SupplementalContribution): string => {
    if (!contribution.recurring) return 'One-time';
    
    // Apply proper hyphenation for display
    switch (contribution.frequency) {
      case 'biweekly': return 'Bi-weekly';
      case 'semimonthly': return 'Semi-monthly';
      default: return contribution.frequency.charAt(0).toUpperCase() + contribution.frequency.slice(1);
    }
  };
  
  // Helper to format the contribution type
  const formatType = (type: string): string => {
    switch (type) {
      case 'dca': return 'DCA';
      case 'salary': return 'Salary';
      case 'oneTime': return 'One-time';
      default: return type;
    }
  };
  
  // Helper to format the date range
  const formatDateRange = (contribution: SupplementalContribution): string => {
    const startDate = contribution.startDate ? new Date(contribution.startDate) : null;
    const endDate = contribution.endDate ? new Date(contribution.endDate) : null;
    
    if (!startDate && !endDate) return 'Entire simulation';
    if (startDate && !endDate) return `From ${startDate.toLocaleDateString()}`;
    if (!startDate && endDate) return `Until ${endDate.toLocaleDateString()}`;
    if (startDate && endDate) {
      // For one-time contributions with same start and end date
      if (!contribution.recurring && 
          startDate.getTime() === endDate.getTime()) {
        return `On ${startDate.toLocaleDateString()}`;
      }
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    
    return '';
  };

  return (
    <div className="space-y-3">
      {contributions.map(contribution => (
        <div 
          key={contribution.id}
          className={`border ${contribution.enabled ? 'border-gray-200 dark:border-darkBlue-700' : 'border-gray-300 dark:border-darkBlue-600 opacity-70'} rounded-md p-3 transition-colors duration-200`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <h5 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                  {contribution.name}
                </h5>
                <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-darkBlue-700 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-200">
                  {formatType(contribution.type)}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-200">
                <p>{formatUSD(contribution.amount)} • {formatFrequency(contribution)} • {formatDateRange(contribution)}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => onToggle(contribution.id)}
                className={`p-1.5 rounded-md ${contribution.enabled ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'} transition-colors duration-200`}
                title={contribution.enabled ? 'Disable' : 'Enable'}
              >
                {contribution.enabled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => onEdit(contribution)}
                className="p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 rounded-md transition-colors duration-200"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onRemove(contribution.id)}
                className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded-md transition-colors duration-200"
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContributionList;