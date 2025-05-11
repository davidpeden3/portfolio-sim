import React, { useState, useCallback } from 'react';
import Modal from '../common/Modal';

// Content for each model type
const modelContent = {
  'flatAmount': {
    title: 'Flat Amount ($)',
    description: 'The dividend is set to a fixed dollar amount regardless of share price. Represents a steady, predictable dividend.',
    inputs: 'Dividend Amount ($): The fixed dollar amount of dividend per share, per 4-week period'
  },
  'yieldBased4w': {
    title: '4w Dividend Yield (%)',
    description: 'The dividend is calculated as a percentage of the current share price, based on a 4-week yield. Most typical for real-world dividend stocks.',
    inputs: 'Dividend Yield (%): The percentage of share price paid as dividend each 4-week period'
  },
  'yieldBasedYearly': {
    title: 'Yearly Dividend Yield (%)',
    description: 'The dividend is calculated as a percentage of the current share price, based on yearly yield (which is divided by 13 for the 4-week periods).',
    inputs: 'Yearly Yield (%): The annual percentage yield, which will be divided by 13 to calculate each 4-week dividend'
  },
  'uniform': {
    title: 'Uniform Distribution',
    description: 'The dividend yield varies randomly each month, with equal probability of any value between a minimum and maximum percentage. This creates a flat, even spread of randomness.',
    inputs: 'Minimum Yield (%): The smallest possible dividend yield percentage\n\nMaximum Yield (%): The largest possible dividend yield percentage\n\nFor example, 1% and 3% would produce dividends ranging from 1% to 3% of the share price'
  },
  'normal': {
    title: 'Normal Distribution',
    description: 'The dividend yield varies randomly following a bell curve distribution, where values near the mean are more common than extreme values.',
    inputs: 'Mean Yield (%): The average dividend yield percentage\n\nStandard Deviation (%): How much the yield can vary from the mean'
  },
  'gbm': {
    title: 'Geometric Brownian Motion (GBM)',
    description: 'Dividend follows a more realistic path where changes are influenced by previous values, with gradual drift in a direction plus random noise. This closely resembles real-world dividend changes over time.',
    inputs: 'Drift (%): The average direction and rate of dividend growth (e.g., 5 = tends to grow 5% annually)\n\nVolatility (%): How much the dividend can swing up or down between periods\n\nInitial Method: How to set the starting dividend (either Flat Amount or Yearly Yield)\n\nInitial Amount ($): If using flat amount, the fixed dollar amount for the first dividend\n\nYearly Yield (%): If using yield-based, the annual percentage yield to calculate the first dividend'
  }
};

interface DividendModelHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
}

const DividendModelHelpModal: React.FC<DividendModelHelpModalProps> = ({
  isOpen,
  onClose,
  currentModel
}) => {
  // Map model types to the correct content key
  const getInitialModel = useCallback(() => {
    if (currentModel === 'yieldBased') {
      // Default to 4w yield-based display
      return 'yieldBased4w';
    }
    
    if (currentModel === 'variable') {
      // Default to uniform distribution
      return 'uniform';
    }
    
    return currentModel || 'yieldBased4w';
  }, [currentModel]);

  // State to track the selected model in the modal
  const [selectedModel, setSelectedModel] = useState(getInitialModel());

  // When the modal opens, set the initial selection based on props
  React.useEffect(() => {
    if (isOpen) {
      setSelectedModel(getInitialModel());
    }
  }, [isOpen, currentModel, getInitialModel]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dividend Modeling Help"
      size="lg"
    >
      <div className="text-gray-700 dark:text-gray-300 transition-colors duration-200" style={{ minHeight: '480px' }}>
        {/* Introduction */}
        <div className="mb-6">
          <p className="mb-4 text-left">
            Dividend modeling allows you to simulate how companies pay dividends over time.
            Choose from different models to simulate various dividend policies.
          </p>
        </div>

        {/* Model selection and content display */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Model selection - left side */}
          <div className="w-full md:w-1/3 space-y-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-darkBlue-700 pb-4 md:pb-0 md:pr-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 text-left">Dividend Models</h3>
            
            {/* Radio buttons for model selection */}
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dividendModel"
                  value="flatAmount"
                  checked={selectedModel === 'flatAmount'}
                  onChange={() => setSelectedModel('flatAmount')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">Flat Amount ($)</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dividendModel"
                  value="yieldBased4w"
                  checked={selectedModel === 'yieldBased4w'}
                  onChange={() => setSelectedModel('yieldBased4w')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">4w Dividend Yield (%)</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dividendModel"
                  value="yieldBasedYearly"
                  checked={selectedModel === 'yieldBasedYearly'}
                  onChange={() => setSelectedModel('yieldBasedYearly')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">Yearly Dividend Yield (%)</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dividendModel"
                  value="uniform"
                  checked={selectedModel === 'uniform'}
                  onChange={() => setSelectedModel('uniform')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">Uniform Distribution</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dividendModel"
                  value="normal"
                  checked={selectedModel === 'normal'}
                  onChange={() => setSelectedModel('normal')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">Normal Distribution</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dividendModel"
                  value="gbm"
                  checked={selectedModel === 'gbm'}
                  onChange={() => setSelectedModel('gbm')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">Geometric Brownian Motion</span>
              </label>
            </div>
          </div>

          {/* Model details - right side */}
          <div className="w-full md:w-2/3 text-left">
            <div style={{ minHeight: '300px' }}>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 text-left">
                {modelContent[selectedModel as keyof typeof modelContent].title}
              </h3>

              <p className="mb-4 text-left">
                {modelContent[selectedModel as keyof typeof modelContent].description}
              </p>

              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 text-left">Inputs:</h4>
              <div 
                className="whitespace-pre-line text-left"
                dangerouslySetInnerHTML={{
                  __html: modelContent[selectedModel as keyof typeof modelContent].inputs.replace(
                    /^([^:]+):/gm, 
                    '<strong>$1</strong>:'
                  )
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DividendModelHelpModal;