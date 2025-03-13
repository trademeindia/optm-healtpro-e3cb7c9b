
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
  onViewAll,
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
      const patientRecords = getFromLocalStorage('patient_records')
        .filter((record: any) => record.fileId);
      
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
      const allDocuments = [...reportDocs, ...recordDocs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setDocuments(allDocuments);
    } catch (error) {
      console.error('Error loading documents from storage:', error);
    }
  };

  // Filter documents based on search
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Clinic Documents</CardTitle>
            <CardDescription>
              Recent files and medical records
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onUpload}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9 bg-white dark:bg-gray-800/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          {filteredDocuments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              {searchQuery ? 'No documents found matching your search' : 'No documents found'}
            </p>
          ) : (
            filteredDocuments.slice(0, 5).map((document) => (
              <div 
                key={document.id} 
                className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{document.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{document.type}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{document.date}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{document.size}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        {filteredDocuments.length > 5 && (
          <Button variant="ghost" className="w-full mt-4" onClick={onViewAll}>
            View All Documents ({filteredDocuments.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ClinicDocuments;
