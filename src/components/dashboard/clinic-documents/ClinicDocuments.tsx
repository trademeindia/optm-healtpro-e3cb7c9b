
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useDocumentsStorage } from './useDocumentsStorage';
import DocumentSearch from './DocumentSearch';
import DocumentsList from './DocumentsList';
import EmptyDocumentsState from './EmptyDocumentsState';
import { ClinicDocumentsProps } from './types';

const ClinicDocuments: React.FC<ClinicDocumentsProps> = ({
  documents: propDocuments,
  className,
  onUpload,
  onViewAll,
  patientId
}) => {
  const { 
    documents, 
    searchTerm, 
    setSearchTerm,
    deleteDocument
  } = useDocumentsStorage(patientId);
  
  const [displayDocuments, setDisplayDocuments] = useState(propDocuments || documents);

  useEffect(() => {
    if (propDocuments && propDocuments.length > 0) {
      setDisplayDocuments(propDocuments);
    } else {
      setDisplayDocuments(documents);
    }
  }, [propDocuments, documents]);

  const handleEditDocument = (documentId: string) => {
    toast.info('Edit functionality will be implemented soon');
  };

  const handleAddDocument = () => {
    if (onUpload) {
      onUpload();
    } else {
      toast.info('Upload functionality will be implemented soon');
    }
  };

  const filteredDocuments = displayDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Medical Documents</CardTitle>
          <CardDescription>Manage patient records and reports</CardDescription>
        </div>
        <Button onClick={handleAddDocument} size="sm" className="text-xs">
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DocumentSearch 
            searchQuery={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          {filteredDocuments.length > 0 ? (
            <DocumentsList 
              documents={filteredDocuments}
              onEdit={handleEditDocument}
              onDelete={deleteDocument}
              onViewAll={onViewAll}
            />
          ) : (
            <EmptyDocumentsState 
              searchQuery={searchTerm}
              onUpload={handleAddDocument}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicDocuments;
