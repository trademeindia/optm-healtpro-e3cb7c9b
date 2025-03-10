
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewPatientForm from './NewPatientForm';

interface NewPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSavePatient: (patientData: any) => void;
}

const NewPatientDialog: React.FC<NewPatientDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSavePatient 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <NewPatientForm 
        onSave={(patientData) => {
          onSavePatient(patientData);
          onOpenChange(false);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </Dialog>
  );
};

export default NewPatientDialog;
