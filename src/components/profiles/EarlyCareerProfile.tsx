import React from 'react';
import ProfileCard from '../ProfileCard';
import { EarlyCareerIcon } from '../ProfileIcons';
import { ProfileType } from './types';
import { earlyCareerProfile } from './profileExports';

interface EarlyCareerProfileProps {
  selectedProfile: ProfileType;
  onClick: (profileType: ProfileType) => void;
}

/**
 * Early Career investor profile component
 */
const EarlyCareerProfile: React.FC<EarlyCareerProfileProps> = ({ 
  selectedProfile, 
  onClick 
}) => {
  return (
    <ProfileCard
      profileType="earlyCareer"
      selectedProfile={selectedProfile}
      name={earlyCareerProfile.name}
      description={earlyCareerProfile.description}
      icon={<EarlyCareerIcon />}
      onClick={onClick}
    />
  );
};

export default EarlyCareerProfile;