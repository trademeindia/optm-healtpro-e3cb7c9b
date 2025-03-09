import React, { useState } from 'react';
import { ArrowLeft, Upload, Trash2, Edit, X, Save, Plus, TestTube, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import BiomarkerDisplay from './BiomarkerDisplay';

interface MedicalRecord {
  id: string;
  type: 'xray' | 'bloodTest' | 'medication' | 'notes';
  title: string;
  date: string;
  details: string;
  fileUrl?: string;
  fileSize?: string;
}

interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'low' | 'normal' | 'elevated' | 'critical';
  timestamp: string;
}

interface PatientData {
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
  medicalRecords?: MedicalRecord[];
  biomarkers?: Biomarker[];
}

interface PatientHistoryProps {
  patient: PatientData;
  onClose: () => void;
  onUpdate: (updatedPatient: PatientData) => void;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ patient, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'xray' | 'bloodTest' | 'medication' | 'notes'>('xray');
  const [editedPatient, setEditedPatient] = useState<PatientData>({ ...patient });
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Patient Name</Label>
                {editMode ? (
                  <Input 
                    id="name"
                    name="name"
                    value={editedPatient.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-medium mt-1">{patient.name}</div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  {editMode ? (
                    <Input 
                      id="age"
                      name="age"
                      type="number"
                      value={editedPatient.age}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="mt-1">{patient.age} years</div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  {editMode ? (
                    <select 
                      id="gender"
                      name="gender"
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      value={editedPatient.gender}
                      onChange={(e) => setEditedPatient(prev => ({...prev, gender: e.target.value}))}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="mt-1">{patient.gender}</div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="condition">Medical Condition</Label>
                {editMode ? (
                  <Input 
                    id="condition"
                    name="condition"
                    value={editedPatient.condition}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="mt-1">{patient.condition}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="icdCode">ICD Code</Label>
                {editMode ? (
                  <Input 
                    id="icdCode"
                    name="icdCode"
                    value={editedPatient.icdCode}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="mt-1 font-mono">{patient.icdCode}</div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                {editMode ? (
                  <Textarea 
                    id="address"
                    name="address"
                    value={editedPatient.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="mt-1">{patient.address}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {editMode ? (
                  <Input 
                    id="phone"
                    name="phone"
                    value={editedPatient.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="mt-1">{patient.phone}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                {editMode ? (
                  <Input 
                    id="email"
                    name="email"
                    value={editedPatient.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="mt-1">{patient.email}</div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastVisit">Last Visit</Label>
                  {editMode ? (
                    <Input 
                      id="lastVisit"
                      name="lastVisit"
                      type="date"
                      value={editedPatient.lastVisit}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="mt-1">{patient.lastVisit}</div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="nextVisit">Next Appointment</Label>
                  {editMode ? (
                    <Input 
                      id="nextVisit"
                      name="nextVisit"
                      type="date"
                      value={editedPatient.nextVisit}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="mt-1">{patient.nextVisit}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {type === 'xray' && 'X-Rays & Scan Reports'}
                    {type === 'bloodTest' && 'Blood Test Results'}
                    {type === 'medication' && 'Prescribed Medications'}
                    {type === 'notes' && 'Clinical Notes'}
                  </CardTitle>
                  <CardDescription>
                    {type === 'xray' && 'All imaging studies for this patient'}
                    {type === 'bloodTest' && 'Laboratory test results'}
                    {type === 'medication' && 'Current and past medications'}
                    {type === 'notes' && 'Doctor notes and observations'}
                  </CardDescription>
                </div>
                <Button onClick={() => handleUploadClick(type as any)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {type === 'notes' ? 'Add Note' : 'Add Record'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords(type).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No {type === 'xray' ? 'X-Ray or scan' : type === 'bloodTest' ? 'blood test' : type === 'medication' ? 'medication' : 'clinical note'} records found
                    </div>
                  ) : (
                    filteredRecords(type).map((record) => (
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
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
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

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {uploadType === 'xray' && 'Add X-Ray or Scan Report'}
              {uploadType === 'bloodTest' && 'Add Blood Test Result'}
              {uploadType === 'medication' && 'Add Medication'}
              {uploadType === 'notes' && 'Add Clinical Note'}
            </DialogTitle>
            <DialogDescription>
              {uploadType === 'notes' 
                ? "Add clinical observations or treatment notes" 
                : "Upload medical documents or add details manually"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {uploadType !== 'notes' && (
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Drag files here or click to upload</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports PDF, JPEG, PNG files up to 10MB
                </p>
                <Button size="sm">Select Files</Button>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="text-sm font-medium">Record Details</div>
              
              <div className="space-y-2">
                <label className="text-sm">
                  {uploadType === 'xray' && 'Image/Scan Name'}
                  {uploadType === 'bloodTest' && 'Test Name'}
                  {uploadType === 'medication' && 'Medication Name'}
                  {uploadType === 'notes' && 'Note Title'}
                </label>
                <Input 
                  placeholder={
                    uploadType === 'xray' ? "e.g., Chest X-Ray" : 
                    uploadType === 'bloodTest' ? "e.g., Complete Blood Count" :
                    uploadType === 'medication' ? "e.g., Ibuprofen 400mg" :
                    "e.g., Initial Assessment"
                  }
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Date</label>
                <Input 
                  type="date" 
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">
                  {uploadType === 'xray' && 'Findings/Results'}
                  {uploadType === 'bloodTest' && 'Results/Values'}
                  {uploadType === 'medication' && 'Dosage & Instructions'}
                  {uploadType === 'notes' && 'Note Content'}
                </label>
                <Textarea 
                  placeholder={
                    uploadType === 'xray' ? "Describe findings or interpretation" : 
                    uploadType === 'bloodTest' ? "List test values and normal ranges" :
                    uploadType === 'medication' ? "Specify dosage, frequency and special instructions" :
                    "Enter detailed clinical notes"
                  }
                  rows={4}
                  value={newRecord.details}
                  onChange={(e) => setNewRecord({...newRecord, details: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRecord}>
              {uploadType === 'notes' ? 'Save Note' : 'Add Record'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddBiomarkerDialog} onOpenChange={setShowAddBiomarkerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Biomarker</DialogTitle>
            <DialogDescription>
              Record new biomarker test results for this patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm">Biomarker Name</label>
                <Input 
                  placeholder="e.g., C-Reactive Protein (CRP)"
                  value={newBiomarker.name}
                  onChange={(e) => setNewBiomarker({...newBiomarker, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Value</label>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="e.g., 5.5"
                    value={newBiomarker.value}
                    onChange={(e) => setNewBiomarker({...newBiomarker, value: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm">Unit</label>
                  <Input 
                    placeholder="e.g., mg/L"
                    value={newBiomarker.unit}
                    onChange={(e) => setNewBiomarker({...newBiomarker, unit: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Normal Range</label>
                <Input 
                  placeholder="e.g., 0.0 - 8.0"
                  value={newBiomarker.normalRange}
                  onChange={(e) => setNewBiomarker({...newBiomarker, normalRange: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Status</label>
                <select 
                  className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  value={newBiomarker.status}
                  onChange={(e) => setNewBiomarker({...newBiomarker, status: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="elevated">Elevated</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Date</label>
                <Input 
                  type="date" 
                  value={newBiomarker.timestamp}
                  onChange={(e) => setNewBiomarker({...newBiomarker, timestamp: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowAddBiomarkerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBiomarker}>
              Add Biomarker
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {recordToDelete ? 'record' : 'biomarker'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {recordToDelete && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="font-medium">{recordToDelete.title}</p>
                <p className="text-sm text-muted-foreground">Date: {recordToDelete.date}</p>
              </div>
            )}
            {biomarkerToDelete && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="font-medium">{biomarkerToDelete.name}</p>
                <p className="text-sm text-muted-foreground">
                  Value: {biomarkerToDelete.value} {biomarkerToDelete.unit}
                </p>
                <p className="text-sm text-muted-foreground">Date: {biomarkerToDelete.timestamp}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={recordToDelete ? handleDeleteRecord : handleDeleteBiomarker}
            >
              Delete {recordToDelete ? 'Record' : 'Biomarker'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { PatientHistory };
export default PatientHistory;

