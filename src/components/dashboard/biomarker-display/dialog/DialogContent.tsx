
import React from 'react';
import { Biomarker } from '../utils/types';
import BiomarkerBasicInfo from './BiomarkerBasicInfo';
import BiomarkerExplanation from './BiomarkerExplanation';
import MusclesAffected from './MusclesAffected';
import PossibleCauses from './PossibleCauses';
import Recommendations from './Recommendations';

interface DialogContentProps {
  biomarker: Biomarker;
}

const DialogContentSection: React.FC<DialogContentProps> = ({ biomarker }) => {
  return (
    <div className="space-y-4 md:space-y-6 py-4 md:py-6 biomarker-dialog-section">
      <BiomarkerBasicInfo biomarker={biomarker} />
      <BiomarkerExplanation biomarker={biomarker} />
      <MusclesAffected biomarker={biomarker} />
      <PossibleCauses biomarker={biomarker} />
      <Recommendations biomarker={biomarker} />
    </div>
  );
};

export default DialogContentSection;
