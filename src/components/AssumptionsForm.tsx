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
// Re-export icons
import { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon } from "./ProfileIcons";
export { EarlyCareerIcon, MidCareerIcon, RetirementIcon, CustomIcon };

// Import types from models
import {
  TaxWithholdingStrategy,
  TaxWithholdingMethod,
  FilingType,
  DripStrategy,
  SharePriceModel,
  VariableDistribution,
  YieldPeriod
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
    withholdTaxes: boolean; // Basic tax withholding flag
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
    dividendYield4w?: number | string; // 4-week dividend yield

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

    // Period-specific dividend properties
    dividend4wYieldPercent?: number | string;
    dividendYearlyYieldPercent?: number | string;
    dividendUniformMin4w?: number | string;
    dividendUniformMax4w?: number | string;
    dividendUniformMinYearly?: number | string;
    dividendUniformMaxYearly?: number | string;
    dividendNormalMean4w?: number | string;
    dividendNormalStdDev4w?: number | string;
    dividendNormalMeanYearly?: number | string;
    dividendNormalStdDevYearly?: number | string;
    
    // Share Price Model
    sharePriceModel: SharePriceModel;
    monthlyAppreciation: number | string; // For geometric model
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
            const validModels = ['linear', 'yieldBased', 'uniform', 'normal', 'gbm'];
            const dividendModelValue = validModels.includes(value)
                ? value
                : 'yieldBased';


            // Common properties for all dividend models
            const baseProperties = {
                ...formData,
                [name]: dividendModelValue,
                // Don't set default for initialDividendAmount, keep whatever the user has set
            };

            if (dividendModelValue === 'yieldBased') {
                // Get the selected yield period, default to 4w
                const yieldPeriod = formData.yieldPeriod || '4w';

                // Set the appropriate yield values based on period
                const yield4w = formData.dividend4wYieldPercent !== undefined
                    ? formData.dividend4wYieldPercent
                    : 9; // Default 4w value

                const yieldYearly = formData.dividendYearlyYieldPercent !== undefined
                    ? formData.dividendYearlyYieldPercent
                    : 117; // Default yearly value

                // Determine which value to use for the standard field based on current period
                const standardYield = yieldPeriod === '4w' ? yield4w : yieldYearly;

                onChange({
                    ...baseProperties,
                    yieldPeriod: yieldPeriod,
                    dividend4wYieldPercent: yield4w,
                    dividendYearlyYieldPercent: yieldYearly,
                    dividendYieldPercent: standardYield
                });
            } else if (dividendModelValue === 'linear') {
                // Set linear change amount when selecting linear model
                // Never automatically sync with initialDividendAmount
                // Keep whatever flatDividendAmount the user has already set
                onChange({
                    ...baseProperties,
                    // Only set a default if flatDividendAmount has never been set
                    ...(formData.flatDividendAmount === undefined ? { flatDividendAmount: 0.25 } : {})
                });
            } else if (dividendModelValue === 'uniform') {
                // Get the selected yield period, default to 4w
                const yieldPeriod = formData.yieldPeriod || '4w';

                // Set the appropriate uniform values based on period
                const min4w = formData.dividendUniformMin4w !== undefined
                    ? formData.dividendUniformMin4w
                    : 5; // Default 4w min

                const max4w = formData.dividendUniformMax4w !== undefined
                    ? formData.dividendUniformMax4w
                    : 10; // Default 4w max

                const minYearly = formData.dividendUniformMinYearly !== undefined
                    ? formData.dividendUniformMinYearly
                    : 65; // Default yearly min

                const maxYearly = formData.dividendUniformMaxYearly !== undefined
                    ? formData.dividendUniformMaxYearly
                    : 130; // Default yearly max

                // Determine which values to use for the standard fields based on current period
                const currentMin = yieldPeriod === '4w' ? min4w : minYearly;
                const currentMax = yieldPeriod === '4w' ? max4w : maxYearly;

                onChange({
                    ...baseProperties,
                    yieldPeriod: yieldPeriod,
                    // Store period-specific values
                    dividendUniformMin4w: min4w,
                    dividendUniformMax4w: max4w,
                    dividendUniformMinYearly: minYearly,
                    dividendUniformMaxYearly: maxYearly,
                    // Update standard fields based on the selected period
                    dividendUniformMin: currentMin,
                    dividendUniformMax: currentMax
                });
            } else if (dividendModelValue === 'normal') {
                // Get the selected yield period, default to 4w
                const yieldPeriod = formData.yieldPeriod || '4w';

                // Set the appropriate normal values based on period
                const mean4w = formData.dividendNormalMean4w !== undefined
                    ? formData.dividendNormalMean4w
                    : 7.5; // Default 4w mean

                const stdDev4w = formData.dividendNormalStdDev4w !== undefined
                    ? formData.dividendNormalStdDev4w
                    : 2.5; // Default 4w stdDev

                const meanYearly = formData.dividendNormalMeanYearly !== undefined
                    ? formData.dividendNormalMeanYearly
                    : 97.5; // Default yearly mean

                const stdDevYearly = formData.dividendNormalStdDevYearly !== undefined
                    ? formData.dividendNormalStdDevYearly
                    : 32.5; // Default yearly stdDev

                // Determine which values to use for the standard fields based on current period
                const currentMean = yieldPeriod === '4w' ? mean4w : meanYearly;
                const currentStdDev = yieldPeriod === '4w' ? stdDev4w : stdDevYearly;

                onChange({
                    ...baseProperties,
                    yieldPeriod: yieldPeriod,
                    // Store period-specific values
                    dividendNormalMean4w: mean4w,
                    dividendNormalStdDev4w: stdDev4w,
                    dividendNormalMeanYearly: meanYearly,
                    dividendNormalStdDevYearly: stdDevYearly,
                    // Update standard fields based on the selected period
                    dividendNormalMean: currentMean,
                    dividendNormalStdDev: currentStdDev
                });
            } else if (dividendModelValue === 'gbm') {
                // Set default GBM values
                onChange({
                    ...baseProperties,
                    dividendGbmDrift: formData.dividendGbmDrift || 2,
                    dividendGbmVolatility: formData.dividendGbmVolatility || 10
                });
            } else {
                onChange(baseProperties);
            }
        } else if (name === "yieldPeriod") {
            // When changing the yield period, we need to maintain separate values for each period
            const newYieldPeriod = value as YieldPeriod;
            const currentModel = formData.dividendModel;

            // Create the update object based on dividend model
            const updateObj = {
                ...formData,
                [name]: newYieldPeriod,
            };

            if (currentModel === 'yieldBased' || !currentModel) {
                // For yield-based model, handle dividend yield percentages
                const yield4w = formData.dividend4wYieldPercent !== undefined
                    ? formData.dividend4wYieldPercent
                    : 9; // Default 4w yield

                const yieldYearly = formData.dividendYearlyYieldPercent !== undefined
                    ? formData.dividendYearlyYieldPercent
                    : 117; // Default yearly yield

                // Update with period-specific yield values
                updateObj.dividend4wYieldPercent = yield4w;
                updateObj.dividendYearlyYieldPercent = yieldYearly;
                // Update standard field based on the selected period
                updateObj.dividendYieldPercent = newYieldPeriod === '4w' ? yield4w : yieldYearly;
            }
            else if (currentModel === 'uniform') {
                // For uniform distribution, handle min/max yield percentages
                const min4w = formData.dividendUniformMin4w !== undefined
                    ? formData.dividendUniformMin4w
                    : 5; // Default 4w min

                const max4w = formData.dividendUniformMax4w !== undefined
                    ? formData.dividendUniformMax4w
                    : 10; // Default 4w max

                const minYearly = formData.dividendUniformMinYearly !== undefined
                    ? formData.dividendUniformMinYearly
                    : 65; // Default yearly min

                const maxYearly = formData.dividendUniformMaxYearly !== undefined
                    ? formData.dividendUniformMaxYearly
                    : 130; // Default yearly max

                // Store uniform-specific values
                updateObj.dividendUniformMin4w = min4w;
                updateObj.dividendUniformMax4w = max4w;
                updateObj.dividendUniformMinYearly = minYearly;
                updateObj.dividendUniformMaxYearly = maxYearly;

                // Update standard fields based on the selected period
                updateObj.dividendUniformMin = newYieldPeriod === '4w' ? min4w : minYearly;
                updateObj.dividendUniformMax = newYieldPeriod === '4w' ? max4w : maxYearly;
            }

            onChange(updateObj);
        } else if (name === "dividend4wYieldPercent" || name === "dividendYearlyYieldPercent") {
            // Handle changes to yield values - store the value for the specific period
            onChange({
                ...formData,
                [name]: value,
                // Also update the standard field for consistency
                dividendYieldPercent: value
            });
        } else if (name === "dividendNormalMean4w" || name === "dividendNormalStdDev4w" ||
                   name === "dividendNormalMeanYearly" || name === "dividendNormalStdDevYearly") {
            // Handle changes to normal distribution values
            const updateObj = {
                ...formData,
                [name]: value
            };

            // Also update the standard fields based on the current yield period
            const currentPeriod = formData.yieldPeriod || '4w';

            if (currentPeriod === '4w') {
                if (name === "dividendNormalMean4w") {
                    updateObj.dividendNormalMean = value;
                } else if (name === "dividendNormalStdDev4w") {
                    updateObj.dividendNormalStdDev = value;
                }
            } else { // yearly
                if (name === "dividendNormalMeanYearly") {
                    updateObj.dividendNormalMean = value;
                } else if (name === "dividendNormalStdDevYearly") {
                    updateObj.dividendNormalStdDev = value;
                }
            }

            onChange(updateObj);
        } else if (name === "dividendUniformMin4w" || name === "dividendUniformMax4w" ||
                   name === "dividendUniformMinYearly" || name === "dividendUniformMaxYearly") {
            // Handle changes to uniform distribution values
            const updateObj = {
                ...formData,
                [name]: value
            };

            // Also update the standard fields based on the current yield period
            const currentPeriod = formData.yieldPeriod || '4w';

            if (currentPeriod === '4w') {
                if (name === "dividendUniformMin4w") {
                    updateObj.dividendUniformMin = value;
                } else if (name === "dividendUniformMax4w") {
                    updateObj.dividendUniformMax = value;
                }
            } else { // yearly
                if (name === "dividendUniformMinYearly") {
                    updateObj.dividendUniformMin = value;
                } else if (name === "dividendUniformMaxYearly") {
                    updateObj.dividendUniformMax = value;
                }
            }

            onChange(updateObj);
        } else if (name === "initialDividendAmount") {
            // Handle changes to initial dividend amount
            // Don't set any defaults here - just pass the value as-is
            // And NEVER change flatDividendAmount when initialDividendAmount changes
            onChange({
                ...formData,
                [name]: value
            });
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
                currentModel={formData.sharePriceModel || 'geometric'}
            />
            <DividendModelHelpModal
                isOpen={isDividendModelHelpOpen}
                onClose={() => setDividendModelHelpOpen(false)}
                currentModel={formData.dividendModel || 'yieldBased'}
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
                    title="Time Parameters"
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
                            <div>
                                <DollarInput
                                    name="linearChangeAmount"
                                    value={formData.linearChangeAmount}
                                    onChange={handleChange}
                                    label="Change ($)"
                                />
                            </div>
                        )}

                        {(formData.sharePriceModel === 'geometric' || !formData.sharePriceModel) && (
                            <div>
                                <PercentInput
                                    name="monthlyAppreciation"
                                    value={formData.monthlyAppreciation}
                                    onChange={handleChange}
                                    label="Change (%)"
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
                        {/* First row with initial dividend and model selection */}
                        <DollarInput
                            name="initialDividendAmount"
                            value={formData.initialDividendAmount !== undefined ? formData.initialDividendAmount : ''}
                            onChange={handleChange}
                            label="Initial Dividend ($)"
                        />

                        <SelectInput
                            name="dividendModel"
                            value={formData.dividendModel || 'yieldBased'}
                            onChange={handleChange}
                            label="Dividend Model"
                            options={[
                                { value: 'linear', label: 'Linear Change ($)' },
                                { value: 'yieldBased', label: 'Yield (%)' },
                                { value: 'uniform', label: 'Uniform Distribution' },
                                { value: 'normal', label: 'Normal Distribution' },
                                { value: 'gbm', label: 'Geometric Brownian Motion' }
                            ]}
                        />

                        {/* Show different inputs based on the selected dividend model */}
                        {formData.dividendModel === 'linear' && (
                            <div>
                                <DollarInput
                                    name="flatDividendAmount"
                                    value={formData.flatDividendAmount !== undefined ? formData.flatDividendAmount : ''}
                                    onChange={handleChange}
                                    label="Change ($)"
                                />
                            </div>
                        )}

                        {(formData.dividendModel === 'yieldBased' || !formData.dividendModel) && (
                            <>
                                <div className="col-span-1">
                                    <SelectInput
                                        name="yieldPeriod"
                                        value={formData.yieldPeriod || '4w'}
                                        onChange={handleChange}
                                        label="Yield Period"
                                        options={[
                                            { value: '4w', label: '4 weeks' },
                                            { value: 'yearly', label: '1 year' }
                                        ]}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <PercentInput
                                        name={formData.yieldPeriod === 'yearly' ? "dividendYearlyYieldPercent" : "dividend4wYieldPercent"}
                                        value={
                                            formData.yieldPeriod === 'yearly'
                                                ? (formData.dividendYearlyYieldPercent !== undefined ? formData.dividendYearlyYieldPercent : 117)
                                                : (formData.dividend4wYieldPercent !== undefined ? formData.dividend4wYieldPercent : 9)
                                        }
                                        onChange={handleChange}
                                        label="Yield (%)"
                                    />
                                </div>
                            </>
                        )}

                        {formData.dividendModel === 'uniform' && (
                            <>
                                <div className="col-span-1">
                                    <SelectInput
                                        name="yieldPeriod"
                                        value={formData.yieldPeriod || '4w'}
                                        onChange={handleChange}
                                        label="Yield Period"
                                        options={[
                                            { value: '4w', label: '4 weeks' },
                                            { value: 'yearly', label: '1 year' }
                                        ]}
                                    />
                                </div>
                                <div className="col-span-1 grid grid-cols-2 gap-4">
                                    <PercentInput
                                        name={formData.yieldPeriod === 'yearly' ? "dividendUniformMinYearly" : "dividendUniformMin4w"}
                                        value={
                                            formData.yieldPeriod === 'yearly'
                                                ? (formData.dividendUniformMinYearly !== undefined ? formData.dividendUniformMinYearly : 65)
                                                : (formData.dividendUniformMin4w !== undefined ? formData.dividendUniformMin4w : 5)
                                        }
                                        onChange={handleChange}
                                        label="Min Yield (%)"
                                    />
                                    <PercentInput
                                        name={formData.yieldPeriod === 'yearly' ? "dividendUniformMaxYearly" : "dividendUniformMax4w"}
                                        value={
                                            formData.yieldPeriod === 'yearly'
                                                ? (formData.dividendUniformMaxYearly !== undefined ? formData.dividendUniformMaxYearly : 130)
                                                : (formData.dividendUniformMax4w !== undefined ? formData.dividendUniformMax4w : 10)
                                        }
                                        onChange={handleChange}
                                        label="Max Yield (%)"
                                    />
                                </div>
                            </>
                        )}

                        {formData.dividendModel === 'normal' && (
                            <>
                                <div className="col-span-1">
                                    <SelectInput
                                        name="yieldPeriod"
                                        value={formData.yieldPeriod || '4w'}
                                        onChange={handleChange}
                                        label="Yield Period"
                                        options={[
                                            { value: '4w', label: '4 weeks' },
                                            { value: 'yearly', label: '1 year' }
                                        ]}
                                    />
                                </div>
                                <div className="col-span-1 grid grid-cols-2 gap-4">
                                    <PercentInput
                                        name={formData.yieldPeriod === 'yearly' ? "dividendNormalMeanYearly" : "dividendNormalMean4w"}
                                        value={
                                            formData.yieldPeriod === 'yearly'
                                                ? (formData.dividendNormalMeanYearly !== undefined ? formData.dividendNormalMeanYearly : 97.5)
                                                : (formData.dividendNormalMean4w !== undefined ? formData.dividendNormalMean4w : 7.5)
                                        }
                                        onChange={handleChange}
                                        label="Mean (%)"
                                    />
                                    <PercentInput
                                        name={formData.yieldPeriod === 'yearly' ? "dividendNormalStdDevYearly" : "dividendNormalStdDev4w"}
                                        value={
                                            formData.yieldPeriod === 'yearly'
                                                ? (formData.dividendNormalStdDevYearly !== undefined ? formData.dividendNormalStdDevYearly : 32.5)
                                                : (formData.dividendNormalStdDev4w !== undefined ? formData.dividendNormalStdDev4w : 2.5)
                                        }
                                        onChange={handleChange}
                                        label="Std Dev (%)"
                                    />
                                </div>
                            </>
                        )}

                        {formData.dividendModel === 'gbm' && (
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <PercentInput
                                    name="dividendGbmDrift"
                                    value={formData.dividendGbmDrift !== undefined ? formData.dividendGbmDrift : 0.5}
                                    onChange={handleChange}
                                    label="Drift (%)"
                                />
                                <PercentInput
                                    name="dividendGbmVolatility"
                                    value={formData.dividendGbmVolatility !== undefined ? formData.dividendGbmVolatility : 2}
                                    onChange={handleChange}
                                    label="Volatility (%)"
                                />
                            </div>
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