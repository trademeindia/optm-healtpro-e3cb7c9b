
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { MedicalRecord } from './types';

interface MedicalRecordsListProps {
  records: MedicalRecord[];
  confirmDelete: (record: MedicalRecord) => void;
  recordType: string;
}

const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({ 
  records, 
  confirmDelete,
  recordType
}) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {recordType === 'xray' ? 'X-Ray or scan' : recordType === 'bloodTest' ? 'blood test' : recordType === 'medication' ? 'medication' : 'clinical note'} records found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{record.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">Date: {record.date}</p>
              <p className="text-sm mb-2">{record.details}</p>
              {record.fileUrl && record.fileSize && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>File size: {record.fileSize}</span>
                  <Button variant="link" size="sm" className="h-auto p-0">View File</Button>
                  <Button variant="link" size="sm" className="h-auto p-0">Download</Button>
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => confirmDelete(record)}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicalRecordsList;
