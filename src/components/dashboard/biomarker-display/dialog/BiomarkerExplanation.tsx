
import React from 'react';
import { Biomarker } from '../types';
import { getStatusDescription, getTrendDescription } from '../biomarkerUtils';

interface BiomarkerExplanationProps {
  biomarker: Biomarker;
}

const BiomarkerExplanation: React.FC<BiomarkerExplanationProps> = ({ biomarker }) => {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h4 className="font-medium mb-2">What does this mean?</h4>
      <p className="text-sm">{getStatusDescription(biomarker.status, biomarker.name)}</p>
      {biomarker.description && (
        <div className="mt-2">
          <h4 className="font-medium mb-1">About this biomarker</h4>
          <p className="text-sm">{biomarker.description}</p>
        </div>
      )}
      <div className="mt-2">
        <h4 className="font-medium mb-1">Trend analysis</h4>
        <p className="text-sm">{getTrendDescription(biomarker.trend, biomarker.status)}</p>
      </div>
    </div>
  );
};

export default BiomarkerExplanation;
