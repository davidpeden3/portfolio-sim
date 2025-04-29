import { useState } from "react";

export function PortfolioSimulator() {
  const [formData, setFormData] = useState({
    initialInvestment: 200000,
    initialSharePrice: 22.5,
    dividendYield4w: 5,
    monthlyAppreciation: -1,
    annualInterestRate: 7.5,
    loanAmount: 200000,
    amortizationMonths: 240,
    baseIncome: 100000,
    surplusForDripPercent: 75,
    withholdTaxes: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger calculation here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold underline">
            Hello world!
        </h1>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Portfolio Simulator</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
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

          <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition"
            >
              Calculate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}