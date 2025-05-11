import { useState, useEffect } from "react";
import { calculatePortfolio } from "../calculator/PortfolioCalculator";
import { AmortizationEntry } from "../models/AmortizationEntry";
import { CalculatedSummary } from "../models/CalculatedSummary";
import { SupplementalContribution } from "../models/SupplementalContribution";
import PortfolioChart from "./PortfolioChart";
import AmortizationTable from "./AmortizationTable";
import CalculatedSummaryDisplay from "./CalculatedSummary";
import HelpModal from "./HelpModal";
import VersionFooter from "./VersionFooter";
import ThemeToggle from "./ThemeToggle";
import ShareConfig from "./ShareConfig";
import DropdownMenu from "./common/DropdownMenu";
import Modal from "./common/Modal";
import AssumptionsForm, { PortfolioFormData } from "./AssumptionsForm";
import { ProfileType, earlyCareerProfile, midCareerProfile, retirementProfile, customProfile } from "./profiles";

// Default form data is mid-career
const DEFAULT_FORM_DATA = midCareerProfile.data;

// Helper function to get profile data by type
function getProfileData(profileType: ProfileType) {
  switch (profileType) {
    case 'earlyCareer':
      return earlyCareerProfile.data;
    case 'midCareer':
      return midCareerProfile.data;
    case 'retirement':
      return retirementProfile.data;
    case 'custom':
      return customProfile.data;
    default:
      return midCareerProfile.data;
  }
}


