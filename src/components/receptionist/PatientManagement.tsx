
import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// This is a placeholder component for patient management (receptionist view)
// This will display only non-medical patient data for receptionists
const PatientManagement: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-8"
          />
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground">Patient management view will be implemented here</p>
          <p className="text-xs text-muted-foreground mt-2">
            Note: This view restricts access to medical records and shows only contact and appointment information
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
