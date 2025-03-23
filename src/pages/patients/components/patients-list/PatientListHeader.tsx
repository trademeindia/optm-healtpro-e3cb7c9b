
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface PatientListHeaderProps {
  title: string;
  description: string;
}

export const PatientListHeader: React.FC<PatientListHeaderProps> = ({
  title,
  description,
}) => {
  const handleAddPatient = () => {
    toast.info("Add Patient", {
      description: "Opening new patient form",
      duration: 3000
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      
      <Button onClick={handleAddPatient} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Patient
      </Button>
    </div>
  );
};
