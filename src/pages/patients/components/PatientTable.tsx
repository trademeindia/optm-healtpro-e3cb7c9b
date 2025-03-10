
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { PatientTableProps } from '../types';
import { PatientTableRow } from './PatientTableRow';
import { PatientTablePagination } from './PatientTablePagination';

export const PatientTable: React.FC<PatientTableProps> = ({ 
  patients, 
  filteredCount,
  totalCount,
  onViewPatient, 
  onScheduleAppointment, 
  onViewOptions 
}) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-1">
                  Patient
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-1">
                  Diagnosis
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ICD Code</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Visit</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Next Appointment</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <PatientTableRow
                key={patient.id}
                patient={patient}
                onViewPatient={onViewPatient}
                onScheduleAppointment={onScheduleAppointment}
                onViewOptions={onViewOptions}
              />
            ))}
          </tbody>
        </table>
        
        {patients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No patients found matching your search.</p>
          </div>
        )}
      </div>
      
      <PatientTablePagination 
        filteredCount={filteredCount} 
        totalCount={totalCount} 
      />
    </>
  );
};
