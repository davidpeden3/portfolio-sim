import React from 'react';
import { DollarInput, PercentInput, IntegerInput, TextInput } from "./inputs";
import ProfileSelector from './ProfileSelector';
import { ProfileType } from './profiles';
// Re-export icons for backward compatibility
import { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon } from "./ProfileIcons";
export { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon };

// Form data type for PortfolioSimulator
export interface PortfolioFormData {
    // Investor Profile
    initialShareCount: number | string;
    initialInvestment: number | string;
    baseIncome: number | string;
    surplusForDripPercent: number | string;
    withholdTaxes: boolean;
    
    // Simulation Parameters
    simulationMonths: number | string;
    initialSharePrice: number | string;
    dividendYield4w: number | string;
    monthlyAppreciation: number | string;
    
    // Loan Settings
    includeLoan: boolean;
    loanAmount: number | string;
    annualInterestRate: number | string;
    amortizationMonths: number | string;
}

interface AssumptionsFormProps {
    formData: PortfolioFormData;
    onChange: (formData: PortfolioFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
}

// Profiles are now imported from the profiles directory
interface AssumptionsFormWrapperProps extends AssumptionsFormProps {
    selectedProfile: ProfileType;
    isCustomized: boolean;
    hasCustomProfile?: boolean;
    onProfileChange: (profile: ProfileType) => void;
}

// Main form component
const AssumptionsForm = ({ formData, onChange, onSubmit, selectedProfile, hasCustomProfile, onProfileChange }: AssumptionsFormWrapperProps) => {
    // Simplified change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        if (type === "checkbox") {
            onChange({
                ...formData,
                [name]: checked,
            });
        } else {
            // Handle input changes - specialized components handle formatting
            onChange({
                ...formData,
                [name]: value,
            });
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Investor Profile Section */}
            <div className="bg-white dark:bg-darkBlue-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-darkBlue-700 transition-colors duration-200">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-200">Investor Profile</h3>
                
                {/* Profile Selector */}
                <ProfileSelector
                    selectedProfile={selectedProfile}
                    onProfileChange={onProfileChange}
                    hasCustomProfile={hasCustomProfile}
                />
                
                {/* Profile Settings */}
                <div className="pt-4 border-t border-gray-200 dark:border-darkBlue-600 transition-colors duration-200">
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 transition-colors duration-200">Settings that define your investment approach.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TextInput
                            name="initialShareCount"
                            value={formData.initialShareCount}
                            onChange={handleChange}
                            label="Initial Share Count"
                            formatWithCommas={true}
                        />
                        
                        <DollarInput
                            name="initialInvestment"
                            value={formData.initialInvestment}
                            onChange={handleChange}
                            label="Initial Investment ($)"
                        />
                        
                        <DollarInput
                            name="baseIncome"
                            value={formData.baseIncome}
                            onChange={handleChange}
                            label="Base Income ($)"
                        />
                        
                        <div className="flex items-center mt-6">
                            <span className="mr-3 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">Withhold Taxes:</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox"
                                    name="withholdTaxes"
                                    checked={formData.withholdTaxes}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-basshead-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-darkBlue-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors duration-200 ${formData.withholdTaxes ? 'toggle-switch-on' : 'toggle-switch-off'}`}></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Simulation Parameters Section */}
            <div className="bg-white dark:bg-darkBlue-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-darkBlue-700 transition-colors duration-200">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-200">Simulation Parameters</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 transition-colors duration-200">Settings that control how the portfolio simulation runs.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <IntegerInput
                        name="simulationMonths"
                        value={formData.simulationMonths}
                        onChange={handleChange}
                        label="Simulation Duration (months)"
                    />

                    <DollarInput
                        name="initialSharePrice"
                        value={formData.initialSharePrice}
                        onChange={handleChange}
                        label="Initial Share Price ($)"
                    />
                    
                    <PercentInput
                        name="dividendYield4w"
                        value={formData.dividendYield4w}
                        onChange={handleChange}
                        label="Dividend Yield (% per 4w)"
                    />
                    
                    <PercentInput
                        name="monthlyAppreciation"
                        value={formData.monthlyAppreciation}
                        onChange={handleChange}
                        label="Monthly Appreciation (%)"
                    />
                </div>
            </div>
            
            {/* Loan Settings Section */}
            <div className="bg-white dark:bg-darkBlue-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-darkBlue-700 transition-colors duration-200">
                <div className="relative mb-4">
                    {/* Centered header and subtext */}
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">Loan Settings</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 transition-colors duration-200">Optional settings for modeling loan-based financing.</p>
                    </div>
                    
                    {/* Explicit toggle for loan inclusion - positioned absolutely at top right */}
                    <div className="absolute top-0 right-0 flex items-center">
                        <span className="mr-3 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">Include Loan:</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox"
                                name="includeLoan"
                                checked={formData.includeLoan}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-basshead-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-darkBlue-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors duration-200 ${formData.includeLoan ? 'toggle-switch-on' : 'toggle-switch-off'}`}></div>
                        </label>
                    </div>
                </div>
                
                <div className={`${!formData.includeLoan ? 'opacity-50' : ''}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DollarInput
                            name="loanAmount"
                            value={formData.loanAmount}
                            onChange={handleChange}
                            label="Loan Amount ($)"
                            disabled={!formData.includeLoan}
                        />
                        
                        <PercentInput
                            name="annualInterestRate"
                            value={formData.annualInterestRate}
                            onChange={handleChange}
                            label="Annual Interest Rate (%)"
                            disabled={!formData.includeLoan}
                        />
                        
                        <IntegerInput
                            name="amortizationMonths"
                            value={formData.amortizationMonths}
                            onChange={handleChange}
                            label="Amortization (months)"
                            disabled={!formData.includeLoan}
                        />
                        
                        <PercentInput
                            name="surplusForDripPercent"
                            value={formData.surplusForDripPercent}
                            onChange={handleChange}
                            label="DRIP to Principal (%)"
                            disabled={!formData.includeLoan}
                        />
                    </div>
                </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 dark:bg-basshead-blue-600 text-white font-bold rounded-md hover:bg-indigo-700 dark:hover:bg-basshead-blue-700 transition-colors duration-200"
                >
                    Calculate
                </button>
            </div>
        </form>
    );
};

export default AssumptionsForm;