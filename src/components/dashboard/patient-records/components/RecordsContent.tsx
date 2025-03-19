
import React from 'react';
import RecordsTable from './RecordsTable';
import EmptyState from './EmptyState';
import { RecordItem } from '../types';
import { useAuth } from '@/contexts/auth';

interface RecordsContentProps {
  activeTab: string;
  filteredRecords: RecordItem[];
  filteredReports: RecordItem[];
  handleSort: (field: 'date' | 'name') => void;
  handleDeleteRecord: (id: string, isReport?: boolean) => boolean;
  handleAddButtonClick: (type: 'record' | 'report') => void;
}

const RecordsContent: React.FC<RecordsContentProps> = ({
  activeTab,
  filteredRecords,
  filteredReports,
  handleSort,
  handleDeleteRecord,
  handleAddButtonClick
}) => {
  const { user } = useAuth();
  const canAddRecords = user?.role === 'doctor' || user?.role === 'admin';

  return (
    <div className="mt-4">
      {activeTab === 'records' ? (
        filteredRecords.length > 0 ? (
          <RecordsTable 
            data={filteredRecords}
            handleSort={handleSort}
            handleDeleteRecord={handleDeleteRecord}
          />
        ) : (
          <EmptyState 
            message="No medical records found"
            description="There are no medical records for this patient. Add a new record to get started."
            buttonText={canAddRecords ? "Add Record" : undefined}
            onButtonClick={canAddRecords ? () => handleAddButtonClick('record') : undefined}
          />
        )
      ) : (
        filteredReports.length > 0 ? (
          <RecordsTable 
            data={filteredReports}
            handleSort={handleSort}
            handleDeleteRecord={id => handleDeleteRecord(id, true)}
          />
        ) : (
          <EmptyState 
            message="No reports found"
            description="There are no reports for this patient. Add a new report to get started."
            buttonText={canAddRecords ? "Add Report" : undefined}
            onButtonClick={canAddRecords ? () => handleAddButtonClick('report') : undefined}
          />
        )
      )}
    </div>
  );
};

export default RecordsContent;
