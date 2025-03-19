
import React, { useEffect, useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getFromLocalStorage, getFileFromLocalStorage } from '@/services/storage/localStorageService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface MedicalDocumentsProps {
  className?: string;
}

interface Document {
  id: string;
  name: string;
  date: string;
  type: string;
  size: string;
  fileId?: string;
  url?: string;
  source?: string; // Add the source property to the Document interface
}

const MedicalDocuments: React.FC<MedicalDocumentsProps> = ({
  className
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    try {
      // Load from localStorage - first from patient_reports
      const patientReports = getFromLocalStorage('patient_reports');
      
      // Then from patient_records that have file attachments
      const patientRecords = getFromLocalStorage('patient_records')
        .filter((record: any) => record.fileId);
      
      // Map to consistent document format for display
      const reportDocs = patientReports.map((report: any) => ({
        id: report.id,
        name: report.title || 'Medical Report',
        date: report.date || new Date().toISOString().split('T')[0],
        type: report.fileType || 'PDF',
        size: report.fileSize || '1.0 MB',
        fileId: report.fileId,
        source: 'reports'
      }));
      
      const recordDocs = patientRecords.map((record: any) => ({
        id: record.id,
        name: record.name || 'Medical Record',
        date: record.date || new Date().toISOString().split('T')[0],
        type: record.recordType === 'xray' ? 'Image' : 'PDF',
        size: '1.0 MB', // We don't have this information in records
        fileId: record.fileId,
        source: 'records'
      }));
      
      // Combine and sort by date (newest first)
      const allDocuments = [...reportDocs, ...recordDocs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setDocuments(allDocuments);
      console.log(`Loaded ${allDocuments.length} documents`, allDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleViewDocument = async (doc: Document) => {
    try {
      if (doc.fileId) {
        // Get the file based on source
        const storageKey = doc.source === 'reports' ? 'patient_reports' : 'patient_records';
        const fileData = getFileFromLocalStorage(storageKey, doc.fileId);
        
        if (fileData && fileData.data) {
          setViewDocument({
            ...doc,
            url: fileData.data
          });
          setViewDialogOpen(true);
        } else {
          console.error('File data not found:', doc.fileId);
          alert('File data could not be loaded');
        }
      } else {
        setViewDocument(doc);
        setViewDialogOpen(true);
      }
    } catch (error) {
      console.error('Error viewing document:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Medical Documents
        </CardTitle>
        <CardDescription>
          View and download your medical documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => handleViewDocument(doc)}
              >
                <div className="flex items-center min-w-0 flex-1 mr-2">
                  <FileText className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{doc.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {formatDate(doc.date)} · {doc.type} · {doc.size}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="flex-shrink-0 flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-lg">No documents yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Medical documents will appear here once added by your healthcare provider
            </p>
          </div>
        )}
        
        {/* Document Viewer Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {viewDocument?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>{viewDocument?.date ? formatDate(viewDocument.date) : ''}</span>
                <span>•</span>
                <span>{viewDocument?.type}</span>
                <span>•</span>
                <span>{viewDocument?.size}</span>
              </div>
              
              {viewDocument?.type === 'PDF' ? (
                <div className="bg-muted p-4 rounded-md text-center">
                  <FileText className="h-10 w-10 mx-auto mb-2 text-primary" />
                  <p className="mb-3">PDF document preview</p>
                  {viewDocument.url ? (
                    <Button asChild size="sm">
                      <a 
                        href={viewDocument.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open PDF
                      </a>
                    </Button>
                  ) : (
                    <p className="text-muted-foreground">PDF preview not available</p>
                  )}
                </div>
              ) : (
                viewDocument?.url ? (
                  <div className="rounded-md overflow-hidden bg-muted">
                    <img 
                      src={viewDocument.url} 
                      alt={viewDocument.name} 
                      className="max-h-[60vh] mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-muted p-4 rounded-md text-center">
                    <p className="text-muted-foreground">Image preview not available</p>
                  </div>
                )
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              {viewDocument?.url && (
                <Button asChild>
                  <a href={viewDocument.url} download={viewDocument.name}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MedicalDocuments;
