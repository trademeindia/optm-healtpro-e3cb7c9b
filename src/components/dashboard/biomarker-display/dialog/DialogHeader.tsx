
import React from 'react';
import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getStatusBgColor } from '../biomarkerUtils';
import { Biomarker } from '../types';

interface DialogHeaderProps {
  biomarker: Biomarker;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ biomarker }) => {
  return (
    <UIDialogHeader className="space-y-2 pb-4 border-b">
      <DialogTitle className="flex items-center gap-2 text-xl">
        {biomarker.name}
        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBgColor(biomarker.status)}`}>
          {biomarker.status.charAt(0).toUpperCase() + biomarker.status.slice(1)}
        </span>
      </DialogTitle>
      <DialogDescription className="text-sm">
        Detailed information about your {biomarker.name} biomarker
      </DialogDescription>
    </UIDialogHeader>
  );
};

export default DialogHeader;
