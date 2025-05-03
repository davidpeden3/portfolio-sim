import { useEffect } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  // Add ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Add event listener when the modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    // Clean up the event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Portfolio Simulator Guide</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="prose prose-indigo lg:prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-indigo-800 border-b pb-2 mb-4 text-center">Overview</h2>
            <p className="text-gray-700 leading-relaxed text-center">
              The $MSTY Portfolio Simulator helps you model the long-term growth of a portfolio 
              invested in $MSTY, accounting for regular dividend payments, dividend reinvestment (DRIP), 
              taxes, and loan financing scenarios.
            </p>

            <h2 className="text-2xl font-bold text-indigo-800 border-b pb-2 mt-8 mb-4 text-center">What This Tool Can Help You With</h2>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• Calculate potential returns from $MSTY investments over time</li>
              <li>• Model how loans can be used to enhance your initial position</li>
              <li>• Visualize the effect of dividend reinvestment (DRIP)</li>
              <li>• Account for taxes on dividend income</li>
              <li>• See when a loan would be paid off and how your net portfolio value grows</li>
              <li>• Understand how different parameters affect your investment outcomes</li>
            </ul>

            <h2 className="text-2xl font-bold text-indigo-800 border-b pb-2 mt-8 mb-4 text-center">Inputs Explained</h2>
            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Investment Parameters</h3>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• <span className="font-semibold">Initial Share Count</span>: Number of $MSTY shares you already own (not purchased with the loan)</li>
              <li>• <span className="font-semibold">Initial Investment</span>: Dollar amount you're investing now (will be used to purchase shares at the Initial Share Price)</li>
              <li>• <span className="font-semibold">Initial Share Price</span>: Current price per share of $MSTY</li>
              <li>• <span className="font-semibold">Dividend Yield per 4w (%)</span>: The percentage yield for each 4-week dividend period</li>
              <li>• <span className="font-semibold">Monthly Appreciation (%)</span>: Expected monthly share price change (can be negative for a conservative model)</li>
            </ul>

            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Loan Parameters</h3>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• <span className="font-semibold">Loan Amount</span>: Size of loan used to purchase additional shares</li>
              <li>• <span className="font-semibold">Annual Interest Rate (%)</span>: The loan's annual interest rate</li>
              <li>• <span className="font-semibold">Amortization Months</span>: Total number of months to pay off the loan</li>
              <li>• <span className="font-semibold">Surplus for DRIP to Principal (%)</span>: Percentage of dividend income (after taxes) that goes to paying down loan principal rather than purchasing more shares</li>
            </ul>

            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Tax Withholding Parameters</h3>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• <span className="font-semibold">Withholding Strategy</span>: Choose between no withholding, monthly withholding, or quarterly withholding</li>
              <li>• <span className="font-semibold">Withholding Method</span>: Select how tax amounts are calculated:
                <ul className="list-none space-y-1 mt-1">
                  <li>- <em>Tax Bracket Based</em>: Calculates taxes based on your income tax bracket</li>
                  <li>- <em>Fixed Amount</em>: Withholds a specific dollar amount each period</li>
                  <li>- <em>Fixed Percentage</em>: Withholds a fixed percentage of dividend income</li>
                </ul>
              </li>
              <li>• <span className="font-semibold">Base Income</span>: Your annual income (used for tax bracket calculations)</li>
              <li>• <span className="font-semibold">Fixed Amount</span>: Dollar amount withheld per period when using the fixed amount method</li>
              <li>• <span className="font-semibold">Fixed Percentage</span>: Percentage of dividends withheld when using the fixed percentage method</li>
            </ul>

            <h2 className="text-2xl font-bold text-indigo-800 border-b pb-2 mt-8 mb-4">How to Use the Simulator</h2>
            <ol className="list-none space-y-2 my-4 text-center">
              <li>1. <span className="font-semibold">Enter Your Parameters</span>: Fill out the form with your investment details and assumptions</li>
              <li>2. <span className="font-semibold">Calculate</span>: Click the "Calculate" button to run the simulation</li>
              <li>3. <span className="font-semibold">View Results</span>: See the summary, charts, and detailed amortization tables</li>
            </ol>

            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Your Settings Are Saved</h3>
            <p className="text-gray-700 leading-relaxed text-center">
              Your inputs are automatically saved to your browser's local storage. This means:
            </p>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• Your settings will still be there if you close the browser and come back later</li>
              <li>• You can try different scenarios without losing your baseline configuration</li>
              <li>• Use the "Reset to Defaults" button if you want to start fresh</li>
            </ul>

            <h2 className="text-2xl font-bold text-indigo-800 border-b pb-2 mt-8 mb-4 text-center">Understanding the Results</h2>
            
            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Dynamic Display</h3>
            <p className="text-gray-700 leading-relaxed text-center">
              The results adapt to your settings:
            </p>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• Loan-related columns are hidden when "Include Loan" is turned off</li>
              <li>• Tax-related columns are hidden when "Withhold Taxes" is turned off</li>
            </ul>

            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Summary Tab</h3>
            <p className="text-gray-700 leading-relaxed text-center">The summary shows your initial share count, annualized dividend yield, monthly loan payment, and when the loan will be paid off.</p>

            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Charts</h3>
            <p className="text-gray-700 leading-relaxed text-center">The charts visualize your portfolio growth in two ways:</p>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• <span className="font-semibold">Until Loan Payoff</span>: Shows portfolio value, loan principal, and net portfolio value until the loan is paid off</li>
              <li>• <span className="font-semibold">Full Amortization</span>: Shows net portfolio value for the entire amortization period</li>
            </ul>

            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Detailed Tables</h3>
            <p className="text-gray-700 leading-relaxed text-center">The amortization schedule provides a detailed breakdown of what happens each month or year:</p>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• How dividends accumulate and are distributed</li>
              <li>• Tax implications of dividend income</li>
              <li>• Loan payment progress</li>
              <li>• New shares acquired through DRIP</li>
              <li>• Overall portfolio valuation</li>
            </ul>

            <p className="text-gray-700 leading-relaxed text-center">Hover over rows and columns in the table to highlight data and track values more easily.</p>
            
            <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3 text-center">Data Export</h3>
            <p className="text-gray-700 leading-relaxed text-center">
              You can export the amortization data to CSV format for further analysis:
            </p>
            <ul className="list-none space-y-2 my-4 text-center">
              <li>• Click the "Export CSV" button in the top-right corner of the table</li>
              <li>• The exported file will reflect the current tab selection (Yearly Summary or Full Detail)</li>
              <li>• Only visible columns will be included in the export (based on Loan and Tax settings)</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-8 mx-auto max-w-3xl">
              <h2 className="text-lg font-bold text-yellow-800 text-center">Disclaimer</h2>
              <p className="text-yellow-700 text-center">
                This simulator provides projections based on constant growth rates and dividend yields. 
                Actual results may vary due to market conditions, changes in dividend policies, interest rates, 
                or tax laws. This tool is for educational purposes only and should not be considered financial advice.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50">
          <div className="text-sm text-gray-500 mr-auto flex items-center">
            <kbd className="px-2 py-1 bg-gray-200 rounded shadow-sm text-xs mr-1">ESC</kbd> to close
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;