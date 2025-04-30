import { useState, useEffect } from "react";
import { calculatePortfolio } from "../calculator/PortfolioCalculator";
import { AmortizationEntry } from "../models/AmortizationEntry";
import { CalculatedSummary } from "../models/CalculatedSummary";
import PortfolioChart from "./PortfolioChart";
import AmortizationTable from "./AmortizationTable";
import CalculatedSummaryDisplay from "./CalculatedSummary";

// Default values if nothing is in localStorage
const DEFAULT_FORM_DATA = {
  initialShareCount: 0,
  initialInvestment: 200000,
  initialSharePrice: 24.33,
  dividendYield4w: 5,
  monthlyAppreciation: -1,
  annualInterestRate: 7.5,
  loanAmount: 200000,
  amortizationMonths: 240,
  baseIncome: 100000,
  surplusForDripPercent: 75,
  withholdTaxes: true,
};

// Local storage key
const STORAGE_KEY = 'portfolio-simulator-settings';

export function PortfolioSimulator() {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [results, setResults] = useState<{
    summary: CalculatedSummary;
    amortization: AmortizationEntry[];
  } | null>(null);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setFormData(parsedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }, []);

  // Save settings to localStorage when form data changes (with debounce)
  useEffect(() => {
    const saveSettings = () => {
      try {
        setSaveStatus('saving');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        setSaveStatus('saved');
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
        setSaveStatus('unsaved');
      }
    };

    // Set to unsaved immediately when form data changes
    setSaveStatus('unsaved');
    
    // Debounce the save operation to avoid excessive localStorage writes
    const timerId = setTimeout(saveSettings, 1000);
    
    return () => clearTimeout(timerId); // Clean up timer on unmount or before next effect run
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      // For numeric inputs, handle empty string and convert to number
      // Default to 0 if parsing fails or input is empty
      const numValue = value === "" ? 0 : parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map form data to assumptions
    const assumptions = {
      initialShareCount: formData.initialShareCount,
      initialInvestment: formData.initialInvestment,
      initialSharePrice: formData.initialSharePrice,
      dividendYieldPer4wPercent: formData.dividendYield4w,
      monthlyAppreciationPercent: formData.monthlyAppreciation,
      loanAmount: formData.loanAmount,
      annualInterestRatePercent: formData.annualInterestRate,
      amortizationMonths: formData.amortizationMonths,
      baseIncome: formData.baseIncome,
      surplusForDripToPrincipalPercent: formData.surplusForDripPercent,
      withholdTaxes: formData.withholdTaxes,
    };
    
    // Calculate results
    const calculationResults = calculatePortfolio(assumptions);
    setResults(calculationResults);
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all values to default settings?')) {
      setFormData(DEFAULT_FORM_DATA);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Portfolio Simulator</h1>
        
        <div className="text-center mb-6 text-sm text-gray-500">
          Your inputs are automatically saved to your browser's local storage.
          {saveStatus === 'saving' && <span className="ml-2 italic">Saving...</span>}
          {saveStatus === 'saved' && <span className="ml-2 text-green-600">✓ Saved</span>}
          {saveStatus === 'unsaved' && <span className="ml-2 text-yellow-600">Unsaved changes</span>}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Share Count</label>
              <input
                type="number"
                name="initialShareCount"
                value={formData.initialShareCount}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Investment</label>
              <input
                type="number"
                name="initialInvestment"
                value={formData.initialInvestment}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dividend Yield per 4w (%)</label>
              <input
                type="number"
                name="dividendYield4w"
                value={formData.dividendYield4w}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amortization Months</label>
              <input
                type="number"
                name="amortizationMonths"
                value={formData.amortizationMonths}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Surplus for DRIP to Principal (%)</label>
              <input
                type="number"
                name="surplusForDripPercent"
                value={formData.surplusForDripPercent}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Share Price</label>
              <input
                type="number"
                name="initialSharePrice"
                value={formData.initialSharePrice}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Appreciation (%)</label>
              <input
                type="number"
                name="monthlyAppreciation"
                value={formData.monthlyAppreciation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
              <input
                type="number"
                name="annualInterestRate"
                value={formData.annualInterestRate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Base Income</label>
              <input
                type="number"
                name="baseIncome"
                value={formData.baseIncome}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center mt-2">
              <input
                id="withholdTaxes"
                name="withholdTaxes"
                type="checkbox"
                checked={formData.withholdTaxes}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="withholdTaxes" className="ml-2 block text-sm text-gray-700">
                Withhold Taxes
              </label>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-center mt-6 space-x-4">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition"
            >
              Calculate
            </button>
            <button
              type="button"
              onClick={resetToDefaults}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
            >
              Reset to Defaults
            </button>
          </div>
        </form>

        {results && (
          <div className="mt-8">
            <div className="border-t pt-8">
              <CalculatedSummaryDisplay summary={results.summary} />
              <PortfolioChart amortization={results.amortization} />
              <AmortizationTable amortization={results.amortization} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}