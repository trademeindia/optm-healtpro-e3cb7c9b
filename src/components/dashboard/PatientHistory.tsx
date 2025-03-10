
import React, { useState } from 'react';
import { toast } from "sonner";
import MedicalRecordsTabs from '@/components/patient/MedicalRecordsTabs';
import DeleteConfirmDialog from './patient-history/DeleteConfirmDialog';
import AddRecordDialog from './patient-history/AddRecordDialog';
import HeaderActions from './patient-history/HeaderActions';
import MainContent from './patient-history/MainContent';
import { PatientHistoryProps, RecordFormData } from './patient-history/types';

const PatientHistory: React.FC<PatientHistoryProps> = ({ patient, onClose, onUpdate }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddRecordDialog, setShowAddRecordDialog] = useState(false);
  const [recordType, setRecordType] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [recordForm, setRecordForm] = useState<RecordFormData>({
    name: '',
    date: '',
    type: '',
    notes: '',
    file: null
  });

  const handleAddRecord = (type: string) => {
    setRecordType(type);
    setShowAddRecordDialog(true);
  };

  const handleRecordSubmit = () => {
    toast.success("Record Added", {
      description: `${recordForm.name} has been added to the patient's records.`,
      duration: 3000
    });
    setShowAddRecordDialog(false);
    setRecordForm({
      name: '',
      date: '',
      type: '',
      notes: '',
      file: null
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setRecordForm({
        ...recordForm,
        file: e.target.files[0]
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecordForm({
      ...recordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setRecordForm({
      ...recordForm,
      type: value
    });
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    toast.success("Region Selected", {
      description: `You selected the ${region} region.`,
      duration: 3000
    });
  };

  const handleAssignTests = () => {
    toast.success("Tests Assigned", {
      description: "Lab tests have been assigned to this patient.",
      duration: 3000
    });
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    toast.success("Record Deleted", {
      description: "The patient record has been permanently deleted.",
      duration: 3000
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      <HeaderActions 
        onClose={onClose} 
        onDelete={() => setShowDeleteConfirm(true)} 
      />

      <MainContent 
        patient={patient}
        selectedRegion={selectedRegion}
        onSelectRegion={handleRegionSelect}
        onAssignTests={handleAssignTests}
      />

      {/* Medical Records Tabs Section */}
      <div className="mt-6">
        <MedicalRecordsTabs 
          patientId={patient.id}
          onAddRecord={handleAddRecord}
        />
      </div>

      <DeleteConfirmDialog 
        open={showDeleteConfirm} 
        onOpenChange={setShowDeleteConfirm}
        onDelete={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <AddRecordDialog 
        open={showAddRecordDialog}
        onOpenChange={setShowAddRecordDialog}
        recordType={recordType}
        recordForm={recordForm}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleRecordSubmit}
      />
    </div>
  );
};

export default PatientHistory;
