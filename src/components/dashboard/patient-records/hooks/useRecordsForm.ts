
import { useState } from 'react';
import { RecordItem } from '../types';

export interface RecordFormData {
  name: string;
  date: string;
  type: string;
  description: string;
  file?: File | null;
}

export const useRecordsForm = (
  patientId: string,
  handleAddRecord: (record: Omit<RecordItem, 'id'>) => boolean,
  handleAddReport: (report: Omit<RecordItem, 'id'>) => boolean
) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentRecordType, setCurrentRecordType] = useState<'record' | 'report'>('record');
  const [recordForm, setRecordForm] = useState<RecordFormData>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Medical Report',
    description: '',
    file: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setRecordForm(prev => ({ ...prev, file }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const record: Omit<RecordItem, 'id'> = {
      name: recordForm.name,
      date: recordForm.date,
      type: recordForm.type,
      description: recordForm.description || 'No description provided',
      patientId: patientId
    };
    
    let success = false;
    
    if (currentRecordType === 'record') {
      success = handleAddRecord(record);
    } else {
      success = handleAddReport(record);
    }
    
    if (success) {
      // Reset form and close dialog
      setRecordForm({
        name: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Medical Report',
        description: '',
        file: null
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleAddButtonClick = (type: 'record' | 'report') => {
    setCurrentRecordType(type);
    setIsAddDialogOpen(true);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    currentRecordType,
    recordForm,
    handleInputChange,
    handleFileChange,
    handleSelectChange,
    handleRecordSubmit,
    handleAddButtonClick
  };
};
