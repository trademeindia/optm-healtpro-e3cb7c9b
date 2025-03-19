
import React from 'react';
import { Button } from '@/components/ui/button';
import DocumentItem from './DocumentItem';
import { Document } from './types';

interface DocumentsListProps {
  documents: Document[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewAll?: () => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ 
  documents, 
  onEdit, 
  onDelete, 
  onViewAll 
}) => {
  const displayDocuments = documents.slice(0, 5);
  const hasMoreDocuments = documents.length > 5;

  return (
    <div className="space-y-2">
      {displayDocuments.map((doc) => (
        <DocumentItem 
          key={doc.id} 
          document={doc} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
      
      {hasMoreDocuments && onViewAll && (
        <div className="text-center pt-2">
          <Button 
            variant="link" 
            className="text-xs" 
            onClick={onViewAll}
          >
            View all {documents.length} documents
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
