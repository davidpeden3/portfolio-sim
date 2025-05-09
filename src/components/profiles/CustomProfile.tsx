import React from 'react';
import ProfileCard from '../ProfileCard';
import { CustomIcon } from '../ProfileIcons';
import { ProfileType } from './types';
import { customProfile } from './profileExports';

interface CustomProfileProps {
  selectedProfile: ProfileType;
  onClick: (profileType: ProfileType) => void;
}

/**
 * Custom investor profile component
 */
const CustomProfile: React.FC<CustomProfileProps> = ({ 
  selectedProfile, 
  onClick 
}) => {
  return (
    <ProfileCard
      profileType="custom"
      selectedProfile={selectedProfile}
      name={customProfile.name}
      description={customProfile.description}
      icon={<CustomIcon />}
      onClick={onClick}
    />
  );
};

export default CustomProfile;