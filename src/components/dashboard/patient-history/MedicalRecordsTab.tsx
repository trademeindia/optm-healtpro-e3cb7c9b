
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MedicalRecordsList from './MedicalRecordsList';
import { MedicalRecord } from './types';

interface MedicalRecordsTabProps {
  type: 'xray' | 'bloodTest' | 'medication' | 'notes';
  records: MedicalRecord[];
  handleUploadClick: (type: 'xray' | 'bloodTest' | 'medication' | 'notes') => void;
  confirmDelete: (record: MedicalRecord) => void;
}

const MedicalRecordsTab: React.FC<MedicalRecordsTabProps> = ({ 
  type, 
  records, 
  handleUploadClick, 
  confirmDelete 
}) => {
  const getTitle = () => {
    switch(type) {
      case 'xray': return 'X-Rays & Scan Reports';
      case 'bloodTest': return 'Blood Test Results';
      case 'medication': return 'Prescribed Medications';
      case 'notes': return 'Clinical Notes';
      default: return '';
    }
  };

  const getDescription = () => {
    switch(type) {
      case 'xray': return 'All imaging studies for this patient';
      case 'bloodTest': return 'Laboratory test results';
      case 'medication': return 'Current and past medications';
      case 'notes': return 'Doctor notes and observations';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <Button onClick={() => handleUploadClick(type)}>
          <Plus className="h-4 w-4 mr-2" />
          {type === 'notes' ? 'Add Note' : 'Add Record'}
        </Button>
      </CardHeader>
      <CardContent>
        <MedicalRecordsList 
          records={records} 
          confirmDelete={confirmDelete}
          recordType={type}
        />
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsTab;
