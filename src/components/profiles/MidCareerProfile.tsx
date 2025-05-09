import React from 'react';
import ProfileCard from '../ProfileCard';
import { MidCareerIcon } from '../ProfileIcons';
import { ProfileType } from './types';
import { midCareerProfile } from './profileExports';

interface MidCareerProfileProps {
  selectedProfile: ProfileType;
  onClick: (profileType: ProfileType) => void;
}

/**
 * Mid-Career investor profile component
 */
const MidCareerProfile: React.FC<MidCareerProfileProps> = ({ 
  selectedProfile, 
  onClick 
}) => {
  return (
    <ProfileCard
      profileType="midCareer"
      selectedProfile={selectedProfile}
      name={midCareerProfile.name}
      description={midCareerProfile.description}
      icon={<MidCareerIcon />}
      onClick={onClick}
    />
  );
};

export default MidCareerProfile;