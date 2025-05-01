import { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon } from "./ProfileIcons";
// Re-export these icons for use in other components
export { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon };

// Form data type for PortfolioSimulator
export interface PortfolioFormData {
    // Investor Profile
    initialShareCount: number;
    initialInvestment: number;
    baseIncome: number;
    surplusForDripPercent: number;
    withholdTaxes: boolean;
    
    // Simulation Parameters
    simulationMonths: number;
    initialSharePrice: number;
    dividendYield4w: number;
    monthlyAppreciation: number;
    
    // Loan Settings
    includeLoan: boolean;
    loanAmount: number;
    annualInterestRate: number;
    amortizationMonths: number;
}

interface AssumptionsFormProps {
    formData: PortfolioFormData;
    onChange: (formData: PortfolioFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
}

// Predefined profiles for different investor demographics
export const INVESTOR_PROFILES = {
    earlyCareer: {
        name: "Early Career (20s-30s)",
        description: "For young investors focusing on growth with moderate income",
        data: {
            // Investor Profile
            initialShareCount: 0,
            initialInvestment: 20000,
            baseIncome: 60000,
            surplusForDripPercent: 100, // All to DRIP for growth
            withholdTaxes: true,
            
            // Simulation Parameters
            simulationMonths: 300, // 25 years
            initialSharePrice: 24.33,
            dividendYield4w: 5,
            monthlyAppreciation: -1,
            
            // Loan Settings
            includeLoan: true,
            loanAmount: 15000,
            annualInterestRate: 7.0,
            amortizationMonths: 300 // 25 years
        }
    },
    midCareer: {
        name: "Mid-Career Professional (40s-50s)",
        description: "For established professionals with higher income and existing position",
        data: {
            // Investor Profile
            initialShareCount: 7500,
            initialInvestment: 100000,
            baseIncome: 180000,
            surplusForDripPercent: 70, // Balanced approach
            withholdTaxes: true,
            
            // Simulation Parameters
            simulationMonths: 240, // 20 years
            initialSharePrice: 24.33,
            dividendYield4w: 5,
            monthlyAppreciation: -1,
            
            // Loan Settings
            includeLoan: true,
            loanAmount: 75000,
            annualInterestRate: 7.5,
            amortizationMonths: 240 // 20 years
        }
    },
    retirement: {
        name: "Near/In Retirement (60+)",
        description: "For income-focused investors with substantial holdings",
        data: {
            // Investor Profile
            initialShareCount: 25000,
            initialInvestment: 50000,
            baseIncome: 10000, // Minimal external income
            surplusForDripPercent: 30, // Focus on income
            withholdTaxes: true,
            
            // Simulation Parameters
            simulationMonths: 120, // 10 years
            initialSharePrice: 24.33,
            dividendYield4w: 5,
            monthlyAppreciation: -1,
            
            // Loan Settings
            includeLoan: false,
            loanAmount: 0,
            annualInterestRate: 0,
            amortizationMonths: 120 // 10 years but loan is excluded
        }
    },
    custom: {
        name: "Custom Profile",
        description: "Your personalized settings",
        data: {
            // Investor Profile
            initialShareCount: 0,
            initialInvestment: 200000,
            baseIncome: 100000,
            surplusForDripPercent: 75,
            withholdTaxes: true,
            
            // Simulation Parameters
            simulationMonths: 240, // 20 years
            initialSharePrice: 24.33,
            dividendYield4w: 5,
            monthlyAppreciation: -1,
            
            // Loan Settings
            includeLoan: true,
            loanAmount: 200000,
            annualInterestRate: 7.5,
            amortizationMonths: 240 // 20 years
        }
    }
};

export type ProfileType = "earlyCareer" | "midCareer" | "retirement" | "custom";


interface AssumptionsFormWrapperProps extends AssumptionsFormProps {
    selectedProfile: ProfileType;
    isCustomized: boolean;
    hasCustomProfile?: boolean;
    onProfileChange: (profile: ProfileType) => void;
}

// Main form component
const AssumptionsForm = ({ formData, onChange, onSubmit, selectedProfile, hasCustomProfile, onProfileChange }: AssumptionsFormWrapperProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        if (type === "checkbox") {
            onChange({
                ...formData,
                [name]: checked,
            });
        } else {
            // For numeric inputs, handle empty string and convert to number
            const numValue = value === "" ? 0 : parseFloat(value);
            onChange({
                ...formData,
                [name]: isNaN(numValue) ? 0 : numValue,
            });
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Investor Profile Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Investor Profile</h3>
                
                {/* Profile Selector */}
                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-3">Select a predefined profile or customize your own:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div 
                            onClick={() => onProfileChange("earlyCareer")}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedProfile === "earlyCareer" 
                                    ? "border-indigo-500 bg-indigo-50" 
                                    : "border-gray-200 hover:border-indigo-300"
                            }`}
                        >
                            <div className="flex items-center mb-1">
                                <div className={`mr-2 ${selectedProfile === "earlyCareer" ? "text-indigo-500" : "text-gray-500"}`}>
                                    <EarlyCareerIcon />
                                </div>
                                <h4 className="font-medium text-sm">{INVESTOR_PROFILES.earlyCareer.name}</h4>
                            </div>
                            <p className="text-xs text-gray-600">{INVESTOR_PROFILES.earlyCareer.description}</p>
                        </div>
                        
                        <div 
                            onClick={() => onProfileChange("midCareer")}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedProfile === "midCareer" 
                                    ? "border-indigo-500 bg-indigo-50" 
                                    : "border-gray-200 hover:border-indigo-300"
                            }`}
                        >
                            <div className="flex items-center mb-1">
                                <div className={`mr-2 ${selectedProfile === "midCareer" ? "text-indigo-500" : "text-gray-500"}`}>
                                    <MidCareerIcon />
                                </div>
                                <h4 className="font-medium text-sm">{INVESTOR_PROFILES.midCareer.name}</h4>
                            </div>
                            <p className="text-xs text-gray-600">{INVESTOR_PROFILES.midCareer.description}</p>
                        </div>
                        
