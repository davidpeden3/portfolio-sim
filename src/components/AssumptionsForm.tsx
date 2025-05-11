import React, { useState } from 'react';
import { 
  DollarInput, 
  PercentInput, 
  IntegerInput, 
  TextInput, 
  SelectInput
} from "./inputs";
import ProfileSelector from './ProfileSelector';
import { ProfileType } from './profiles';
import TaxBracketTable from './TaxBracketTable';
import { ContributionManager } from './contributions';
import Panel from './common/Panel';
import SharePriceModelHelpModal from './help/SharePriceModelHelpModal';
import DividendModelHelpModal from './help/DividendModelHelpModal';
// Re-export icons for backward compatibility
import { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon } from "./ProfileIcons";
export { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon };

// Import types from models
import {
  TaxWithholdingStrategy,
  TaxWithholdingMethod,
  FilingType,
  DripStrategy,
  SharePriceModel,
  VariableDistribution
} from '../models/Assumptions';
import { SupplementalContribution } from '../models/SupplementalContribution';

// Form data type for PortfolioSimulator
export interface PortfolioFormData {
    // Investor Profile
    initialShareCount: number | string;
    initialInvestment: number | string;
    baseIncome: number | string;
    surplusForDripPercent: number | string;
    
    // Tax Settings
    withholdTaxes: boolean; // Kept for backward compatibility
    taxWithholdingStrategy: TaxWithholdingStrategy;
    taxWithholdingMethod: TaxWithholdingMethod;
    taxFilingType: FilingType;
    taxFixedAmount: number | string;
    taxFixedPercent: number | string;
    
    // DRIP Settings
    dripStrategy: DripStrategy;
    dripPercentage: number | string;
    dripFixedAmount: number | string;
    fixedIncomeAmount: number | string; // Monthly income amount for fixedIncome strategy
    
    // Supplemental Contributions
    supplementalContributions: SupplementalContribution[];
    
    // Simulation Parameters
    simulationMonths: number | string;
    startMonth: number | string; // 1-12 representing January-December
    initialSharePrice: number | string;
    dividendYield4w?: number | string; // Kept for backward compatibility

    // Dividend Model
    dividendModel?: string; // 'flatAmount', 'yieldBased', 'variable'
    flatDividendAmount?: number | string;
    yieldPeriod?: string; // '4w' or 'yearly'
    dividendYieldPercent?: number | string;
    dividendVariableDistribution?: string;
    dividendUniformMin?: number | string;
    dividendUniformMax?: number | string;
    dividendNormalMean?: number | string;
    dividendNormalStdDev?: number | string;
    dividendGbmDrift?: number | string;
    dividendGbmVolatility?: number | string;
    initialDividendMethod?: string;
    initialDividendAmount?: number | string;
    initialDividendYield?: number | string;
    
    // Share Price Model
    sharePriceModel: SharePriceModel;
    monthlyAppreciation: number | string; // For backward compatibility and geometric model
    linearChangeAmount: number | string; // For linear model
    
    // Variable Model Settings
    variableDistribution: VariableDistribution;
    uniformMin: number | string;
    uniformMax: number | string;
    normalMean: number | string;
    normalStdDev: number | string;
    gbmDrift: number | string;
    gbmVolatility: number | string;
    
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
    // State for help modals
    const [isSharePriceModelHelpOpen, setSharePriceModelHelpOpen] = useState(false);
    const [isDividendModelHelpOpen, setDividendModelHelpOpen] = useState(false);
    // Simplified change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value, type } = target;
        const checked = (target as HTMLInputElement).checked;
        
