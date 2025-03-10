
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BiomarkerDetailDialogProps } from './types';
import DialogHeader from './dialog/DialogHeader';
import BiomarkerBasicInfo from './dialog/BiomarkerBasicInfo';
import BiomarkerExplanation from './dialog/BiomarkerExplanation';
import MusclesAffected from './dialog/MusclesAffected';
import PossibleCauses from './dialog/PossibleCauses';
import Recommendations from './dialog/Recommendations';
import DisclaimerFooter from './dialog/DisclaimerFooter';

const BiomarkerDetailDialog: React.FC<BiomarkerDetailDialogProps> = ({ 
  biomarker, 
  open, 
  onOpenChange 
}) => {
  if (!biomarker) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader biomarker={biomarker} />
        
        <div className="space-y-4 py-4">
          <BiomarkerBasicInfo biomarker={biomarker} />
          <BiomarkerExplanation biomarker={biomarker} />
          <MusclesAffected biomarker={biomarker} />
          <PossibleCauses biomarker={biomarker} />
          <Recommendations biomarker={biomarker} />
          <DisclaimerFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerDetailDialog;
