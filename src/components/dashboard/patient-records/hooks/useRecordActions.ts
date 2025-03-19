import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RecordItem } from '../types';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';
import { toast } from 'sonner';

export const useRecordActions = (patientId: string) => {
  const [sortField, setSortField] = useState<'date' | 'name'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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

  const handleSort = (field: 'date' | 'name') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortItems = (items: RecordItem[]) => {
    return [...items].sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
  };

  const handleAddRecord = (record: Omit<RecordItem, 'id'>) => {
    try {
      const newRecord = {
        ...record,
        id: uuidv4(),
        patientId
      };

      const storedRecords = getFromLocalStorage('patient_records') || [];
      storeInLocalStorage('patient_records', [...storedRecords, newRecord]);
      
      loadRecords();
      toast.success('Record added successfully');
      return true;
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Failed to add record');
      return false;
    }
  };

  const handleAddReport = (report: Omit<RecordItem, 'id'>) => {
    try {
      const newReport = {
        ...report,
        id: uuidv4(),
        patientId,
        isReport: true
      };

      const storedReports = getFromLocalStorage('patient_reports') || [];
      storeInLocalStorage('patient_reports', [...storedReports, newReport]);
      
      loadRecords();
      toast.success('Report added successfully');
      return true;
    } catch (error) {
      console.error('Error adding report:', error);
      toast.error('Failed to add report');
      return false;
    }
  };

  const handleDeleteRecord = (id: string, isReport = false) => {
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
      
      loadRecords();
      toast.success('Record deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
      return false;
    }
  };

  return {
    records,
    reports,
    sortedRecords: sortItems(records),
    sortedReports: sortItems(reports),
    sortField,
    sortDirection,
    loadRecords,
    handleSort,
    handleAddRecord,
    handleAddReport,
    handleDeleteRecord
  };
};
