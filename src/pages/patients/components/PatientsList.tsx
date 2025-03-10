
import React, { useState } from 'react';
import { PatientsListProps } from '../types';
import { PatientStatistics } from './PatientStatistics';
import { 
  PatientListHeader, 
  PatientSearch, 
  PatientsTable,
  PaginationFooter
} from './patients-list';

export const PatientsList: React.FC<PatientsListProps> = ({ patients, onViewPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.icdCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <PatientListHeader 
          title="Patient Records" 
          description="View and manage all patient information" 
        />
        
        <div className="mb-6">
          <PatientSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
        
        <PatientsTable 
          patients={filteredPatients}
          onViewPatient={onViewPatient}
        />
        
        <PaginationFooter 
          totalCount={patients.length}
          filteredCount={filteredPatients.length}
        />
      </div>
      
      <PatientStatistics patients={patients} />
    </div>
  );
};
