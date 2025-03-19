
import { useState, useEffect } from 'react';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';
import { Document } from './types';
import { toast } from 'sonner';

export const useDocumentsStorage = (patientId?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadDocumentsFromStorage();
  }, [patientId]);

  const loadDocumentsFromStorage = () => {
    try {
      const patientReports = getFromLocalStorage('patient_reports');
      const patientRecords = getFromLocalStorage('patient_records').filter((record: any) => 
        record.fileId && (!patientId || record.patientId === patientId)
      );

      const reportDocs = patientReports
        .filter((report: any) => !patientId || report.patientId === patientId)
        .map((report: any) => ({
          id: report.id,
          name: report.title || 'Medical Report',
          type: report.fileType || 'PDF',
          date: report.date || new Date().toISOString().split('T')[0],
          size: report.fileSize || '1.0 MB'
        }));
      
      const recordDocs = patientRecords.map((record: any) => ({
        id: record.id,
        name: record.name || 'Medical Record',
        type: record.recordType === 'xray' ? 'Image' : 'PDF',
        date: record.date || new Date().toISOString().split('T')[0],
        size: '1.0 MB'
      }));

      const allDocuments = [...reportDocs, ...recordDocs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setDocuments(allDocuments);
    } catch (error) {
      console.error('Error loading documents from storage:', error);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    try {
      const records = getFromLocalStorage('patient_records');
      const reports = getFromLocalStorage('patient_reports');
      
      const recordIndex = records.findIndex((record: any) => record.id === documentId);
      
      if (recordIndex !== -1) {
        records.splice(recordIndex, 1);
        storeInLocalStorage('patient_records', records, true);
        toast.success('Document deleted successfully');
      } else {
        const reportIndex = reports.findIndex((report: any) => report.id === documentId);
        
        if (reportIndex !== -1) {
          reports.splice(reportIndex, 1);
          storeInLocalStorage('patient_reports', reports, true);
          toast.success('Document deleted successfully');
        }
      }
      
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  return {
    documents,
    handleDeleteDocument,
    loadDocumentsFromStorage
  };
};
