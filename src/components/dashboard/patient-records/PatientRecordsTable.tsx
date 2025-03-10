
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { PatientRecordsTableRow } from './PatientRecordsTableRow';
import { PatientRecordsPagination } from './PatientRecordsPagination';

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

interface PatientRecordsTableProps {
  patients: Patient[];
  filteredCount: number;
  totalCount: number;
  onViewRecords: (patientId: number) => void;
  onScheduleAppointment: (patientId: number) => void;
  onEditProfile: (patientId: number) => void;
  onViewOptions: (patientId: number) => void;
}

export const PatientRecordsTable: React.FC<PatientRecordsTableProps> = ({
  patients,
  filteredCount,
  totalCount,
  onViewRecords,
  onScheduleAppointment,
  onEditProfile,
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
              <PatientRecordsTableRow
                key={patient.id}
                patient={patient}
                onViewRecords={onViewRecords}
                onScheduleAppointment={onScheduleAppointment}
                onEditProfile={onEditProfile}
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
      
      <PatientRecordsPagination 
        filteredCount={filteredCount} 
        totalCount={totalCount} 
      />
    </>
  );
};
