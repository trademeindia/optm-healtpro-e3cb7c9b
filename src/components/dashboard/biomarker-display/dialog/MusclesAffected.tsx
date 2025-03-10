
import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Biomarker } from '../types';
import { getAffectedMuscles } from '../biomarkerUtils';

interface MusclesAffectedProps {
  biomarker: Biomarker;
}

const MusclesAffected: React.FC<MusclesAffectedProps> = ({ biomarker }) => {
  const affectedMuscles = getAffectedMuscles(biomarker.name);
  const showMusclesSection = affectedMuscles.length > 0 && 
                            affectedMuscles[0] !== 'No direct skeletal muscle impact' &&
                            affectedMuscles[0] !== 'Information not available for this biomarker';
  
  if (!showMusclesSection) {
    return null;
  }
  
  return (
    <div className="bg-muted/60 p-4 rounded-lg">
      <h4 className="font-medium mb-2 flex items-center">
        <Dumbbell className="w-4 h-4 mr-2" />
        Potentially Affected Skeletal Muscles
      </h4>
      <ul className="list-disc ml-4 space-y-1 text-sm">
        {affectedMuscles.map((muscle, index) => (
          <li key={index}>{muscle}</li>
        ))}
      </ul>
      <p className="text-xs mt-2 text-muted-foreground">
        These skeletal muscle groups may be impacted by changes in this biomarker.
      </p>
    </div>
  );
};

export default MusclesAffected;
