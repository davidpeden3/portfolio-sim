import React from 'react';
import ProfileCard from '../ProfileCard';
import { RetirementIcon } from '../ProfileIcons';
import { ProfileType } from './types';
import { retirementProfile } from './profileExports';

interface RetirementProfileProps {
  selectedProfile: ProfileType;
  onClick: (profileType: ProfileType) => void;
}

/**
 * Retirement investor profile component
 */
const RetirementProfile: React.FC<RetirementProfileProps> = ({ 
  selectedProfile, 
  onClick 
}) => {
  return (
    <ProfileCard
      profileType="retirement"
      selectedProfile={selectedProfile}
      name={retirementProfile.name}
      description={retirementProfile.description}
      icon={<RetirementIcon />}
      onClick={onClick}
    />
  );
};

export default RetirementProfile;