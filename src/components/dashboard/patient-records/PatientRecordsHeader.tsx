
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PatientRecordsHeaderProps {
  onAddPatient: () => void;
}

export const PatientRecordsHeader: React.FC<PatientRecordsHeaderProps> = ({ 
  onAddPatient 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Records</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          View and manage all patient information
        </p>
      </div>
      
      <Button onClick={onAddPatient} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Patient
      </Button>
    </div>
  );
};
