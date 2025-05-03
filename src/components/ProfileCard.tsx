import React from 'react';
import { ProfileType } from './profiles/types';

interface ProfileCardProps {
  profileType: ProfileType;
  selectedProfile: ProfileType;
  name: string;
  description: string;
  icon: React.ReactNode;
  onClick: (profile: ProfileType) => void;
}

/**
 * A reusable card component for investor profiles
 */
const ProfileCard: React.FC<ProfileCardProps> = ({
  profileType,
  selectedProfile,
  name,
  description,
  icon,
  onClick
}) => {
  const isSelected = selectedProfile === profileType;
  
  return (
    <div 
      onClick={() => onClick(profileType)}
      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? "border-indigo-500 dark:border-basshead-blue-500 bg-indigo-50 dark:bg-darkBlue-700 shadow-sm" 
          : "border-gray-200 dark:border-darkBlue-600 hover:border-indigo-300 dark:hover:border-basshead-blue-600 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center mb-1">
        <div className={`mr-2 ${isSelected ? "text-indigo-600 dark:text-basshead-blue-500" : "text-gray-500 dark:text-gray-400"} transition-colors duration-200`}>
          {icon}
        </div>
        <h4 className="font-medium text-sm text-gray-900 dark:text-white transition-colors duration-200">
          {name}
        </h4>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 transition-colors duration-200">
        {description}
      </p>
    </div>
  );
};

export default ProfileCard;