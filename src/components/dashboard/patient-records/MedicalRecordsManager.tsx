
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecordActions } from './hooks/useRecordActions';
import { useRecordsFilter } from './hooks/useRecordsFilter';
import { useRecordsForm } from './hooks/useRecordsForm';
import RecordsTabs from './components/RecordsTabs';
import RecordsToolbar from './components/RecordsToolbar';
import RecordsContent from './components/RecordsContent';
import AddRecordDialog from './components/AddRecordDialog';

interface MedicalRecordsManagerProps {
  patientId: string;
}

const MedicalRecordsManager: React.FC<MedicalRecordsManagerProps> = ({ patientId }) => {
  const { 
    records, 
    reports, 
    sortedRecords, 
    sortedReports, 
    sortField, 
    sortDirection, 
    loadRecords, 
    handleSort, 
    handleAddRecord,
    handleAddReport,
    handleDeleteRecord 
  } = useRecordActions(patientId);

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    currentRecordType,
    recordForm,
    handleInputChange,
    handleFileChange,
    handleSelectChange,
    handleRecordSubmit,
    handleAddButtonClick
  } = useRecordsForm(patientId, handleAddRecord, handleAddReport);

  const { 
    searchTerm, 
    setSearchTerm, 
    filteredRecords,
    filteredReports,
    activeTab,
    setActiveTab
  } = useRecordsFilter(sortedRecords, sortedReports);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const recordTypesOptions = [
    'Medical Report',
    'Lab Test',
    'Imaging',
    'Prescription',
    'Therapy Plan',
    'Progress Note',
    'Discharge Summary',
    'Other'
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Patient Medical Records</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <RecordsToolbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddButtonClick={handleAddButtonClick}
          />
          
          <RecordsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            recordsCount={records.length}
            reportsCount={reports.length}
          />
          
          <RecordsContent 
            activeTab={activeTab}
            filteredRecords={filteredRecords}
            filteredReports={filteredReports}
            handleSort={handleSort}
            handleDeleteRecord={handleDeleteRecord}
            handleAddButtonClick={handleAddButtonClick}
          />
        </div>
        
        <AddRecordDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          recordType={currentRecordType}
          recordForm={recordForm}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onSelectChange={handleSelectChange}
          onSubmit={handleRecordSubmit}
          recordTypesOptions={recordTypesOptions}
        />
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsManager;
