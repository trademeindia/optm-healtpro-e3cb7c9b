
import React from 'react';
import { Activity } from 'lucide-react';
import { Biomarker } from '../types';

interface PossibleCausesProps {
  biomarker: Biomarker;
}

const PossibleCauses: React.FC<PossibleCausesProps> = ({ biomarker }) => {
  if (!biomarker.possibleCauses || biomarker.possibleCauses.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h4 className="font-medium mb-2 flex items-center">
        <Activity className="w-4 h-4 mr-2" />
        Possible Causes
      </h4>
      <ul className="list-disc pl-5 space-y-1">
        {biomarker.possibleCauses.map((cause, index) => (
          <li key={index} className="text-sm text-muted-foreground">{cause}</li>
        ))}
      </ul>
    </div>
  );
};

export default PossibleCauses;
