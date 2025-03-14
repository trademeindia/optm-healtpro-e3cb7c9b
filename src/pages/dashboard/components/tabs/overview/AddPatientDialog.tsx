
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PatientFormFields from './components/PatientFormFields';
import { usePatientForm, Patient } from './hooks/usePatientForm';

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPatient?: (patient: Partial<Patient>) => void;
}

const AddPatientDialog: React.FC<AddPatientDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAddPatient 
}) => {
  const { 
    formState, 
    errors, 
    handleInputChange, 
    handleSubmit, 
    resetForm 
  } = usePatientForm(
    onAddPatient, 
    () => onOpenChange(false)
  );

  // Only reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        resetForm();
      }, 100); // Add a small delay to avoid state updates during render
    }
  }, [open]); // Only depend on open state, not resetForm

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <PatientFormFields
            formState={formState}
            errors={errors}
            onChange={handleInputChange}
          />
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Patient</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
