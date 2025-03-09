
import React from 'react';
import PatientHistory from '@/components/dashboard/PatientHistory';
import { PatientDetailsProps } from '../types';

export const PatientDetails: React.FC<PatientDetailsProps> = ({ 
  patient, 
  onClose, 
  onUpdate 
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <PatientHistory 
        patient={patient}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    </div>
  );
};
