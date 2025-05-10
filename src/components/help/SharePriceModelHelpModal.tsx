import React, { useState, useCallback } from 'react';
import Modal from '../common/Modal';

// Content for each model type
const modelContent = {
  'linear': {
    title: 'Linear Change',
    description: 'The price changes by the same fixed dollar amount each month — either increasing or decreasing in a straight line.',
    inputs: 'Change per month ($): How much the price goes up or down each month (e.g., +10 = rises by $10/month, -5 = drops by $5/month)'
  },
  'geometric': {
    title: 'Geometric Change',
    description: 'The price increases or decreases by a percentage each month. This means each change is based on the previous month\'s value — so the growth compounds over time.',
    inputs: 'Percent change per month (%): Enter a positive or negative percent (e.g., 2 = grows by 2% each month, -1 = shrinks by 1% each month)'
  },
  'uniform': {
    title: 'Uniform Distribution',
    description: 'The price changes randomly each month, but the changes are equally likely to be anywhere between a minimum and maximum that you specify — like rolling a fair die between two values. This creates a flat, even spread of randomness.',
    inputs: 'Minimum change (%): The smallest possible monthly change\n\nMaximum change (%): The largest possible monthly change\n\nFor example, -5 and +5 would allow any change between a 5% loss and a 5% gain each month'
  },
  'normal': {
    title: 'Normal Distribution',
    description: 'The price changes randomly from month to month, but the random changes follow a bell curve — most changes are small, with occasional bigger jumps.',
    inputs: 'Mean (%): The average amount the price tends to move each month\n\nStandard deviation (%): How much the monthly changes can vary from that average'
  },
  'gbm': {
    title: 'Geometric Brownian Motion (GBM)',
    description: 'A commonly used model for simulating real-world stock prices, where prices drift upward or downward over time with some random variation.',
    inputs: 'Drift (%): The average direction and rate of growth (e.g., 5 = tends to grow 5% annually)\n\nVolatility (%): How much the price can swing up or down'
  }
};

interface SharePriceModelHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
}

const SharePriceModelHelpModal: React.FC<SharePriceModelHelpModalProps> = ({
  isOpen,
  onClose,
  currentModel
}) => {
  // Map variable distribution types to direct model types
  const getInitialModel = useCallback(() => {
    if (currentModel === 'variable') {
      return 'uniform'; // Default to uniform if variable is selected
    }
    return currentModel || 'geometric';
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
      title="Share Price Modeling Help"
      size="lg"
    >
      <div className="text-gray-700 dark:text-gray-300 transition-colors duration-200" style={{ minHeight: '480px' }}>
        {/* Introduction */}
        <div className="mb-6">
          <p className="mb-4 text-left">
            Share price modeling allows you to simulate how the price of shares changes over time.
            Choose from different models to simulate various market behaviors.
          </p>
        </div>

        {/* Model selection and content display */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Model selection - left side */}
          <div className="w-full md:w-1/3 space-y-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-darkBlue-700 pb-4 md:pb-0 md:pr-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 text-left">Share Price Models</h3>

            {/* Radio buttons for model selection */}
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceModel"
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
                  name="priceModel"
                  value="geometric"
                  checked={selectedModel === 'geometric'}
                  onChange={() => setSelectedModel('geometric')}
                  className="mt-1"
                />
                <span className="text-gray-800 dark:text-white">Geometric Change (%)</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceModel"
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
                  name="priceModel"
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
                  name="priceModel"
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
                {modelContent[selectedModel].title}
              </h3>

              <p className="mb-4 text-left">
                {modelContent[selectedModel].description}
              </p>

              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 text-left">Inputs:</h4>
              <div
                className="whitespace-pre-line text-left"
                dangerouslySetInnerHTML={{
                  __html: modelContent[selectedModel].inputs.replace(
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

export default SharePriceModelHelpModal;