                        <div 
                            onClick={() => onProfileChange("retirement")}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedProfile === "retirement" 
                                    ? "border-indigo-500 bg-indigo-50" 
                                    : "border-gray-200 hover:border-indigo-300"
                            }`}
                        >
                            <div className="flex items-center mb-1">
                                <div className={`mr-2 ${selectedProfile === "retirement" ? "text-indigo-500" : "text-gray-500"}`}>
                                    <RetirementIcon />
                                </div>
                                <h4 className="font-medium text-sm">{INVESTOR_PROFILES.retirement.name}</h4>
                            </div>
                            <p className="text-xs text-gray-600">{INVESTOR_PROFILES.retirement.description}</p>
                        </div>
                        
                        {hasCustomProfile && (
                            <div 
                                onClick={() => onProfileChange("custom")}
                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                    selectedProfile === "custom" 
                                        ? "border-indigo-500 bg-indigo-50" 
                                        : "border-gray-200 hover:border-indigo-300"
                                }`}
                            >
                                <div className="flex items-center mb-1">
                                    <div className={`mr-2 ${selectedProfile === "custom" ? "text-indigo-500" : "text-gray-500"}`}>
                                        <CustomIcon />
                                    </div>
                                    <h4 className="font-medium text-sm">{INVESTOR_PROFILES.custom.name}</h4>
                                </div>
                                <p className="text-xs text-gray-600">{INVESTOR_PROFILES.custom.description}</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Profile Settings */}
                <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Core settings that define your investment approach:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700">Base Income</label>
                            <input
                                type="number"
                                name="baseIncome"
                                value={formData.baseIncome}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        <div className="flex items-center mt-6">
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
                </div>
            </div>
            
            {/* Simulation Parameters Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Simulation Parameters</h3>
                <p className="text-sm text-gray-500 mb-4">Settings that control how the portfolio simulation runs.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Simulation Duration</label>
                        <input
                            type="number"
                            name="simulationMonths"
                            value={formData.simulationMonths}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">months</p>
                    </div>

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
                        <label className="block text-sm font-medium text-gray-700">Dividend Yield</label>
                        <input
                            type="number"
                            name="dividendYield4w"
                            value={formData.dividendYield4w}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">% per 4w</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Monthly Appreciation</label>
                        <input
                            type="number"
                            name="monthlyAppreciation"
                            value={formData.monthlyAppreciation}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">%</p>
                    </div>
                </div>
            </div>
            
            {/* Loan Settings Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Loan Settings</h3>
                        <p className="text-sm text-gray-500 mt-1">Optional settings for modeling loan-based financing.</p>
                    </div>
                    
                    {/* Explicit toggle for loan inclusion */}
                    <div className="flex items-center">
                        <span className="mr-3 text-sm text-gray-700">Include Loan:</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox"
                                name="includeLoan"
                                checked={formData.includeLoan}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
                
                <div className={`${!formData.includeLoan ? 'opacity-50' : ''}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
                            <input
                                type="number"
                                name="loanAmount"
                                value={formData.loanAmount}
                                onChange={handleChange}
                                disabled={!formData.includeLoan}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Annual Interest Rate</label>
                            <input
                                type="number"
                                name="annualInterestRate"
                                value={formData.annualInterestRate}
                                onChange={handleChange}
                                disabled={!formData.includeLoan}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">%</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amortization</label>
                            <input
                                type="number"
                                name="amortizationMonths"
                                value={formData.amortizationMonths}
                                onChange={handleChange}
                                disabled={!formData.includeLoan}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">months</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">DRIP to Principal</label>
                            <input
                                type="number"
                                name="surplusForDripPercent"
                                value={formData.surplusForDripPercent}
                                onChange={handleChange}
                                disabled={!formData.includeLoan}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">%</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition"
                >
                    Calculate
                </button>
            </div>
        </form>
    );
};

export default AssumptionsForm;