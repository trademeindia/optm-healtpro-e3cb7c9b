
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPatientDialog: React.FC<AddPatientDialogProps> = ({ open, onOpenChange }) => {
  const handleAddPatient = () => {
    toast.success("Patient added successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground mb-4">
            This is where you would add a new patient form. You can integrate with your existing patient registration system.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input className="w-full px-3 py-2 border rounded-md" placeholder="Enter first name" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input className="w-full px-3 py-2 border rounded-md" placeholder="Enter last name" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input className="w-full px-3 py-2 border rounded-md" placeholder="patient@example.com" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input className="w-full px-3 py-2 border rounded-md" placeholder="(123) 456-7890" />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleAddPatient}>Add Patient</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