        if (type === "checkbox") {
            onChange({
                ...formData,
                [name]: checked,
            });
        } else if (name === "dividendModel") {
            // Handle dividend model changes
            const dividendModelValue = (value === 'flatAmount' || value === 'yieldBased' || value === 'variable')
                ? value
                : 'yieldBased';

            if (dividendModelValue === 'yieldBased') {
                // If switching to yield-based, ensure we have a default yield
                // Try to use existing dividendYieldPercent or legacy dividendYield4w
                onChange({
                    ...formData,
                    [name]: dividendModelValue,
                    dividendYieldPercent: formData.dividendYieldPercent || formData.dividendYield4w || 3,
                    yieldPeriod: formData.yieldPeriod || '4w'
                });
            } else if (dividendModelValue === 'flatAmount') {
                // Set default flat amount when selecting flat amount strategy
                onChange({
                    ...formData,
                    [name]: dividendModelValue,
                    flatDividendAmount: formData.flatDividendAmount || 0.25, // Default to $0.25
                });
            } else if (dividendModelValue === 'variable') {
                // Set default distribution to uniform when selecting variable
                onChange({
                    ...formData,
                    [name]: dividendModelValue,
                    dividendVariableDistribution: formData.dividendVariableDistribution || 'uniform',
                    dividendUniformMin: formData.dividendUniformMin || 0.5,
                    dividendUniformMax: formData.dividendUniformMax || 2
                });
            } else {
                onChange({
                    ...formData,
                    [name]: dividendModelValue
                });
            }
        } else if (name === "initialDividendMethod") {
            // Handle initial dividend method changes
            const methodValue = (value === 'flatAmount' || value === 'yieldBased')
                ? value
                : 'yieldBased';

            onChange({
                ...formData,
                [name]: methodValue
            });
        } else if (name === "dividendVariableDistribution") {
            // Handle dividend distribution changes
            const distribValue = (value === 'uniform' || value === 'normal' || value === 'gbm')
                ? value
                : 'uniform';

            if (distribValue === 'uniform') {
                onChange({
                    ...formData,
                    [name]: distribValue,
                    dividendUniformMin: formData.dividendUniformMin || 0.5,
                    dividendUniformMax: formData.dividendUniformMax || 2
                });
            } else if (distribValue === 'normal') {
                onChange({
                    ...formData,
                    [name]: distribValue,
                    dividendNormalMean: formData.dividendNormalMean || 1.5,
                    dividendNormalStdDev: formData.dividendNormalStdDev || 0.5
                });
            } else if (distribValue === 'gbm') {
                onChange({
                    ...formData,
                    [name]: distribValue,
                    dividendGbmDrift: formData.dividendGbmDrift || 2,
                    dividendGbmVolatility: formData.dividendGbmVolatility || 10,
                    initialDividendMethod: formData.initialDividendMethod || 'yieldBased',
                    initialDividendAmount: formData.initialDividendAmount || 0.25,
                    initialDividendYield: formData.initialDividendYield || 6
                });
            }
        } else if (name === "dripStrategy") {
            // The value coming from an input could be of any string type, so we need to check
            // if it's a valid DripStrategy value. If not, default to 'percentage'
            const dripValue = (value === 'none' || value === 'percentage' || value === 'fixedAmount' || value === 'fixedIncome') 
                ? value as DripStrategy
                : 'percentage';
                
            if (dripValue === 'percentage') {
                // Set default percentage to 100% when selecting percentage strategy
                onChange({
                    ...formData,
                    [name]: dripValue,
                    dripPercentage: formData.dripPercentage || 100,
                });
            } else if (dripValue === 'fixedIncome') {
                // Set default fixed income amount to 0 when selecting fixed income strategy
                onChange({
                    ...formData,
                    [name]: dripValue,
                    fixedIncomeAmount: formData.fixedIncomeAmount || 0,
                });
            } else {
                onChange({
                    ...formData,
                    [name]: dripValue,
                });
            }
        } else if (name === "sharePriceModel") {
            // The value coming from an input could be of any string type, so we need to check
            // if it's a valid SharePriceModel value. If not, default to 'geometric'
            const validModels = ['linear', 'geometric', 'uniform', 'normal', 'gbm'];
            const modelValue = validModels.includes(value)
                ? value
                : 'geometric';

            if (modelValue === 'geometric') {
                // Use monthly appreciation percentage
                onChange({
                    ...formData,
                    [name]: modelValue,
                    monthlyAppreciation: formData.monthlyAppreciation || 0,
                });
            } else if (modelValue === 'linear') {
                // Set default linear change amount to 0
                onChange({
                    ...formData,
                    [name]: modelValue,
                    linearChangeAmount: formData.linearChangeAmount || 0,
                });
            } else if (modelValue === 'uniform') {
                // Set default uniform distribution values
                onChange({
                    ...formData,
                    [name]: modelValue,
                    uniformMin: formData.uniformMin || -1,
                    uniformMax: formData.uniformMax || 1,
                });
            } else if (modelValue === 'normal') {
                // Set default normal distribution values
                onChange({
                    ...formData,
                    [name]: modelValue,
                    normalMean: formData.normalMean || 0.5,
                    normalStdDev: formData.normalStdDev || 1,
                });
            } else if (modelValue === 'gbm') {
                // Set default GBM values
                onChange({
                    ...formData,
                    [name]: modelValue,
                    gbmDrift: formData.gbmDrift || 0.5,
                    gbmVolatility: formData.gbmVolatility || 2,
                });
            }
        } else if (name === "variableDistribution") {
            // The value coming from an input could be of any string type, so we need to check
            // if it's a valid VariableDistribution value
            const distribValue = (value === 'uniform' || value === 'normal' || value === 'gbm')
                ? value as VariableDistribution
                : 'uniform';
                
            if (distribValue === 'uniform') {
                onChange({
                    ...formData,
                    [name]: distribValue,
                    uniformMin: formData.uniformMin || -1,
                    uniformMax: formData.uniformMax || 1,
                });
            } else if (distribValue === 'normal') {
                onChange({
                    ...formData,
                    [name]: distribValue,
                    normalMean: formData.normalMean || 0.5,
                    normalStdDev: formData.normalStdDev || 1,
                });
            } else if (distribValue === 'gbm') {
                onChange({
                    ...formData,
                    [name]: distribValue,
                    gbmDrift: formData.gbmDrift || 0.5,
                    gbmVolatility: formData.gbmVolatility || 2,
                });
            }
        } else {
            // Handle input changes - specialized components handle formatting
            onChange({
                ...formData,
                [name]: value,
            });
        }
    };
    
    // Handler for supplemental contributions changes
    const handleContributionsChange = (contributions: SupplementalContribution[]) => {
        onChange({
            ...formData,
            supplementalContributions: contributions
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Help Modals */}
            <SharePriceModelHelpModal
                isOpen={isSharePriceModelHelpOpen}
                onClose={() => setSharePriceModelHelpOpen(false)}
                currentModel={formData.sharePriceModel === 'variable' ? (formData.variableDistribution || 'uniform') : (formData.sharePriceModel || 'geometric')}
            />
            <DividendModelHelpModal
                isOpen={isDividendModelHelpOpen}
                onClose={() => setDividendModelHelpOpen(false)}
                currentModel={formData.dividendModel === 'variable' ? (formData.dividendVariableDistribution || 'uniform') : (formData.dividendModel || 'yieldBased')}
            />

            {/* Investor Profile Section */}
            <div className="bg-white dark:bg-darkBlue-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-darkBlue-700 transition-colors duration-200">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-200">Investor Profile</h3>

                {/* Profile Selector */}
                <Panel
                    title="Profile Selection"
                    className="mb-6"
                >
                    <ProfileSelector
                        selectedProfile={selectedProfile}
                        onProfileChange={onProfileChange}
                        hasCustomProfile={hasCustomProfile}
                    />
                </Panel>

                {/* Investment Settings */}
                <Panel
                    title="Investment Settings"
                    description="Settings that define your investment approach."
                    className="mb-6"
                >
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
                        <div>
                            <SelectInput
                                name="taxWithholdingStrategy"
                                value={formData.taxWithholdingStrategy}
                                onChange={handleChange}
                                label="Tax Withholding"
                                options={[
                                    { value: 'none', label: 'No Withholding' },
                                    { value: 'monthly', label: 'Withhold Monthly' },
                                    { value: 'quarterly', label: 'Withhold Quarterly' }
                                ]}
                            />
                        </div>
                    </div>
                </Panel>

                {/* Tax Withholding Settings - only show if a strategy other than 'none' is selected */}
                {formData.taxWithholdingStrategy !== 'none' && (
                    <Panel
                        title="Tax Withholding Settings"
                        className="mb-6"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <SelectInput
                                    name="taxWithholdingMethod"
                                    value={formData.taxWithholdingMethod}
                                    onChange={handleChange}
                                    label="Withholding Method"
                                    options={[
                                        { value: 'taxBracket', label: 'Tax Bracket Based' },
                                        { value: 'fixedAmount', label: 'Fixed Amount ($)' },
                                        { value: 'fixedPercent', label: 'Fixed Percentage (%)' }
                                    ]}
                                />
                            </div>

                            {/* For Tax Bracket method, show the filing type selector */}
                            {formData.taxWithholdingMethod === 'taxBracket' && (
                                <div>
                                    <SelectInput
                                        name="taxFilingType"
                                        value={formData.taxFilingType}
                                        onChange={handleChange}
                                        label="Filing Status"
                                        options={[
                                            { value: 'single', label: 'Single' },
                                            { value: 'married', label: 'Married Filing Jointly' },
                                            { value: 'headOfHousehold', label: 'Head of Household' }
                                        ]}
                                    />
                                </div>
                            )}

                            {formData.taxWithholdingMethod === 'fixedAmount' && (
                                <div>
                                    <DollarInput
                                        name="taxFixedAmount"
                                        value={formData.taxFixedAmount}
                                        onChange={handleChange}
                                        label={`Amount per ${formData.taxWithholdingStrategy === 'monthly' ? 'Month' : 'Quarter'}`}
                                        small={true}
                                    />
                                </div>
                            )}

                            {formData.taxWithholdingMethod === 'fixedPercent' && (
                                <div>
                                    <PercentInput
                                        name="taxFixedPercent"
                                        value={formData.taxFixedPercent}
                                        onChange={handleChange}
                                        label="Percentage"
                                        small={true}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Add Tax Bracket Table for the tax bracket method */}
                        {formData.taxWithholdingMethod === 'taxBracket' && (
                            <TaxBracketTable currentFilingType={formData.taxFilingType} />
                        )}
                    </Panel>
                )}

                {/* Supplemental Contributions Section */}
                <Panel
                    title="Supplemental Contributions"
                >
                    <ContributionManager
                        contributions={formData.supplementalContributions || []}
                        onChange={handleContributionsChange}
                        simulationStartMonth={Number(formData.startMonth)}
                        simulationMonths={Number(formData.simulationMonths)}
                    />
                </Panel>
            </div>
            
            {/* Simulation Parameters Section */}
            <div className="bg-white dark:bg-darkBlue-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-darkBlue-700 transition-colors duration-200">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-200">Simulation Parameters</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 transition-colors duration-200 hidden">Settings that control how the portfolio simulation runs.</p>
                
                {/* Basic Simulation Settings */}
                <Panel
                    title="Basic Parameters"
                    className="mb-6"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <IntegerInput
                            name="simulationMonths"
                            value={formData.simulationMonths}
                            onChange={handleChange}
                            label="Simulation Duration (months)"
                        />

                        <div>
                            <SelectInput
                                name="startMonth"
                                value={formData.startMonth ? formData.startMonth.toString() : '1'}
                                onChange={handleChange}
                                label="Start Month"
                                options={[
                                    { value: '1', label: 'January' },
                                    { value: '2', label: 'February' },
                                    { value: '3', label: 'March' },
                                    { value: '4', label: 'April' },
                                    { value: '5', label: 'May' },
                                    { value: '6', label: 'June' },
                                    { value: '7', label: 'July' },
                                    { value: '8', label: 'August' },
                                    { value: '9', label: 'September' },
                                    { value: '10', label: 'October' },
                                    { value: '11', label: 'November' },
                                    { value: '12', label: 'December' }
                                ]}
                            />
                        </div>

                    </div>
                </Panel>

                {/* Share Price Model Section */}
                <Panel
                    title="Share Price Modeling"
                    className="mb-6"
                    onHelp={() => setSharePriceModelHelpOpen(true)}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* First row with initial price and model selection */}
                        <DollarInput
                            name="initialSharePrice"
                            value={formData.initialSharePrice}
                            onChange={handleChange}
                            label="Initial Share Price ($)"
                        />

                        <SelectInput
                            name="sharePriceModel"
                            value={formData.sharePriceModel || 'geometric'}
                            onChange={handleChange}
                            label="Share Price Model"
                            options={[
                                { value: 'linear', label: 'Linear Change ($)' },
                                { value: 'geometric', label: 'Geometric Change (%)' },
                                { value: 'uniform', label: 'Uniform Distribution' },
                                { value: 'normal', label: 'Normal Distribution' },
                                { value: 'gbm', label: 'Geometric Brownian Motion' }
                            ]}
                        />

                        {/* Show different inputs based on the selected share price model */}
                        {formData.sharePriceModel === 'linear' && (
                            <div className="col-span-2">
                                <DollarInput
                                    name="linearChangeAmount"
                                    value={formData.linearChangeAmount}
                                    onChange={handleChange}
                                    label="Monthly $ Change"
                                />
                            </div>
                        )}

                        {(formData.sharePriceModel === 'geometric' || !formData.sharePriceModel) && (
                            <div className="col-span-2">
                                <PercentInput
                                    name="monthlyAppreciation"
                                    value={formData.monthlyAppreciation}
                                    onChange={handleChange}
                                    label="Monthly Change (%)"
                                />
                            </div>
                        )}

                        {formData.sharePriceModel === 'uniform' && (
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <PercentInput
                                    name="uniformMin"
                                    value={formData.uniformMin}
                                    onChange={handleChange}
                                    label="Min Change (%)"
                                />
                                <PercentInput
                                    name="uniformMax"
                                    value={formData.uniformMax}
                                    onChange={handleChange}
                                    label="Max Change (%)"
                                />
                            </div>
                        )}

                        {formData.sharePriceModel === 'normal' && (
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <PercentInput
                                    name="normalMean"
                                    value={formData.normalMean}
                                    onChange={handleChange}
                                    label="Mean Change (%)"
                                />
                                <PercentInput
                                    name="normalStdDev"
                                    value={formData.normalStdDev}
                                    onChange={handleChange}
                                    label="Standard Deviation (%)"
                                />
                            </div>
                        )}

                        {formData.sharePriceModel === 'gbm' && (
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <PercentInput
                                    name="gbmDrift"
                                    value={formData.gbmDrift}
                                    onChange={handleChange}
                                    label="Drift (%)"
                                />
                                <PercentInput
                                    name="gbmVolatility"
                                    value={formData.gbmVolatility}
                                    onChange={handleChange}
                                    label="Volatility (%)"
                                />
                            </div>
                        )}
                    </div>
                </Panel>

                {/* Dividend Modeling Section */}
                <Panel
                    title="Dividend Modeling"
                    className="mb-6"
                    onHelp={() => setDividendModelHelpOpen(true)}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* First row with model selection */}
                        <SelectInput
                            name="dividendModel"
                            value={formData.dividendModel || 'yieldBased'}
                            onChange={handleChange}
                            label="Dividend Model"
                            options={[
                                { value: 'flatAmount', label: 'Flat Amount ($)' },
                                { value: 'yieldBased', label: 'Dividend Yield (%)' },
                                { value: 'variable', label: 'Variable Change' }
                            ]}
                        />

                        {/* Show different inputs based on the selected dividend model */}
                        {formData.dividendModel === 'flatAmount' && (
                            <div>
                                <DollarInput
                                    name="flatDividendAmount"
                                    value={formData.flatDividendAmount}
                                    onChange={handleChange}
                                    label="Dividend Amount ($)"
                                />
                            </div>
                        )}

                        {(formData.dividendModel === 'yieldBased' || !formData.dividendModel) && (
                            <>
                                <div>
                                    <PercentInput
                                        name="dividendYieldPercent"
                                        value={formData.dividendYieldPercent || formData.dividendYield4w}
                                        onChange={handleChange}
                                        label="Dividend Yield (%)"
                                    />
                                </div>
                                <div>
                                    <SelectInput
                                        name="yieldPeriod"
                                        value={formData.yieldPeriod || '4w'}
                                        onChange={handleChange}
                                        label="Yield Period"
                                        options={[
                                            { value: '4w', label: '4-week period' },
                                            { value: 'yearly', label: 'Yearly (÷13)' }
                                        ]}
                                    />
                                </div>
                            </>
                        )}

                        {formData.dividendModel === 'variable' && (
                            <>
                                <div>
                                    <SelectInput
                                        name="dividendVariableDistribution"
                                        value={formData.dividendVariableDistribution || 'uniform'}
                                        onChange={handleChange}
                                        label="Distribution Type"
                                        options={[
                                            { value: 'uniform', label: 'Uniform Distribution' },
                                            { value: 'normal', label: 'Normal Distribution' },
                                            { value: 'gbm', label: 'Geometric Brownian Motion' }
                                        ]}
                                    />
                                </div>

                                {/* Variable distribution parameters */}
                                <div className="col-span-2 mt-4">
                                    <div className="p-3 bg-blue-100 dark:bg-darkBlue-800/80 rounded-md">
                                        {formData.dividendVariableDistribution === 'uniform' && (
                                            <div className="space-y-3">
                                                <div className="font-medium text-gray-800 dark:text-white mb-2">Uniform Distribution</div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <PercentInput
                                                        name="dividendUniformMin"
                                                        value={formData.dividendUniformMin}
                                                        onChange={handleChange}
                                                        label="Min Yield (%)"
                                                    />
                                                    <PercentInput
                                                        name="dividendUniformMax"
                                                        value={formData.dividendUniformMax}
                                                        onChange={handleChange}
                                                        label="Max Yield (%)"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {formData.dividendVariableDistribution === 'normal' && (
                                            <div className="space-y-3">
                                                <div className="font-medium text-gray-800 dark:text-white mb-2">Normal Distribution</div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <PercentInput
                                                        name="dividendNormalMean"
                                                        value={formData.dividendNormalMean}
                                                        onChange={handleChange}
                                                        label="Mean Yield (%)"
                                                    />
                                                    <PercentInput
                                                        name="dividendNormalStdDev"
                                                        value={formData.dividendNormalStdDev}
                                                        onChange={handleChange}
                                                        label="Standard Deviation (%)"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {formData.dividendVariableDistribution === 'gbm' && (
                                            <div className="space-y-3">
                                                <div className="font-medium text-gray-800 dark:text-white mb-2">Geometric Brownian Motion</div>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <PercentInput
                                                        name="dividendGbmDrift"
                                                        value={formData.dividendGbmDrift}
                                                        onChange={handleChange}
                                                        label="Drift (%)"
                                                    />
                                                    <PercentInput
                                                        name="dividendGbmVolatility"
                                                        value={formData.dividendGbmVolatility}
                                                        onChange={handleChange}
                                                        label="Volatility (%)"
                                                    />
                                                </div>

                                                {/* Initial dividend settings */}
                                                <div className="border-t border-gray-200 dark:border-darkBlue-600 pt-3 mt-3">
                                                    <div className="font-medium text-gray-800 dark:text-white mb-2">Initial Dividend Setting</div>

                                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                                        <div>
                                                            <SelectInput
                                                                name="initialDividendMethod"
                                                                value={formData.initialDividendMethod || 'yieldBased'}
                                                                onChange={handleChange}
                                                                label="Initial Method"
                                                                options={[
                                                                    { value: 'flatAmount', label: 'Flat Amount ($)' },
                                                                    { value: 'yieldBased', label: 'Yearly Yield (%)' }
                                                                ]}
                                                            />
                                                        </div>

                                                        {(formData.initialDividendMethod === 'flatAmount' || !formData.initialDividendMethod) && (
                                                            <div>
                                                                <DollarInput
                                                                    name="initialDividendAmount"
                                                                    value={formData.initialDividendAmount || 0.25}
                                                                    onChange={handleChange}
                                                                    label="Initial Amount ($)"
                                                                />
                                                            </div>
                                                        )}

                                                        {formData.initialDividendMethod === 'yieldBased' && (
                                                            <div>
                                                                <PercentInput
                                                                    name="initialDividendYield"
                                                                    value={formData.initialDividendYield || 6}
                                                                    onChange={handleChange}
                                                                    label="Yearly Yield (%)"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 italic">
                                                        This sets the starting point for your GBM dividend path
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Panel>

                {/* DRIP Strategy Section */}
                <Panel
                    title="DRIP Settings"
                    className="mb-6"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2">
                            <SelectInput
                                name="dripStrategy"
                                value={formData.dripStrategy || 'percentage'}
                                onChange={handleChange}
                                label="DRIP Strategy"
                                options={[
                                    { value: 'none', label: 'No DRIP' },
                                    { value: 'percentage', label: 'DRIP Percentage (%)' },
                                    { value: 'fixedAmount', label: 'DRIP Fixed Amount ($)' },
                                    { value: 'fixedIncome', label: 'Fixed Income + DRIP Remainder' }
                                ]}
                            />
                        </div>

                        {(formData.dripStrategy === 'percentage' || !formData.dripStrategy) && (
                            <div>
                                <PercentInput
                                    name="dripPercentage"
                                    value={formData.dripPercentage || 100}
                                    onChange={handleChange}
                                    label="DRIP Percentage"
                                />
                            </div>
                        )}

                        {formData.dripStrategy === 'fixedAmount' && (
                            <div>
                                <DollarInput
                                    name="dripFixedAmount"
                                    value={formData.dripFixedAmount}
                                    onChange={handleChange}
                                    label="DRIP Fixed Amount"
                                />
                            </div>
                        )}

                        {formData.dripStrategy === 'fixedIncome' && (
                            <div>
                                <DollarInput
                                    name="fixedIncomeAmount"
                                    value={formData.fixedIncomeAmount || 0}
                                    onChange={handleChange}
                                    label="Monthly Income Amount"
                                />
                            </div>
                        )}
                    </div>
                </Panel>

                {/* Loan Settings Section */}
                <Panel
                    title="Loan Settings"
                    rightElement={
                        <div className="flex items-center">
                            <span className="mr-3 text-sm text-blue-700 dark:text-blue-300 transition-colors duration-200">Include Loan:</span>
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
                    }
                >
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
                </Panel>
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