
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useRecordsState } from './hooks/useRecordsState';
import { useRecordsFilter } from './hooks/useRecordsFilter';
import { useRecordActions } from './hooks/useRecordActions';
import RecordsSearchBar from './components/RecordsSearchBar';
import RecordsTabs from './components/RecordsTabs';
import RecordsTable from './components/RecordsTable';
import EmptyState from './components/EmptyState';
import AddRecordDialog from '../patient-history/AddRecordDialog';

interface MedicalRecordsManagerProps {
  patientId?: string;
  onRecordUpdated?: () => void;
}

export const MedicalRecordsManager: React.FC<MedicalRecordsManagerProps> = ({
  patientId,
  onRecordUpdated
}) => {
  // State management hook
  const {
    records,
    setRecords,
    reports,
    searchTerm,
    setSearchTerm,
    recordType,
    setRecordType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    activeTab,
    setActiveTab
  } = useRecordsState(patientId);

  // Records filtering hook
  const {
    sortedRecords,
    sortedReports,
    combinedData
  } = useRecordsFilter(records, reports, searchTerm, recordType, sortBy, sortOrder);

  // Record actions hook
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    currentRecordType,
    recordForm,
    handleAddRecord,
    handleInputChange,
    handleFileChange,
    handleSelectChange,
    handleRecordSubmit,
    handleDeleteRecord
  } = useRecordActions(patientId, onRecordUpdated, setRecords);

  // Handle record type filter change
  const handleRecordTypeChange = (value: string) => {
    setRecordType(value);
  };

  // Handle sort toggle
  const handleSort = (field: 'date' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Medical Records Manager</CardTitle>
        <CardDescription>
          Manage and view all patient medical records and documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <RecordsTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onAddRecord={handleAddRecord}
          />
          
          <RecordsSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            recordType={recordType}
            onRecordTypeChange={handleRecordTypeChange}
          />
          
          <TabsContent value="all" className="mt-0">
            <RecordsTable
              data={combinedData}
              handleSort={handleSort}
              handleDeleteRecord={handleDeleteRecord}
              emptyMessage={
                <EmptyState 
                  searchTerm={searchTerm} 
                  type="all" 
                  onAddClick={() => handleAddRecord('clinicalNote')} 
                />
              }
            />
          </TabsContent>
          
          <TabsContent value="records" className="mt-0">
            <RecordsTable
              data={sortedRecords.map(record => ({
                id: record.id,
                name: record.name,
                date: record.date,
                type: record.recordType || record.type
              }))}
              handleSort={handleSort}
              handleDeleteRecord={id => handleDeleteRecord(id, false)}
              emptyMessage={
                <EmptyState 
                  searchTerm={searchTerm} 
                  type="record" 
                  onAddClick={() => handleAddRecord('clinicalNote')} 
                />
              }
            />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-0">
            <RecordsTable
              data={sortedReports.map(report => ({
                id: report.id,
                name: report.title,
                date: report.date,
                type: report.fileType,
                isReport: true
              }))}
              handleSort={handleSort}
              handleDeleteRecord={id => handleDeleteRecord(id, true)}
              emptyMessage={
                <EmptyState 
                  searchTerm={searchTerm} 
                  type="report" 
                  onAddClick={() => handleAddRecord('bloodTest')} 
                />
              }
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <AddRecordDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        recordType={currentRecordType}
        recordForm={recordForm}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleRecordSubmit}
      />
    </Card>
  );
};

export default MedicalRecordsManager;
