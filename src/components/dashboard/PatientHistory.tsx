import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PatientProfile from '@/components/patient/PatientProfile';
import AnatomicalView from '@/components/patient/AnatomicalView';
import MedicalRecordsTabs from '@/components/patient/MedicalRecordsTabs';
import AnatomicalMap from '@/components/patient/AnatomicalMap';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PatientHistoryProps {
  patient: any;
  onClose: () => void;
  onUpdate: (patient: any) => void;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ patient, onClose, onUpdate }) => {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddRecordDialog, setShowAddRecordDialog] = useState(false);
  const [recordType, setRecordType] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [recordForm, setRecordForm] = useState({
    name: '',
    date: '',
    type: '',
    notes: '',
    file: null as File | null
  });

  const handleAddRecord = (type: string) => {
    setRecordType(type);
    setShowAddRecordDialog(true);
  };

  const handleRecordSubmit = () => {
    toast({
      title: "Record Added",
      description: `${recordForm.name} has been added to the patient's records.`,
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
    toast({
      title: "Region Selected",
      description: `You selected the ${region} region.`,
    });
  };

  const handleAssignTests = () => {
    toast({
      title: "Tests Assigned",
      description: "Lab tests have been assigned to this patient.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onClose} className="flex items-center p-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Record
        </Button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left panel - Anatomical view */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="h-[600px]">
            <AnatomicalView 
              selectedRegion={selectedRegion}
              onSelectRegion={handleRegionSelect}
              patientId={patient.id}
            />
          </div>
        </div>

        {/* Right panel - Patient profile */}
        <div className="lg:col-span-5 xl:col-span-4">
          <PatientProfile 
            patient={patient}
            onAssignTests={handleAssignTests}
          />
        </div>
      </div>

      {/* Medical Records Tabs Section */}
      <div className="mt-6">
        <MedicalRecordsTabs 
          patientId={patient.id}
          onAddRecord={handleAddRecord}
        />
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Patient Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this patient record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              setShowDeleteConfirm(false);
              toast({
                title: "Record Deleted",
                description: "The patient record has been permanently deleted.",
              });
              onClose();
            }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={showAddRecordDialog} onOpenChange={setShowAddRecordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Add {recordType === 'xray' ? 'X-Ray or Scan' :
                    recordType === 'bloodTest' ? 'Blood Test' :
                    recordType === 'medication' ? 'Medication' :
                    recordType === 'clinicalNote' ? 'Clinical Note' : 'Biomarker'}
            </DialogTitle>
            <DialogDescription>
              Enter details for the new medical record.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Record Name
              </label>
              <Input
                id="name"
                name="name"
                value={recordForm.name}
                onChange={handleInputChange}
                placeholder={recordType === 'xray' ? 'e.g., Left Shoulder X-Ray' :
                            recordType === 'bloodTest' ? 'e.g., Complete Blood Count' :
                            recordType === 'medication' ? 'e.g., Ibuprofen' :
                            recordType === 'clinicalNote' ? 'e.g., Initial Assessment' : 'e.g., Cholesterol'}
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={recordForm.date}
                onChange={handleInputChange}
              />
            </div>

            {(recordType === 'xray' || recordType === 'bloodTest') && (
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Record Type
                </label>
                <Select value={recordForm.type} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordType === 'xray' ? (
                      <>
                        <SelectItem value="xray">X-Ray</SelectItem>
                        <SelectItem value="mri">MRI</SelectItem>
                        <SelectItem value="ct">CT Scan</SelectItem>
                        <SelectItem value="ultrasound">Ultrasound</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="cbc">Complete Blood Count</SelectItem>
                        <SelectItem value="lipid">Lipid Panel</SelectItem>
                        <SelectItem value="metabolic">Metabolic Panel</SelectItem>
                        <SelectItem value="thyroid">Thyroid Function</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={recordForm.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add any relevant notes here..."
              />
            </div>

            {(recordType === 'xray' || recordType === 'bloodTest') && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload File
                </label>
                <div className="border-2 border-dashed rounded-md p-4">
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to browse or drag and drop
                    </p>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Select File
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRecordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordSubmit}>
              Add Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientHistory;
