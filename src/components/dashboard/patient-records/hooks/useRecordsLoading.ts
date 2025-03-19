
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { RecordItem } from '../types';
import { getFromLocalStorage } from '@/services/storage/localStorageService';

export const useRecordsLoading = (patientId: string) => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [reports, setReports] = useState<RecordItem[]>([]);

  const loadRecords = useCallback(() => {
    try {
      const storedRecords = getFromLocalStorage('patient_records') || [];
      const patientRecords = storedRecords.filter((record: RecordItem) => record.patientId === patientId);
      setRecords(patientRecords);

      const storedReports = getFromLocalStorage('patient_reports') || [];
      const patientReports = storedReports.filter((report: RecordItem) => report.patientId === patientId);
      setReports(patientReports);
    } catch (error) {
      console.error('Error loading records:', error);
      toast.error('Failed to load patient records');
    }
  }, [patientId]);

  return {
    records,
    reports,
    loadRecords
  };
};
