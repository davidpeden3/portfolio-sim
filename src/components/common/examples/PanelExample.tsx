import React from 'react';
import Panel from '../Panel';

/**
 * Example component showing how to use the Panel component
 */
const PanelExample: React.FC = () => {
  return (
    <div>
      {/* Basic usage */}
      <Panel
        title="Basic Panel"
        className="mb-4"
      >
        <p>This is a basic panel with just a title and content.</p>
      </Panel>
      
      {/* With description */}
      <Panel
        title="Panel with Description"
        description="This is a helpful description that appears below the title."
        className="mb-4"
      >
        <p>This panel includes a description below the title.</p>
      </Panel>
      
      {/* With right element */}
      <Panel
        title="Panel with Right Element"
        rightElement={
          <div className="flex items-center">
            <span className="mr-3 text-sm text-blue-700 dark:text-blue-300">Toggle:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
            </label>
          </div>
        }
        className="mb-4"
      >
        <p>This panel has a right element (toggle switch) next to the title.</p>
      </Panel>
      
      {/* Complex example */}
      <Panel
        title="Form Section"
        description="A collection of form inputs."
        className="mb-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default PanelExample;