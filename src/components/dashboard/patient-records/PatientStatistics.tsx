
import React from 'react';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  address: string;
  phone: string;
  email: string;
  condition: string;
  icdCode: string;
  lastVisit: string;
  nextVisit: string;
  medicalRecords?: any[];
}

interface PatientStatisticsProps {
  patients: Patient[];
}

export const PatientStatistics: React.FC<PatientStatisticsProps> = ({ patients }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Patient Statistics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Patients</div>
          <div className="text-2xl font-bold">{patients.length}</div>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Active Treatments</div>
          <div className="text-2xl font-bold">2</div>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">This Week's Appointments</div>
          <div className="text-2xl font-bold">5</div>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">New Patients (Monthly)</div>
          <div className="text-2xl font-bold">8</div>
        </div>
      </div>
    </div>
  );
};
