
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BiomarkerDetailDialogProps } from './types';
import DialogHeader from './dialog/DialogHeader';
import DialogContent from './dialog/DialogContent';
import DisclaimerFooter from './dialog/DisclaimerFooter';

const BiomarkerDetailDialog: React.FC<BiomarkerDetailDialogProps> = ({ 
  biomarker, 
  open, 
  onOpenChange 
}) => {
  if (!biomarker) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-4 md:p-6 biomarker-dialog-content">
        <DialogHeader biomarker={biomarker} />
        <DialogContent biomarker={biomarker} />
        <DisclaimerFooter />
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerDetailDialog;
