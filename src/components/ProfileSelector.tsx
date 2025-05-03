import React from 'react';
import { ProfileType } from './profiles/profileConstants';
import { 
  EarlyCareerProfile, 
  MidCareerProfile, 
  RetirementProfile, 
  CustomProfile
} from './profiles';

interface ProfileSelectorProps {
  selectedProfile: ProfileType;
  onProfileChange: (profileType: ProfileType) => void;
  hasCustomProfile?: boolean;
}

/**
 * A component that manages the display and selection of investor profiles
 */
const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  selectedProfile,
  onProfileChange,
  hasCustomProfile = false
}) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 transition-colors duration-200">
        Select a predefined profile or customize your own:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <EarlyCareerProfile 
          selectedProfile={selectedProfile} 
          onClick={onProfileChange} 
        />
        
        <MidCareerProfile 
          selectedProfile={selectedProfile} 
          onClick={onProfileChange} 
        />
        
        <RetirementProfile 
          selectedProfile={selectedProfile} 
          onClick={onProfileChange} 
        />
        
        {hasCustomProfile && (
          <CustomProfile 
            selectedProfile={selectedProfile} 
            onClick={onProfileChange} 
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;