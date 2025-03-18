
import React from 'react';
import BiomarkerDisplayContainer from './biomarker-display';
import { Biomarker } from './biomarker-display/types';
import EmptyBiomarkerState from './biomarker-display/EmptyBiomarkerState';

interface BiomarkerDisplayProps {
  biomarkers: Biomarker[];
}

const BiomarkerDisplay: React.FC<BiomarkerDisplayProps> = ({ biomarkers }) => {
  // Make sure biomarkers is always an array
  const safeBiomarkers = Array.isArray(biomarkers) ? biomarkers : [];
  
  // Add console log for debugging
  console.log('BiomarkerDisplay: Rendering with', safeBiomarkers.length, 'biomarkers');
  
  if (safeBiomarkers.length === 0) {
    return <EmptyBiomarkerState />;
  }
  
  return <BiomarkerDisplayContainer biomarkers={safeBiomarkers} />;
};

export default BiomarkerDisplay;
