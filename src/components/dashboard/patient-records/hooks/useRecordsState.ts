
import { useState, useEffect } from 'react';
import { getFromLocalStorage } from '@/services/storage/localStorageService';
import { MedicalRecord, MedicalReport } from '../types';

export const useRecordsState = (patientId?: string) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordType, setRecordType] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = () => {
    try {
      const storedRecords = getFromLocalStorage('patient_records')
        .filter((record: any) => !patientId || record.patientId === patientId)
        .map((record: any) => ({
          id: record.id,
          patientId: record.patientId,
          name: record.name,
          date: record.date,
          type: record.type || 'record',
          recordType: record.recordType,
          notes: record.notes,
          fileId: record.fileId,
          timestamp: record.timestamp || record.createdAt,
          description: record.description
        }));

      const storedReports = getFromLocalStorage('patient_reports')
        .filter((report: any) => !patientId || report.patientId === patientId)
        .map((report: any) => ({
          id: report.id,
          patientId: report.patientId,
          name: report.title || report.name, // Ensure name property is set
          date: report.date,
          type: report.type || 'Medical Report',
          fileType: report.fileType,
          fileSize: report.fileSize,
          fileId: report.fileId,
          title: report.title,
          description: report.description,
          isReport: true
        }));

      setRecords(storedRecords);
      setReports(storedReports);
    } catch (error) {
      console.error('Error loading medical data:', error);
    }
  };

  return {
    records,
    setRecords,
    reports,
    setReports,
    searchTerm,
    setSearchTerm,
    recordType,
    setRecordType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    activeTab,
    setActiveTab,
    loadData
  };
};
