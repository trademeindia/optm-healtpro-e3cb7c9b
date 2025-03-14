
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { SystemSelector } from './';
import { BodySystem } from './types';
import { Badge } from '@/components/ui/badge';

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
        <div className="flex items-center gap-2">
          <CardTitle>3D Anatomical View</CardTitle>
          {isEditMode && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Edit Mode Active
            </Badge>
          )}
        </div>
        <CardDescription>
          {isEditMode ? "Add or edit patient anatomical issues" : "Interactive visualization of patient issues"}
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
