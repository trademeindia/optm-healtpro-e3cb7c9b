
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MedicalRecord, Biomarker } from './types';

interface DeleteConfirmationDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  recordToDelete: MedicalRecord | null;
  biomarkerToDelete: Biomarker | null;
  handleDeleteRecord: () => void;
  handleDeleteBiomarker: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  showDialog,
  setShowDialog,
  recordToDelete,
  biomarkerToDelete,
  handleDeleteRecord,
  handleDeleteBiomarker
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {recordToDelete ? 'record' : 'biomarker'}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {recordToDelete && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="font-medium">{recordToDelete.title}</p>
              <p className="text-sm text-muted-foreground">Date: {recordToDelete.date}</p>
            </div>
          )}
          {biomarkerToDelete && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="font-medium">{biomarkerToDelete.name}</p>
              <p className="text-sm text-muted-foreground">
                Value: {biomarkerToDelete.value} {biomarkerToDelete.unit}
              </p>
              <p className="text-sm text-muted-foreground">Date: {biomarkerToDelete.timestamp}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={recordToDelete ? handleDeleteRecord : handleDeleteBiomarker}
          >
            Delete {recordToDelete ? 'Record' : 'Biomarker'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
