
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
    <div className="bg-muted/50 p-4 md:p-6 rounded-lg space-y-3 biomarker-detail-section">
      <h4 className="font-semibold text-base flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Possible Causes
      </h4>
      <ul className="list-disc pl-5 md:pl-6 space-y-1.5 md:space-y-2">
        {biomarker.possibleCauses.map((cause, index) => (
          <li key={index} className="text-muted-foreground text-sm break-words">{cause}</li>
        ))}
      </ul>
    </div>
  );
};

export default PossibleCauses;
