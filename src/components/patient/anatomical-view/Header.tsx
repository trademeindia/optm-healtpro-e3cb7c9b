
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { SystemSelector } from './';
import { BodySystem } from './types';

interface HeaderProps {
  systems: BodySystem[];
  activeSystem: string;
  onSystemChange: (value: string) => void;
  isEditMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  systems, 
  activeSystem, 
  onSystemChange,
  isEditMode = false
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>3D Anatomical View</CardTitle>
        <CardDescription>
          {isEditMode 
            ? "Edit mode - click on the model to add new issues" 
            : "Interactive visualization of patient issues"
          }
        </CardDescription>
      </div>
      
      <SystemSelector 
        systems={systems} 
        activeSystem={activeSystem} 
        onSystemChange={onSystemChange} 
      />
    </div>
  );
};

export default Header;
