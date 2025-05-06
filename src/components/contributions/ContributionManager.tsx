import React, { useState } from 'react';
import { 
  SupplementalContribution
} from '../../models/SupplementalContribution';
import ContributionList from './ContributionList';
import ContributionForm from './ContributionForm';

interface ContributionManagerProps {
  contributions: SupplementalContribution[];
  onChange: (contributions: SupplementalContribution[]) => void;
  simulationStartMonth?: number; // 1-12 for Jan-Dec
  simulationMonths?: number;
}

const ContributionManager: React.FC<ContributionManagerProps> = ({ 
  contributions, 
  onChange,
  simulationStartMonth,
  simulationMonths
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingContribution, setEditingContribution] = useState<SupplementalContribution | null>(null);
  
  // Handler for adding a new contribution
  const handleAddContribution = (contribution: SupplementalContribution) => {
    const updatedContributions = [...contributions, contribution];
    onChange(updatedContributions);
    setShowForm(false);
    setEditingContribution(null);
  };
  
  // Handler for editing an existing contribution
  const handleEditContribution = (contribution: SupplementalContribution) => {
    const updatedContributions = contributions.map(c => 
      c.id === contribution.id ? contribution : c
    );
    onChange(updatedContributions);
    setShowForm(false);
    setEditingContribution(null);
  };
  
  // Handler for removing a contribution
  const handleRemoveContribution = (id: string) => {
    const updatedContributions = contributions.filter(c => c.id !== id);
    onChange(updatedContributions);
  };
  
  // Handler for toggling a contribution's enabled state
  const handleToggleContribution = (id: string) => {
    const updatedContributions = contributions.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    onChange(updatedContributions);
  };
  
  // Handler for opening the edit form
  const handleOpenEditForm = (contribution: SupplementalContribution) => {
    setEditingContribution(contribution);
    setShowForm(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-gray-900 dark:text-white transition-colors duration-200">
          Supplemental Contributions
        </h4>
        <button
          type="button"
          onClick={() => {
            setEditingContribution(null);
            setShowForm(true);
          }}
          className="px-3 py-1 bg-indigo-600 dark:bg-basshead-blue-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 dark:hover:bg-basshead-blue-700 transition-colors duration-200"
        >
          Add Contribution
        </button>
      </div>
      
      {/* Contribution list */}
      <div className="bg-gray-50 dark:bg-darkBlue-900 rounded-md p-4 transition-colors duration-200">
        {contributions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center transition-colors duration-200">
            No contributions added yet. Click "Add Contribution" to get started.
          </p>
        ) : (
          <ContributionList
            contributions={contributions}
            onEdit={handleOpenEditForm}
            onRemove={handleRemoveContribution}
            onToggle={handleToggleContribution}
          />
        )}
      </div>
      
      {/* Contribution form dialog */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-darkBlue-800 p-6 rounded-lg shadow-lg w-full max-w-md transition-colors duration-200">
            <ContributionForm
              key="contribution-form" // Add a stable key to prevent remounting
              contribution={editingContribution}
              onSave={editingContribution ? handleEditContribution : handleAddContribution}
              onCancel={() => {
                setShowForm(false);
                setEditingContribution(null);
              }}
              simulationStartMonth={simulationStartMonth}
              simulationMonths={simulationMonths}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionManager;