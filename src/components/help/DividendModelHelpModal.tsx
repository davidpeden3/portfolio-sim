import React, { useState, useCallback } from 'react';
import Modal from '../common/Modal';

// Content for each model type
const modelContent = {
  'linear': {
    title: 'Linear Change ($)',
    description: 'The dividend starts at the initial dividend value and increases by the linear change amount each month. Setting the change to 0 gives a truly flat dividend.',
    inputs: 'Initial Dividend ($): The starting dividend amount for month 0\n\nChange ($): The dollar amount to add to the dividend each month'
  },
  'yieldBased': {
    title: 'Yield (%)',
    description: 'The dividend is calculated as a percentage of the current share price. You can choose between 4-week yield (common for most stocks) or yearly yield (which is divided by 13 for the 4-week periods).',
    inputs: 'Initial Dividend ($): The starting dividend amount for month 0\n\nYield Period: Select between 4 weeks or 1 year period\n\nYield (%): The percentage of share price paid as dividend for the selected period'
  },
  'uniform': {
    title: 'Uniform Distribution',
    description: 'The dividend yield varies randomly each month, with equal probability of any value between a minimum and maximum percentage. This creates a flat, even spread of randomness.',
    inputs: 'Initial Dividend ($): The starting dividend amount for month 0\n\nYield Period: Select between 4 weeks (default: 5-10%) or 1 year (default: 65-130%)\n\nMin Yield (%): The smallest possible dividend yield percentage\n\nMax Yield (%): The largest possible dividend yield percentage\n\nWhen using 1 year period, the yield is divided by 13 to get the 4-week equivalent.'
  },
  'normal': {
    title: 'Normal Distribution',
    description: 'The dividend yield varies randomly following a bell curve distribution, where values near the mean are more common than extreme values.',
    inputs: 'Initial Dividend ($): The starting dividend amount for month 0\n\nYield Period: Select between 4 weeks (default: 7.5% mean, 2.5% std dev) or 1 year (default: 97.5% mean, 32.5% std dev)\n\nMean (%): The average dividend yield percentage\n\nStd Dev (%): How much the yield can vary from the mean\n\nWhen using 1 year period, the yield is divided by 13 to get the 4-week equivalent.'
  },
  'gbm': {
    title: 'Geometric Brownian Motion (GBM)',
    description: 'Dividend follows a more realistic path where changes are influenced by previous values, with gradual drift in a direction plus random noise. This closely resembles real-world dividend changes over time.',
    inputs: 'Initial Dividend ($): The starting dividend amount for month 0\n\nDrift (%): The average direction and rate of dividend growth (e.g., 5 = tends to grow 5% annually)\n\nVolatility (%): How much the dividend can swing up or down between periods'
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
    return currentModel || 'yieldBased';
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
      <div className="text-gray-700 dark:text-gray-300 transition-colors duration-200" style={{ minHeight: '530px' }}>
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
                  value="linear"
                  checked={selectedModel === 'linear'}
                  onChange={() => setSelectedModel('linear')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">Linear Change ($)</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dividendModel"
                  value="yieldBased"
                  checked={selectedModel === 'yieldBased'}
                  onChange={() => setSelectedModel('yieldBased')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">Yield (%)</span>
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
            <div style={{ minHeight: '450px' }}>
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