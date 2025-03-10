
import React from 'react';
import { FileText, Calendar, User, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface PatientRecordsTableRowProps {
  patient: Patient;
  onViewRecords: (patientId: number) => void;
  onScheduleAppointment: (patientId: number) => void;
  onEditProfile: (patientId: number) => void;
  onViewOptions: (patientId: number) => void;
}

export const PatientRecordsTableRow: React.FC<PatientRecordsTableRowProps> = ({ 
  patient, 
  onViewRecords, 
  onScheduleAppointment, 
  onEditProfile, 
  onViewOptions 
}) => {
  return (
    <tr 
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
      onClick={() => onViewRecords(patient.id)}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">
            {patient.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div className="font-medium">{patient.name}</div>
            <div className="text-xs text-muted-foreground">
              {patient.age} years • {patient.gender}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm">{patient.condition}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-mono">{patient.icdCode}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm">{patient.lastVisit}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm">{patient.nextVisit}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onViewRecords(patient.id);
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onScheduleAppointment(patient.id);
            }}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEditProfile(patient.id);
            }}
          >
            <User className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onViewOptions(patient.id);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
