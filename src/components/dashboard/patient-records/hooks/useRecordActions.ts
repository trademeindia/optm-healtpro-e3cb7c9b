
import { useState } from 'react';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';
import { RecordFormData } from '../../patient-history/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { MedicalRecord } from '../types';

export const useRecordActions = (
  patientId?: string,
  onRecordUpdated?: () => void,
  setRecords?: React.Dispatch<React.SetStateAction<MedicalRecord[]>>
) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentRecordType, setCurrentRecordType] = useState('');
  const [recordForm, setRecordForm] = useState<RecordFormData>({
    name: '',
    date: '',
    type: '',
    notes: '',
    file: null
  });

  const handleAddRecord = (type: string) => {
    setCurrentRecordType(type);
    setIsAddDialogOpen(true);
    
    setRecordForm({
      name: '',
      date: new Date().toISOString().split('T')[0],
      type: '',
      notes: '',
      file: null
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecordForm({
      ...recordForm,
      [e.target.name]: e.target.value
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

  const handleSelectChange = (value: string) => {
    setRecordForm({
      ...recordForm,
      type: value
    });
  };

  const handleRecordSubmit = async () => {
    try {
      const recordId = uuidv4();
      let fileId = null;
      
      if (recordForm.file) {
        fileId = uuidv4();
      }
      
      const newRecord: any = {
        id: recordId,
        patientId: patientId || 'default',
        name: recordForm.name,
        date: recordForm.date,
        type: currentRecordType,
        recordType: recordForm.type || currentRecordType,
        notes: recordForm.notes,
        fileId: fileId,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      const existingRecords = getFromLocalStorage('patient_records');
      storeInLocalStorage('patient_records', [...existingRecords, newRecord]);
      
      if (setRecords) {
        setRecords(prev => [...prev, newRecord]);
      }
      
      setIsAddDialogOpen(false);
      
      toast.success('Record added successfully');
      
      if (onRecordUpdated) {
        onRecordUpdated();
      }
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Failed to add record');
    }
  };

  const handleDeleteRecord = (id: string, isReport: boolean = false) => {
    try {
      if (isReport) {
        const storedReports = getFromLocalStorage('patient_reports')
          .filter((report: any) => report.id !== id);
        
        storeInLocalStorage('patient_reports', storedReports);
      } else {
        const storedRecords = getFromLocalStorage('patient_records')
          .filter((record: any) => record.id !== id);
        
        storeInLocalStorage('patient_records', storedRecords);
      }
      
      toast.success('Record deleted successfully');
      
      if (onRecordUpdated) {
        onRecordUpdated();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  return {
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
  };
};
