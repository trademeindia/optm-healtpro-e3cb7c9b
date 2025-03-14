import React, { useEffect, useState } from 'react';
import { FileText, Upload, Search, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getFromLocalStorage } from '@/services/storage/localStorageService';
interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}
interface ClinicDocumentsProps {
  documents?: Document[];
  className?: string;
  onUpload?: () => void;
  onViewAll?: () => void;
}
const ClinicDocuments: React.FC<ClinicDocumentsProps> = ({
  documents: propDocuments,
  className,
  onUpload,
  onViewAll
}) => {
  const [documents, setDocuments] = useState<Document[]>(propDocuments || []);
  const [searchQuery, setSearchQuery] = useState('');

  // Load documents from localStorage if not provided through props
  useEffect(() => {
    if (propDocuments && propDocuments.length > 0) {
      setDocuments(propDocuments);
    } else {
      loadDocumentsFromStorage();
    }
  }, [propDocuments]);

  // Load documents from local storage
  const loadDocumentsFromStorage = () => {
    try {
      // Check for documents in both patient_reports and patient_records
      const patientReports = getFromLocalStorage('patient_reports');
      const patientRecords = getFromLocalStorage('patient_records').filter((record: any) => record.fileId);

      // Convert to Document format
      const reportDocs = patientReports.map((report: any) => ({
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
        size: '1.0 MB' // We don't store this for records
      }));

      // Combine and sort by date (newest first)
      const allDocuments = [...reportDocs, ...recordDocs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDocuments(allDocuments);
    } catch (error) {
      console.error('Error loading documents from storage:', error);
    }
  };

  // Filter documents based on search
  const filteredDocuments = documents.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.type.toLowerCase().includes(searchQuery.toLowerCase()));
  return <Card className={cn("h-full", className)}>
      
      
    </Card>;
};
export default ClinicDocuments;