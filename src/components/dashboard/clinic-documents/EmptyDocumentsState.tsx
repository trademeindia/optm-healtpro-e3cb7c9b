
import React from 'react';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDocumentsStateProps {
  searchQuery?: string;
  onUpload: () => void;
}

const EmptyDocumentsState: React.FC<EmptyDocumentsStateProps> = ({ searchQuery, onUpload }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <FileText className="h-10 w-10 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium">No documents found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {searchQuery 
          ? `No results matching "${searchQuery}"`
          : "Upload a document or add a new record"
        }
      </p>
      {!searchQuery && (
        <Button size="sm" onClick={onUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      )}
    </div>
  );
};

export default EmptyDocumentsState;
