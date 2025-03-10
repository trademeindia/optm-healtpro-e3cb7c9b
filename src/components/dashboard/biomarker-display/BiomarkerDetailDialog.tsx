
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent as UIDialogContent } from '@/components/ui/dialog';
import { BiomarkerDetailDialogProps } from './types';
import DialogHeader from './dialog/DialogHeader';
import DialogContentSection from './dialog/DialogContent';
import DisclaimerFooter from './dialog/DisclaimerFooter';

const BiomarkerDetailDialog: React.FC<BiomarkerDetailDialogProps> = ({ 
  biomarker, 
  open, 
  onOpenChange 
}) => {
  if (!biomarker) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <UIDialogContent className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-4 md:p-6 biomarker-dialog-content">
        <DialogHeader biomarker={biomarker} />
        <DialogContentSection biomarker={biomarker} />
        <DisclaimerFooter />
      </UIDialogContent>
    </Dialog>
  );
};

export default BiomarkerDetailDialog;
