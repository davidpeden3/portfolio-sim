import React, { useState } from 'react';
import { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon } from "./ProfileIcons";
import { formatDisplayValue } from "../utils/formatUtils";
// Re-export these icons for use in other components
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
    // Track which fields are currently being edited
    const [editingFields, setEditingFields] = useState<{[key: string]: boolean}>({});
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const monthFields = ['simulationMonths', 'amortizationMonths'];
        const dollarFields = ['initialInvestment', 'baseIncome', 'loanAmount', 'initialSharePrice'];
        const percentFields = ['dividendYield4w', 'monthlyAppreciation', 'annualInterestRate', 'surplusForDripPercent'];
        
        if (type === "checkbox") {
            onChange({
                ...formData,
                [name]: checked,
            });
        } else {
            // First clean the input by removing currency and percentage symbols
            let cleanValue = value;
            if (dollarFields.includes(name)) {
                cleanValue = cleanValue.replace(/\$/g, ''); // Remove $ symbol
            }
            if (percentFields.includes(name)) {
                cleanValue = cleanValue.replace(/%/g, ''); // Remove % symbol
            }
            // Then remove commas
            cleanValue = cleanValue.replace(/,/g, '');
            
            // Special handling for month fields - always round to integers
            if (monthFields.includes(name)) {
                // Handle empty strings
                if (cleanValue === "") {
                    onChange({
                        ...formData,
                        [name]: cleanValue,
                    });
                    return;
                }
                
                // If it's a valid number, immediately round to integer
                const numValue = parseFloat(cleanValue);
                if (!isNaN(numValue)) {
                    // For month fields, never keep decimals, instantly convert to integer
                    onChange({
                        ...formData,
                        [name]: Math.round(numValue),
                    });
                } else {
                    onChange({
                        ...formData,
                        [name]: cleanValue,
                    });
                }
                return;
            }
            
            // For non-month fields, we need to handle decimal points specially
            
            // If the last character is a decimal point, preserve it as a string
            // This ensures the user can type a decimal point
            if (cleanValue.endsWith('.')) {
                onChange({
                    ...formData,
                    [name]: cleanValue,
                });
                return;
            }
            
            // If the value contains a decimal point followed by digits
            // Ensure we preserve the exact string format during editing
            if (cleanValue.includes('.')) {
                // If it's a valid number, we'll convert it, otherwise keep as is
                const numValue = parseFloat(cleanValue);
                if (!isNaN(numValue)) {
                    onChange({
                        ...formData,
                        [name]: cleanValue, // Keep as string during editing to preserve decimals
                    });
                } else {
                    onChange({
                        ...formData,
                        [name]: cleanValue,
                    });
                }
                return;
            }
            
            // Keep empty strings as empty strings, don't convert to 0 immediately
            if (cleanValue === "") {
                onChange({
                    ...formData,
                    [name]: cleanValue,
                });
            } else {
                // Convert valid numbers
                const numValue = parseFloat(cleanValue);
                if (!isNaN(numValue)) {
                    onChange({
                        ...formData,
                        [name]: numValue,
                    });
                } else {
                    // For invalid input, just keep the value as is
                    onChange({
                        ...formData,
                        [name]: cleanValue,
                    });
                }
            }
        }
    };
    
    // Handle focus on input fields
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setEditingFields({...editingFields, [name]: true});
    };
    
    // Handle blur on input fields
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setEditingFields({...editingFields, [name]: false});
        
        // Convert string values back to numbers on blur
        const currentValue = formData[name as keyof typeof formData];
        
        if (typeof currentValue === 'string' && currentValue !== '') {
            // Check if this is a month field that should be rounded to integer
            const monthFields = ['simulationMonths', 'amortizationMonths'];
            
            if (monthFields.includes(name)) {
                // For month fields, convert to integer (rounded)
                const numValue = parseFloat(currentValue);
                if (!isNaN(numValue)) {
                    onChange({
                        ...formData,
                        [name]: Math.round(numValue)
                    });
                }
            } else {
                // For other numeric fields, keep decimal precision
                const numValue = parseFloat(currentValue);
                if (!isNaN(numValue)) {
                    onChange({
                        ...formData,
                        [name]: numValue
                    });
                }
            }
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Investor Profile Section */}
            <div className="bg-white dark:bg-darkBlue-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-darkBlue-700 transition-colors duration-200">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-200">Investor Profile</h3>
                
                {/* Profile Selector */}
                <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 transition-colors duration-200">Select a predefined profile or customize your own:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div 
                            onClick={() => onProfileChange("earlyCareer")}
                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedProfile === "earlyCareer" 
                                    ? "border-indigo-500 dark:border-basshead-blue-500 bg-indigo-50 dark:bg-darkBlue-700 shadow-sm" 
                                    : "border-gray-200 dark:border-darkBlue-600 hover:border-indigo-300 dark:hover:border-basshead-blue-600 hover:shadow-sm"
                            }`}
                        >
                            <div className="flex items-center mb-1">
                                <div className={`mr-2 ${selectedProfile === "earlyCareer" ? "text-indigo-600 dark:text-basshead-blue-500" : "text-gray-500 dark:text-gray-400"} transition-colors duration-200`}>
                                    <EarlyCareerIcon />
                                </div>
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white transition-colors duration-200">{INVESTOR_PROFILES.earlyCareer.name}</h4>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 transition-colors duration-200">{INVESTOR_PROFILES.earlyCareer.description}</p>
                        </div>
                        
                        <div 
                            onClick={() => onProfileChange("midCareer")}
                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedProfile === "midCareer" 
                                    ? "border-indigo-500 dark:border-basshead-blue-500 bg-indigo-50 dark:bg-darkBlue-700 shadow-sm" 
                                    : "border-gray-200 dark:border-darkBlue-600 hover:border-indigo-300 dark:hover:border-basshead-blue-600 hover:shadow-sm"
                            }`}
                        >
                            <div className="flex items-center mb-1">
                                <div className={`mr-2 ${selectedProfile === "midCareer" ? "text-indigo-600 dark:text-basshead-blue-500" : "text-gray-500 dark:text-gray-400"} transition-colors duration-200`}>
                                    <MidCareerIcon />
                                </div>
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white transition-colors duration-200">{INVESTOR_PROFILES.midCareer.name}</h4>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 transition-colors duration-200">{INVESTOR_PROFILES.midCareer.description}</p>
                        </div>
                        
                        <div 
                            onClick={() => onProfileChange("retirement")}
                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedProfile === "retirement" 
                                    ? "border-indigo-500 dark:border-basshead-blue-500 bg-indigo-50 dark:bg-darkBlue-700 shadow-sm" 
                                    : "border-gray-200 dark:border-darkBlue-600 hover:border-indigo-300 dark:hover:border-basshead-blue-600 hover:shadow-sm"
                            }`}
                        >
                            <div className="flex items-center mb-1">
                                <div className={`mr-2 ${selectedProfile === "retirement" ? "text-indigo-600 dark:text-basshead-blue-500" : "text-gray-500 dark:text-gray-400"} transition-colors duration-200`}>
                                    <RetirementIcon />
                                </div>
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white transition-colors duration-200">{INVESTOR_PROFILES.retirement.name}</h4>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 transition-colors duration-200">{INVESTOR_PROFILES.retirement.description}</p>
                        </div>
                        
                        {hasCustomProfile && (
                            <div 
                                onClick={() => onProfileChange("custom")}
                                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                    selectedProfile === "custom" 
                                        ? "border-indigo-500 dark:border-basshead-blue-500 bg-indigo-50 dark:bg-darkBlue-700 shadow-sm" 
                                        : "border-gray-200 dark:border-darkBlue-600 hover:border-indigo-300 dark:hover:border-basshead-blue-600 hover:shadow-sm"
                                }`}
                            >
                                <div className="flex items-center mb-1">
                                    <div className={`mr-2 ${selectedProfile === "custom" ? "text-indigo-600 dark:text-basshead-blue-500" : "text-gray-500 dark:text-gray-400"} transition-colors duration-200`}>
                                        <CustomIcon />
                                    </div>
                                    <h4 className="font-medium text-sm text-gray-900 dark:text-white transition-colors duration-200">{INVESTOR_PROFILES.custom.name}</h4>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 transition-colors duration-200">{INVESTOR_PROFILES.custom.description}</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Profile Settings */}
                <div className="pt-4 border-t border-gray-200 dark:border-darkBlue-600 transition-colors duration-200">
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 transition-colors duration-200">Core settings that define your investment approach:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Initial Share Count</label>
                            <input
                                type="text"
                                name="initialShareCount"
                                value={!editingFields.initialShareCount && (typeof formData.initialShareCount === 'number' || formData.initialShareCount === '') 
                                    ? formatDisplayValue("initialShareCount", formData.initialShareCount) 
                                    : formData.initialShareCount}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-700 dark:text-white shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 transition-colors duration-200"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Initial Investment</label>
                            <input
                                type="text"
                                name="initialInvestment"
                                value={!editingFields.initialInvestment && (typeof formData.initialInvestment === 'number' || formData.initialInvestment === '') 
                                    ? formatDisplayValue("initialInvestment", formData.initialInvestment) 
                                    : formData.initialInvestment}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-700 dark:text-white shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 transition-colors duration-200"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Base Income</label>
                            <input
                                type="text"
                                name="baseIncome"
                                value={!editingFields.baseIncome && (typeof formData.baseIncome === 'number' || formData.baseIncome === '') 
                                    ? formatDisplayValue("baseIncome", formData.baseIncome) 
                                    : formData.baseIncome}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-700 dark:text-white shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 transition-colors duration-200"
                            />
                        </div>
                        
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Simulation Duration</label>
                        <input
                            type="text"
                            name="simulationMonths"
                            value={!editingFields.simulationMonths && (typeof formData.simulationMonths === 'number' || formData.simulationMonths === '') 
                                ? formatDisplayValue("simulationMonths", formData.simulationMonths) 
                                : formData.simulationMonths}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-700 dark:text-white shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 transition-colors duration-200"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">months</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Initial Share Price</label>
                        <input
                            type="text"
                            name="initialSharePrice"
                            value={!editingFields.initialSharePrice && (typeof formData.initialSharePrice === 'number' || formData.initialSharePrice === '') 
                                ? formatDisplayValue("initialSharePrice", formData.initialSharePrice) 
                                : formData.initialSharePrice}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-700 dark:text-white shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 transition-colors duration-200"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Dividend Yield</label>
                        <input
                            type="text"
                            name="dividendYield4w"
                            value={!editingFields.dividendYield4w && (typeof formData.dividendYield4w === 'number' || formData.dividendYield4w === '') 
                                ? formatDisplayValue("dividendYield4w", formData.dividendYield4w) 
                                : formData.dividendYield4w}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-700 dark:text-white shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 transition-colors duration-200"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">every four weeks</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Monthly Appreciation</label>
                        <input
                            type="text"
                            name="monthlyAppreciation"
                            value={!editingFields.monthlyAppreciation && (typeof formData.monthlyAppreciation === 'number' || formData.monthlyAppreciation === '') 
                                ? formatDisplayValue("monthlyAppreciation", formData.monthlyAppreciation) 
                                : formData.monthlyAppreciation}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-700 dark:text-white shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 transition-colors duration-200"
                        />
                    </div>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Loan Amount</label>
                            <input
                                type="text"
                                name="loanAmount"
                                value={!editingFields.loanAmount && (typeof formData.loanAmount === 'number' || formData.loanAmount === '') 
                                    ? formatDisplayValue("loanAmount", formData.loanAmount) 
                                    : formData.loanAmount}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                disabled={!formData.includeLoan}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 disabled:bg-gray-100 dark:disabled:bg-darkBlue-600 disabled:cursor-not-allowed dark:text-white dark:bg-darkBlue-700 transition-colors duration-200"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Annual Interest Rate</label>
                            <input
                                type="text"
                                name="annualInterestRate"
                                value={!editingFields.annualInterestRate && (typeof formData.annualInterestRate === 'number' || formData.annualInterestRate === '') 
                                    ? formatDisplayValue("annualInterestRate", formData.annualInterestRate) 
                                    : formData.annualInterestRate}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                disabled={!formData.includeLoan}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 disabled:bg-gray-100 dark:disabled:bg-darkBlue-600 disabled:cursor-not-allowed dark:text-white dark:bg-darkBlue-700 transition-colors duration-200"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">Amortization</label>
                            <input
                                type="text"
                                name="amortizationMonths"
                                value={!editingFields.amortizationMonths && (typeof formData.amortizationMonths === 'number' || formData.amortizationMonths === '') 
                                    ? formatDisplayValue("amortizationMonths", formData.amortizationMonths) 
                                    : formData.amortizationMonths}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                disabled={!formData.includeLoan}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 disabled:bg-gray-100 dark:disabled:bg-darkBlue-600 disabled:cursor-not-allowed dark:text-white dark:bg-darkBlue-700 transition-colors duration-200"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">months</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">DRIP to Principal</label>
                            <input
                                type="text"
                                name="surplusForDripPercent"
                                value={!editingFields.surplusForDripPercent && (typeof formData.surplusForDripPercent === 'number' || formData.surplusForDripPercent === '') 
                                    ? formatDisplayValue("surplusForDripPercent", formData.surplusForDripPercent) 
                                    : formData.surplusForDripPercent}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                disabled={!formData.includeLoan}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-darkBlue-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 focus:border-indigo-500 dark:focus:border-basshead-blue-500 disabled:bg-gray-100 dark:disabled:bg-darkBlue-600 disabled:cursor-not-allowed dark:text-white dark:bg-darkBlue-700 transition-colors duration-200"
                            />
                        </div>
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