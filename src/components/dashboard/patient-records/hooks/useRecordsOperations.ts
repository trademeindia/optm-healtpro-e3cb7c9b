
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { RecordItem } from '../types';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';

export const useRecordsOperations = (patientId: string, onRecordsChanged: () => void) => {
  const handleAddRecord = useCallback((record: Omit<RecordItem, 'id'>) => {
    try {
      const newRecord = {
        ...record,
        id: uuidv4(),
        patientId
      };

      const storedRecords = getFromLocalStorage('patient_records') || [];
      storeInLocalStorage('patient_records', [...storedRecords, newRecord]);
      
      onRecordsChanged();
      toast.success('Record added successfully');
      return true;
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Failed to add record');
      return false;
    }
  }, [patientId, onRecordsChanged]);

  const handleAddReport = useCallback((report: Omit<RecordItem, 'id'>) => {
    try {
      const newReport = {
        ...report,
        id: uuidv4(),
        patientId,
        isReport: true
      };

      const storedReports = getFromLocalStorage('patient_reports') || [];
      storeInLocalStorage('patient_reports', [...storedReports, newReport]);
      
      onRecordsChanged();
      toast.success('Report added successfully');
      return true;
    } catch (error) {
      console.error('Error adding report:', error);
      toast.error('Failed to add report');
      return false;
    }
  }, [patientId, onRecordsChanged]);

  const handleDeleteRecord = useCallback((id: string, isReport = false) => {
    try {
      if (isReport) {
        const storedReports = getFromLocalStorage('patient_reports') || [];
        const updatedReports = storedReports.filter((report: RecordItem) => report.id !== id);
        storeInLocalStorage('patient_reports', updatedReports);
      } else {
        const storedRecords = getFromLocalStorage('patient_records') || [];
        const updatedRecords = storedRecords.filter((record: RecordItem) => record.id !== id);
        storeInLocalStorage('patient_records', updatedRecords);
      }
      
      onRecordsChanged();
      toast.success('Record deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
      return false;
    }
  }, [onRecordsChanged]);

  return {
    handleAddRecord,
    handleAddReport,
    handleDeleteRecord
  };
};