export function PortfolioSimulator() {
  // Get saved profile info from localStorage
  const getInitialState = () => {
    try {
      const savedProfile = localStorage.getItem("selectedProfile") as ProfileType;
      const savedCustomProfileData = localStorage.getItem("customProfileData");
      
      // Check if a custom profile exists
      const hasCustom = !!savedCustomProfileData;
      
      // If there's no saved profile, default to midCareer
      if (!savedProfile) {
        // Use default data with sensible defaults for all fields
        const formDataWithDefaults = {
          ...DEFAULT_FORM_DATA,
          taxWithholdingStrategy: DEFAULT_FORM_DATA.taxWithholdingStrategy || 'none',
          taxWithholdingMethod: DEFAULT_FORM_DATA.taxWithholdingMethod || 'taxBracket',
          taxFilingType: DEFAULT_FORM_DATA.taxFilingType || 'single',
          taxFixedAmount: DEFAULT_FORM_DATA.taxFixedAmount || 0,
          taxFixedPercent: DEFAULT_FORM_DATA.taxFixedPercent || 0,
          dripStrategy: DEFAULT_FORM_DATA.dripStrategy || 'percentage',
          dripPercentage: DEFAULT_FORM_DATA.dripPercentage || 100,
          dripFixedAmount: DEFAULT_FORM_DATA.dripFixedAmount || 0,
          fixedIncomeAmount: DEFAULT_FORM_DATA.fixedIncomeAmount || 0,
          startMonth: DEFAULT_FORM_DATA.startMonth || 1, // Default to January

          // Share Price Model defaults
          sharePriceModel: DEFAULT_FORM_DATA.sharePriceModel || 'geometric',
          linearChangeAmount: DEFAULT_FORM_DATA.linearChangeAmount || 0,
          variableDistribution: DEFAULT_FORM_DATA.variableDistribution || 'uniform',
          uniformMin: DEFAULT_FORM_DATA.uniformMin || -1,
          uniformMax: DEFAULT_FORM_DATA.uniformMax || 1,
          normalMean: DEFAULT_FORM_DATA.normalMean || 0.5,
          normalStdDev: DEFAULT_FORM_DATA.normalStdDev || 1,
          gbmDrift: DEFAULT_FORM_DATA.gbmDrift || 0.5,
          gbmVolatility: DEFAULT_FORM_DATA.gbmVolatility || 2
        };
        
        return {
          profile: "midCareer" as ProfileType,
          isCustom: false,
          formData: formDataWithDefaults,
          customData: hasCustom ? JSON.parse(savedCustomProfileData!) : customProfile.data,
          hasCustomProfile: hasCustom
        };
      }
      
      // If it's a custom profile
      if (savedProfile === "custom" && savedCustomProfileData) {
        // Parse the custom profile data
        const customData = JSON.parse(savedCustomProfileData);
        
        // Ensure customData has all required settings with defaults
        const dataWithDefaults = {
          ...customData,
          taxWithholdingStrategy: customData.taxWithholdingStrategy || 'none',
          taxWithholdingMethod: customData.taxWithholdingMethod || 'taxBracket',
          taxFilingType: customData.taxFilingType || 'single',
          taxFixedAmount: customData.taxFixedAmount || 0,
          taxFixedPercent: customData.taxFixedPercent || 0,
          dripStrategy: customData.dripStrategy || 'percentage',
          dripPercentage: customData.dripPercentage || 100,
          dripFixedAmount: customData.dripFixedAmount || 0,
          fixedIncomeAmount: customData.fixedIncomeAmount || 0,
          startMonth: customData.startMonth || 1, // Default to January

          // Share Price Model defaults
          sharePriceModel: customData.sharePriceModel || 'geometric',
          linearChangeAmount: customData.linearChangeAmount || 0,
          variableDistribution: customData.variableDistribution || 'uniform',
          uniformMin: customData.uniformMin || -1,
          uniformMax: customData.uniformMax || 1,
          normalMean: customData.normalMean || 0.5,
          normalStdDev: customData.normalStdDev || 1,
          gbmDrift: customData.gbmDrift || 0.5,
          gbmVolatility: customData.gbmVolatility || 2
        };
        
        return {
          profile: "custom" as ProfileType,
          isCustom: true,
          formData: dataWithDefaults,
          customData: dataWithDefaults,
          hasCustomProfile: true
        };
      }
      
      // If it's a predefined profile
      if (savedProfile === "earlyCareer" || savedProfile === "midCareer" || savedProfile === "retirement" || savedProfile === "custom") {
        // Get the standard profile data from the profile definitions
        const profileData = getProfileData(savedProfile);
        
        // Ensure profile data has all required settings with defaults
        const dataWithDefaults = {
          ...profileData,
          taxWithholdingStrategy: profileData.taxWithholdingStrategy || 'none',
          taxWithholdingMethod: profileData.taxWithholdingMethod || 'taxBracket',
          taxFilingType: profileData.taxFilingType || 'single',
          taxFixedAmount: profileData.taxFixedAmount || 0,
          taxFixedPercent: profileData.taxFixedPercent || 0,
          dripStrategy: profileData.dripStrategy || 'percentage',
          dripPercentage: profileData.dripPercentage || 100,
          dripFixedAmount: profileData.dripFixedAmount || 0,
          fixedIncomeAmount: profileData.fixedIncomeAmount || 0,
          startMonth: profileData.startMonth || 1, // Default to January

          // Share Price Model defaults
          sharePriceModel: profileData.sharePriceModel || 'geometric',
          linearChangeAmount: profileData.linearChangeAmount || 0,
          variableDistribution: profileData.variableDistribution || 'uniform',
          uniformMin: profileData.uniformMin || -1,
          uniformMax: profileData.uniformMax || 1,
          normalMean: profileData.normalMean || 0.5,
          normalStdDev: profileData.normalStdDev || 1,
          gbmDrift: profileData.gbmDrift || 0.5,
          gbmVolatility: profileData.gbmVolatility || 2
        };
        
        return {
          profile: savedProfile,
          isCustom: false,
          formData: dataWithDefaults,
          customData: hasCustom ? JSON.parse(savedCustomProfileData!) : customProfile.data,
          hasCustomProfile: hasCustom
        };
      }
      
      // Default fallback
      return {
        profile: "midCareer" as ProfileType,
        isCustom: false,
        formData: {
          ...DEFAULT_FORM_DATA,
          taxWithholdingStrategy: 'none',
          taxWithholdingMethod: 'taxBracket',
          taxFilingType: 'single',
          taxFixedAmount: 0,
          taxFixedPercent: 0,
          dripStrategy: 'percentage',
          dripPercentage: 100,
          dripFixedAmount: 0,
          fixedIncomeAmount: 0,
          startMonth: 1 // Default to January
        },
        customData: customProfile.data,
        hasCustomProfile: false
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return {
        profile: "midCareer" as ProfileType,
        isCustom: false,
        formData: {
          ...DEFAULT_FORM_DATA,
          taxWithholdingStrategy: 'none',
          taxWithholdingMethod: 'taxBracket',
          taxFilingType: 'single',
          taxFixedAmount: 0,
          taxFixedPercent: 0,
          dripStrategy: 'percentage',
          dripPercentage: 100,
          dripFixedAmount: 0,
          fixedIncomeAmount: 0,
          startMonth: 1 // Default to January
        },
        customData: customProfile.data,
        hasCustomProfile: false
      };
    }
  };

  const initialState = getInitialState();
  const [formData, setFormData] = useState(initialState.formData);
  const [customProfileData, setCustomProfileData] = useState<PortfolioFormData>(initialState.customData);
  const [, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>(initialState.profile);
  const [isCustomized, setIsCustomized] = useState(initialState.isCustom);
  const [hasCustomProfile, setHasCustomProfile] = useState(initialState.hasCustomProfile);
  const [results, setResults] = useState<{
    summary: CalculatedSummary;
    amortization: AmortizationEntry[];
  } | null>(null);

  // Save settings to localStorage when form data or profile changes (with debounce)
  useEffect(() => {
    const saveSettings = () => {
      try {
        setSaveStatus('saving');
        
        // Save the selected profile
        localStorage.setItem("selectedProfile", selectedProfile);
        
        // Format dates as ISO strings
        const processContributions = (contributions?: SupplementalContribution[]) => {
          if (!contributions) return [];
          
          return contributions.map((contribution: SupplementalContribution) => ({
            ...contribution,
            startDate: contribution.startDate instanceof Date ? contribution.startDate.toISOString() : contribution.startDate,
            endDate: contribution.endDate instanceof Date ? contribution.endDate.toISOString() : contribution.endDate
          }));
        };
        
        // Process form data with standardized date format
        const formDataToSave = {
          ...formData,
          supplementalContributions: processContributions(formData.supplementalContributions)
        };
        
        // For custom profile, we save the form data
        if (selectedProfile === "custom") {
          setCustomProfileData(formDataToSave);
          localStorage.setItem("customProfileData", JSON.stringify(formDataToSave));
        } else {
          // For standard profiles, we only need to save the custom profile data
          // for future use when switching to custom profile
          
          // Process customProfileData with ISO dates before saving
          const customProfileToSave = {
            ...customProfileData,
            supplementalContributions: processContributions(customProfileData.supplementalContributions)
          };
          
          // Save the customProfileData separately
          localStorage.setItem("customProfileData", JSON.stringify(customProfileToSave));
        }
        
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
  }, [formData, selectedProfile, customProfileData]);
  
  // Function to handle profile changes
  const handleProfileChange = (profile: ProfileType) => {
    setSelectedProfile(profile);
    
    if (profile !== "custom") {
      setFormData(getProfileData(profile));
      setIsCustomized(false);
    } else {
      // When switching to custom, use the saved customProfileData
      setFormData(customProfileData);
      setIsCustomized(true);
    }
  };

  // This function will be passed to AssumptionsForm to handle form data changes
  const handleFormChange = (newFormData: PortfolioFormData) => {
    // Check if the *investor profile fields* have changed from the selected profile
    if (selectedProfile !== "custom") {
      const profileData = getProfileData(selectedProfile);
      
      // Only check investor profile fields, not simulation parameters or loan settings
      const investorProfileFields = [
        'initialShareCount', 
        'initialInvestment', 
        'baseIncome', 
        'withholdTaxes'
      ];
      
      // Only check if investor profile fields have changed
      const hasInvestorProfileChanged = investorProfileFields.some(key => {
        return profileData[key as keyof typeof profileData] !== newFormData[key as keyof typeof newFormData];
      });
      
      if (hasInvestorProfileChanged) {
        setSelectedProfile("custom");
        setIsCustomized(true);
        setHasCustomProfile(true);
      }
    } else {
      // If already on custom profile, update customProfileData
      setCustomProfileData(newFormData);
      // Ensure the flags are set
      setIsCustomized(true);
      setHasCustomProfile(true);
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Helper functions to convert form values to appropriate numeric types
    const toNumber = (value: string | number | undefined): number => {
      if (value === "" || value === undefined) return 0;
      const parsed = parseFloat(String(value));
      return isNaN(parsed) ? 0 : parsed;
    };
    
    // Convert to integer for month fields
    const toInteger = (value: string | number | undefined): number => {
      if (value === "" || value === undefined) return 0;
      const parsed = parseFloat(String(value));
      return isNaN(parsed) ? 0 : Math.round(parsed);
    };
    
    // Map form data to assumptions with proper type conversion
    const assumptions = {
      // Investor Profile
      initialShareCount: toNumber(formData.initialShareCount),
      initialInvestment: toNumber(formData.initialInvestment),
      baseIncome: toNumber(formData.baseIncome),
      surplusForDripToPrincipalPercent: toNumber(formData.surplusForDripPercent),

      // Set withholdTaxes based on the new taxWithholdingStrategy
      withholdTaxes: formData.taxWithholdingStrategy !== 'none',

      // New tax withholding settings
      taxWithholdingStrategy: formData.taxWithholdingStrategy,
      taxWithholdingMethod: formData.taxWithholdingMethod,
      taxFilingType: formData.taxFilingType,
      taxFixedAmount: toNumber(formData.taxFixedAmount),
      taxFixedPercent: toNumber(formData.taxFixedPercent),

      // DRIP strategy settings
      dripStrategy: formData.dripStrategy,
      dripPercentage: toNumber(formData.dripPercentage),
      dripFixedAmount: toNumber(formData.dripFixedAmount),
      fixedIncomeAmount: toNumber(formData.fixedIncomeAmount),

      // Supplemental Contributions
      supplementalContributions: formData.supplementalContributions || [],

      // Simulation Parameters
      simulationMonths: toInteger(formData.simulationMonths),
      startMonth: toInteger(formData.startMonth) || 1, // Default to January if not set
      initialSharePrice: toNumber(formData.initialSharePrice),
      dividendYieldPer4wPercent: toNumber(formData.dividendYield4w),

      // Dividend Model Parameters
      dividendModel: formData.dividendModel || 'yieldBased',
      flatDividendAmount: toNumber(formData.flatDividendAmount),
      yieldPeriod: formData.yieldPeriod || '4w',
      dividendYieldPercent: toNumber(formData.dividendYieldPercent || formData.dividendYield4w),
      dividendVariableDistribution: formData.dividendVariableDistribution || 'uniform',
      dividendUniformMin: toNumber(formData.dividendUniformMin),
      dividendUniformMax: toNumber(formData.dividendUniformMax),
      dividendNormalMean: toNumber(formData.dividendNormalMean),
      dividendNormalStdDev: toNumber(formData.dividendNormalStdDev),
      dividendGbmDrift: toNumber(formData.dividendGbmDrift),
      dividendGbmVolatility: toNumber(formData.dividendGbmVolatility),
      initialDividendMethod: formData.initialDividendMethod || 'flatAmount',
      initialDividendAmount: toNumber(formData.initialDividendAmount),
      initialDividendYield: toNumber(formData.initialDividendYield),

      // Share Price Model
      sharePriceModel: formData.sharePriceModel || 'geometric',

      // Always include monthlyAppreciationPercent
      // For geometric model this is the primary configuration value
      monthlyAppreciationPercent: toNumber(formData.monthlyAppreciation),

      // Linear Model parameters
      linearChangeAmount: toNumber(formData.linearChangeAmount),

      // Variable Model parameters
      variableDistribution: formData.variableDistribution || 'uniform',
      uniformMin: toNumber(formData.uniformMin),
      uniformMax: toNumber(formData.uniformMax),
      normalMean: toNumber(formData.normalMean),
      normalStdDev: toNumber(formData.normalStdDev),
      gbmDrift: toNumber(formData.gbmDrift),
      gbmVolatility: toNumber(formData.gbmVolatility),

      // Loan Settings
      includeLoan: Boolean(formData.includeLoan),
      loanAmount: toNumber(formData.loanAmount),
      annualInterestRatePercent: toNumber(formData.annualInterestRate),
      amortizationMonths: toInteger(formData.amortizationMonths),
    };
    
    // Calculate results
    const calculationResults = calculatePortfolio(assumptions);
    setResults(calculationResults);
  };

  // Reset functionality removed as it's no longer used in the UI

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBlue-900 p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto bg-white dark:bg-darkBlue-800 shadow-lg rounded-lg p-6 md:p-8 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-200">MSTY Portfolio Simulator</h1>
          <div className="flex flex-wrap gap-3 items-center">
            <ThemeToggle />
            
            {/* Actions Dropdown Menu */}
            <DropdownMenu
              label="Actions"
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              }
              items={[
                {
                  label: "Help Guide",
                  icon: (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  ),
                  onClick: () => setIsHelpModalOpen(true)
                },
                {
                  label: "Share Configuration",
                  icon: (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                  ),
                  onClick: () => setShareModalOpen(true)
                },
                {
                  label: "GitHub Repository",
                  icon: (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  ),
                  onClick: () => window.open("https://github.com/davidpeden3/portfolio-sim", "_blank")
                }
              ]}
            />
          </div>
        </div>
        
        {/* ShareConfig Modal */}
        <Modal
          isOpen={isShareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title="Share Configuration"
          size="md"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                Share your settings with a link
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
                Copy the link below to share your current configuration with others.
              </p>
              
              <ShareConfig />
            </div>
          </div>
        </Modal>
        
        {/* Form with input fields */}
        <AssumptionsForm 
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          selectedProfile={selectedProfile}
          isCustomized={isCustomized}
          hasCustomProfile={hasCustomProfile}
          onProfileChange={handleProfileChange}
        />

        {results && (
          <div className="mt-8">
            <div className="border-t border-gray-200 dark:border-darkBlue-700 pt-8 transition-colors duration-200">
              <CalculatedSummaryDisplay summary={results.summary} />
              <PortfolioChart
                amortization={results.amortization}
                includeLoan={Boolean(formData.includeLoan)}
              />
              <AmortizationTable 
                amortization={results.amortization} 
                includeLoan={Boolean(formData.includeLoan)}
                includeTaxes={formData.taxWithholdingStrategy !== 'none'}
                taxStrategy={formData.taxWithholdingStrategy}
                startMonth={typeof formData.startMonth === 'string' ? parseInt(formData.startMonth) : (formData.startMonth || 1)}
                includeContributions={formData.supplementalContributions ? formData.supplementalContributions.some((c: SupplementalContribution) => c.enabled) : false}
              />
            </div>
          </div>
        )}
        
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-darkBlue-700 text-center text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
          <p className="mb-2">
            Find a bug? Have a feature request? Want to contribute?
          </p>
          <p>
            Visit the <a 
              href="https://github.com/davidpeden3/portfolio-sim/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-basshead-blue-500 hover:text-indigo-800 dark:hover:text-basshead-blue-400 font-medium transition-colors duration-200"
            >
              GitHub Issues page
            </a> to report bugs or suggest features.
          </p>
          <VersionFooter />
        </div>
        
        {/* Help Modal */}
        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
        />
      </div>
    </div>
  );
}