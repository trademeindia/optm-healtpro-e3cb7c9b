
import React, { useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRecordActions } from './hooks/useRecordActions';
import { useRecordsFilter } from './hooks/useRecordsFilter';
import RecordsTable from './components/RecordsTable';
import RecordsTabs from './components/RecordsTabs';
import RecordsSearchBar from './components/RecordsSearchBar';
import EmptyState from './components/EmptyState';
import { useRecordsForm, RecordFormData } from './hooks/useRecordsForm';
import { useAuth } from '@/contexts/auth';

interface MedicalRecordsManagerProps {
  patientId: string;
}

const MedicalRecordsManager: React.FC<MedicalRecordsManagerProps> = ({ patientId }) => {
  const { user } = useAuth();
  
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

  const canAddRecords = user?.role === 'doctor' || user?.role === 'admin';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Patient Medical Records</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <RecordsSearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            
            {canAddRecords && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleAddButtonClick('record')}>
                  Add Record
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAddButtonClick('report')}>
                  Add Report
                </Button>
              </div>
            )}
          </div>
          
          <RecordsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            recordsCount={records.length}
            reportsCount={reports.length}
          />
          
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
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                Add New {currentRecordType === 'record' ? 'Medical Record' : 'Report'}
              </DialogTitle>
              <DialogDescription>
                Enter the details below to add a new {currentRecordType === 'record' ? 'medical record' : 'report'} for this patient.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleRecordSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={recordForm.name} onChange={handleInputChange} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" id="date" name="date" value={recordForm.date} onChange={handleInputChange} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" value={recordForm.type} onValueChange={(value) => handleSelectChange({ target: { name: 'type', value } } as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypesOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={recordForm.description} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Upload File (optional)</Label>
                <Input id="file" name="file" type="file" onChange={handleFileChange} />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsManager;
