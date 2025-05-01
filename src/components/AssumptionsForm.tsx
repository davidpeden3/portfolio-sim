import { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon } from "./ProfileIcons";

// Form data type for PortfolioSimulator
export interface PortfolioFormData {
    initialShareCount: number;
    initialInvestment: number;
    initialSharePrice: number;
    dividendYield4w: number;
    monthlyAppreciation: number;
    annualInterestRate: number;
    loanAmount: number;
    amortizationMonths: number;
    baseIncome: number;
    surplusForDripPercent: number;
    withholdTaxes: boolean;
}

interface AssumptionsFormProps {
    formData: PortfolioFormData;
    onChange: (formData: PortfolioFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    saveStatus: 'saved' | 'unsaved' | 'saving';
}

// Predefined profiles for different investor demographics
export const INVESTOR_PROFILES = {
    earlyCareer: {
        name: "Early Career (20s-30s)",
        description: "For young investors focusing on growth with moderate income",
        data: {
            initialShareCount: 0,
            initialInvestment: 20000,
            initialSharePrice: 24.33,
            dividendYield4w: 5,
            monthlyAppreciation: -1,
            annualInterestRate: 7.0,
            loanAmount: 15000,
            amortizationMonths: 300, // 25 years
            baseIncome: 60000,
            surplusForDripPercent: 100, // All to DRIP for growth
            withholdTaxes: true
        }
    },
    midCareer: {
        name: "Mid-Career Professional (40s-50s)",
        description: "For established professionals with higher income and existing position",
        data: {
            initialShareCount: 7500,
            initialInvestment: 100000,
            initialSharePrice: 24.33,
            dividendYield4w: 5,
            monthlyAppreciation: -1,
            annualInterestRate: 7.5,
            loanAmount: 75000,
            amortizationMonths: 240, // 20 years
            baseIncome: 180000,
            surplusForDripPercent: 70, // Balanced approach
            withholdTaxes: true
        }
    },
    retirement: {
        name: "Near/In Retirement (60+)",
        description: "For income-focused investors with substantial holdings",
        data: {
            initialShareCount: 25000,
            initialInvestment: 50000,
            initialSharePrice: 24.33,
            dividendYield4w: 5,
            monthlyAppreciation: -1,
            annualInterestRate: 0, // No new debt
            loanAmount: 0,
            amortizationMonths: 0, // No loan
            baseIncome: 10000, // Minimal external income
            surplusForDripPercent: 30, // Focus on income
            withholdTaxes: true
        }
    },
    custom: {
        name: "Custom Profile",
        description: "Your personalized settings",
        data: {
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
            withholdTaxes: true
        }
    }
};

export type ProfileType = "earlyCareer" | "midCareer" | "retirement" | "custom";

// Profile Selector component
interface ProfileSelectorProps {
    selectedProfile: ProfileType;
    isCustomized: boolean;
    onProfileChange: (profile: ProfileType) => void;
    hasCustomProfile?: boolean; // Whether a custom profile exists, even if not currently selected
}

export const ProfileSelector = ({ 
    selectedProfile, 
    isCustomized, 
    onProfileChange, 
    hasCustomProfile = isCustomized // Default to isCustomized if not provided
}: ProfileSelectorProps) => {
    return (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Investor Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                <div 
                    onClick={() => onProfileChange("earlyCareer")}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedProfile === "earlyCareer" 
                            ? "border-indigo-500 bg-indigo-50" 
                            : "border-gray-200 hover:border-indigo-300"
                    }`}
                >
                    <div className="flex items-center mb-2">
                        <div className={`mr-3 ${selectedProfile === "earlyCareer" ? "text-indigo-500" : "text-gray-500"}`}>
                            <EarlyCareerIcon />
                        </div>
                        <h4 className="font-medium">{INVESTOR_PROFILES.earlyCareer.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{INVESTOR_PROFILES.earlyCareer.description}</p>
                </div>
                
                <div 
                    onClick={() => onProfileChange("midCareer")}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedProfile === "midCareer" 
                            ? "border-indigo-500 bg-indigo-50" 
                            : "border-gray-200 hover:border-indigo-300"
                    }`}
                >
                    <div className="flex items-center mb-2">
                        <div className={`mr-3 ${selectedProfile === "midCareer" ? "text-indigo-500" : "text-gray-500"}`}>
                            <MidCareerIcon />
                        </div>
                        <h4 className="font-medium">{INVESTOR_PROFILES.midCareer.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{INVESTOR_PROFILES.midCareer.description}</p>
                </div>
                
                <div 
                    onClick={() => onProfileChange("retirement")}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedProfile === "retirement" 
                            ? "border-indigo-500 bg-indigo-50" 
                            : "border-gray-200 hover:border-indigo-300"
                    }`}
                >
                    <div className="flex items-center mb-2">
                        <div className={`mr-3 ${selectedProfile === "retirement" ? "text-indigo-500" : "text-gray-500"}`}>
                            <RetirementIcon />
                        </div>
                        <h4 className="font-medium">{INVESTOR_PROFILES.retirement.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{INVESTOR_PROFILES.retirement.description}</p>
                </div>
                
                {hasCustomProfile && (
                    <div 
                        onClick={() => onProfileChange("custom")}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedProfile === "custom" 
                                ? "border-indigo-500 bg-indigo-50" 
                                : "border-gray-200 hover:border-indigo-300"
                        }`}
                    >
                        <div className="flex items-center mb-2">
                            <div className={`mr-3 ${selectedProfile === "custom" ? "text-indigo-500" : "text-gray-500"}`}>
                                <CustomIcon />
                            </div>
                            <h4 className="font-medium">{INVESTOR_PROFILES.custom.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{INVESTOR_PROFILES.custom.description}</p>
                    </div>
                )}
            </div>
            
        </div>
    );
};

// Main form component
const AssumptionsForm = ({ formData, onChange, onSubmit, saveStatus }: AssumptionsFormProps) => {
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
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <div className="text-right text-sm text-gray-500 mt-4">
                    {saveStatus === 'saving' && <span className="italic">Saving...</span>}
                    {saveStatus === 'saved' && <span className="text-green-600">✓ Saved</span>}
                    {saveStatus === 'unsaved' && <span className="text-yellow-600">Unsaved changes</span>}
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center mt-6 space-x-4">
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