
import React from 'react';
import { Patient } from '../../types';

interface PatientsTableProps {
  patients: Patient[];
  onViewPatient: (patientId: number) => void;
  children: React.ReactNode;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  onViewPatient,
  children
}) => {
  return (
    <div className="overflow-x-auto responsive-table">
      <table className="w-full border-collapse">
        {children}
      </table>
      
      {patients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No patients found matching your search.</p>
        </div>
      )}
    </div>
  );
};
