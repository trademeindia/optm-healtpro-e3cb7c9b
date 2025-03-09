import React, { useState } from 'react';
import { ArrowLeft, Edit, X, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import BiomarkerDisplay from './BiomarkerDisplay';
import { PatientHistoryProps, MedicalRecord, Biomarker } from './patient-history/types';
import PatientProfileCard from './patient-history/PatientProfileCard';
import MedicalRecordsTab from './patient-history/MedicalRecordsTab';
import RecordDialog from './patient-history/RecordDialog';
import BiomarkerDialog from './patient-history/BiomarkerDialog';
import DeleteConfirmationDialog from './patient-history/DeleteConfirmationDialog';

const PatientHistory: React.FC<PatientHistoryProps> = ({ patient, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("xray");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'xray' | 'bloodTest' | 'medication' | 'notes'>('xray');
  const [editedPatient, setEditedPatient] = useState<typeof patient>({ ...patient });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<MedicalRecord | null>(null);
  const [biomarkerToDelete, setBiomarkerToDelete] = useState<Biomarker | null>(null);
  const [showAddBiomarkerDialog, setShowAddBiomarkerDialog] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
    title: '',
    details: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [newBiomarker, setNewBiomarker] = useState<Partial<Biomarker>>({
    name: '',
    value: 0,
    unit: '',
    normalRange: '',
    status: 'normal',
    timestamp: new Date().toISOString().split('T')[0]
  });
  
  const { toast } = useToast();

  if (!patient.medicalRecords) {
    patient.medicalRecords = [
      {
        id: 'rec1',
        type: 'xray',
        title: 'Chest X-Ray',
        date: '2023-05-15',
        details: 'No abnormalities detected',
        fileUrl: '/placeholder.svg',
        fileSize: '3.2 MB'
      },
      {
        id: 'rec2',
        type: 'bloodTest',
        title: 'Complete Blood Count',
        date: '2023-05-10',
        details: 'All values within normal range',
        fileUrl: '/placeholder.svg',
        fileSize: '1.5 MB'
      },
      {
        id: 'rec3',
        type: 'medication',
        title: 'Ibuprofen 400mg',
        date: '2023-05-01',
        details: 'Take as needed for pain, not to exceed 3 tablets per day',
        fileUrl: '/placeholder.svg',
        fileSize: '0.5 MB'
      }
    ];
  }

  if (!patient.biomarkers) {
    patient.biomarkers = [
      {
        id: 'bio1',
        name: 'C-Reactive Protein (CRP)',
        value: 5.5,
        unit: 'mg/L',
        normalRange: '0.0 - 8.0',
        status: 'normal',
        timestamp: '2023-05-15'
      },
      {
        id: 'bio2',
        name: 'Interleukin-6 (IL-6)',
        value: 12.8,
        unit: 'pg/mL',
        normalRange: '0.0 - 7.0',
        status: 'elevated',
        timestamp: '2023-05-15'
      }
    ];
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    onUpdate(editedPatient);
    setEditMode(false);
    toast({
      title: "Profile Updated",
      description: "Patient profile has been successfully updated.",
    });
  };

  const handleAddRecord = () => {
    if (!newRecord.title) {
      toast({
        title: "Error",
        description: "Please enter a title for the record.",
        variant: "destructive"
      });
      return;
    }

    const record: MedicalRecord = {
      id: `rec-${Date.now()}`,
      type: uploadType,
      title: newRecord.title || '',
      date: newRecord.date || new Date().toISOString().split('T')[0],
      details: newRecord.details || '',
      fileUrl: '/placeholder.svg',
      fileSize: '1.0 MB'
    };

    const updatedPatient = {
      ...editedPatient,
      medicalRecords: [...(editedPatient.medicalRecords || []), record]
    };

    setEditedPatient(updatedPatient);
    onUpdate(updatedPatient);
    
    setShowUploadDialog(false);
    setNewRecord({
      title: '',
      details: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Record Added",
      description: `New ${uploadType} record has been added to patient's history.`,
    });
  };

  const handleAddBiomarker = () => {
    if (!newBiomarker.name || newBiomarker.value === undefined) {
      toast({
        title: "Error",
        description: "Please enter a name and value for the biomarker.",
        variant: "destructive"
      });
      return;
    }

    const biomarker: Biomarker = {
      id: `bio-${Date.now()}`,
      name: newBiomarker.name || '',
      value: newBiomarker.value,
      unit: newBiomarker.unit || '',
      normalRange: newBiomarker.normalRange || '',
      status: newBiomarker.status as 'low' | 'normal' | 'elevated' | 'critical',
      timestamp: newBiomarker.timestamp || new Date().toISOString().split('T')[0]
    };

    const updatedPatient = {
      ...editedPatient,
      biomarkers: [...(editedPatient.biomarkers || []), biomarker]
    };

    setEditedPatient(updatedPatient);
    onUpdate(updatedPatient);
    
    setShowAddBiomarkerDialog(false);
    setNewBiomarker({
      name: '',
      value: 0,
      unit: '',
      normalRange: '',
      status: 'normal',
      timestamp: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Biomarker Added",
      description: `New biomarker has been added to patient's records.`,
    });
  };

  const handleDeleteRecord = () => {
    if (!recordToDelete) return;

    const updatedRecords = editedPatient.medicalRecords?.filter(record => record.id !== recordToDelete.id) || [];
    const updatedPatient = {
      ...editedPatient,
      medicalRecords: updatedRecords
    };

    setEditedPatient(updatedPatient);
    onUpdate(updatedPatient);
    setShowDeleteDialog(false);
    
    toast({
      title: "Record Deleted",
      description: "Medical record has been removed from patient's history.",
    });
  };

  const handleDeleteBiomarker = () => {
    if (!biomarkerToDelete) return;

    const updatedBiomarkers = editedPatient.biomarkers?.filter(bio => bio.id !== biomarkerToDelete.id) || [];
    const updatedPatient = {
      ...editedPatient,
      biomarkers: updatedBiomarkers
    };

    setEditedPatient(updatedPatient);
    onUpdate(updatedPatient);
    setShowDeleteDialog(false);
    
    toast({
      title: "Biomarker Deleted",
      description: "Biomarker has been removed from patient's records.",
    });
  };

  const filteredRecords = (type: string) => {
    return editedPatient.medicalRecords?.filter(record => record.type === type) || [];
  };

  const handleUploadClick = (type: 'xray' | 'bloodTest' | 'medication' | 'notes') => {
    setUploadType(type);
    setShowUploadDialog(true);
  };

  const confirmDelete = (record: MedicalRecord) => {
    setRecordToDelete(record);
    setBiomarkerToDelete(null);
    setShowDeleteDialog(true);
  };

  const confirmDeleteBiomarker = (biomarker: Biomarker) => {
    setBiomarkerToDelete(biomarker);
    setRecordToDelete(null);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Patient List
        </Button>
        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditMode(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Patient Profile</CardTitle>
          <CardDescription>
            {editMode ? "Edit patient details below" : "Detailed patient information and medical history"}
          </CardDescription>
        </CardHeader>
        <PatientProfileCard 
          patient={patient}
          editedPatient={editedPatient}
          editMode={editMode}
          handleInputChange={handleInputChange}
          setEditedPatient={setEditedPatient}
        />
      </Card>

      <Tabs defaultValue="xray" className="w-full">
        <TabsList className="mb-4 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="xray" className="rounded-md">X-Rays & Scans</TabsTrigger>
          <TabsTrigger value="bloodTest" className="rounded-md">Blood Tests</TabsTrigger>
          <TabsTrigger value="medication" className="rounded-md">Medications</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-md">Clinical Notes</TabsTrigger>
          <TabsTrigger value="biomarkers" className="rounded-md">Biomarkers</TabsTrigger>
        </TabsList>
        
        {['xray', 'bloodTest', 'medication', 'notes'].map((type) => (
          <TabsContent key={type} value={type}>
            <MedicalRecordsTab 
              type={type as 'xray' | 'bloodTest' | 'medication' | 'notes'} 
              records={filteredRecords(type)}
              handleUploadClick={handleUploadClick}
              confirmDelete={confirmDelete}
            />
          </TabsContent>
        ))}

        <TabsContent value="biomarkers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Biomarkers</CardTitle>
                <CardDescription>
                  Track inflammation markers and other important health indicators
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddBiomarkerDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Biomarker
              </Button>
            </CardHeader>
            <CardContent>
              <BiomarkerDisplay biomarkers={editedPatient.biomarkers || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RecordDialog 
        showDialog={showUploadDialog}
        setShowDialog={setShowUploadDialog}
        uploadType={uploadType}
        newRecord={newRecord as any}
        setNewRecord={setNewRecord as any}
        handleAddRecord={handleAddRecord}
      />

      <BiomarkerDialog 
        showDialog={showAddBiomarkerDialog}
        setShowDialog={setShowAddBiomarkerDialog}
        newBiomarker={newBiomarker as any}
        setNewBiomarker={setNewBiomarker as any}
        handleAddBiomarker={handleAddBiomarker}
      />

      <DeleteConfirmationDialog 
        showDialog={showDeleteDialog}
        setShowDialog={setShowDeleteDialog}
        recordToDelete={recordToDelete}
        biomarkerToDelete={biomarkerToDelete}
        handleDeleteRecord={handleDeleteRecord}
        handleDeleteBiomarker={handleDeleteBiomarker}
      />
    </div>
  );
};

export { PatientHistory };
export default PatientHistory;
