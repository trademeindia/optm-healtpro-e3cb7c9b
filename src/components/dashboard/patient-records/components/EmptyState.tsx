
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  searchTerm: string;
  type: 'record' | 'report' | 'all';
  onAddClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, type, onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
      {searchTerm ? (
        <p className="text-muted-foreground">No records matching your search</p>
      ) : (
        <>
          <p className="font-medium">
            {type === 'record' && 'No medical records found'}
            {type === 'report' && 'No lab reports found'}
            {type === 'all' && 'No records found'}
          </p>
          <p className="text-muted-foreground mb-4">
            {type === 'record' && 'Add your first medical record'}
            {type === 'report' && 'Upload your first lab report'}
            {type === 'all' && 'Add your first medical record'}
          </p>
          <Button size="sm" onClick={onAddClick}>
            {type === 'record' && 'Add Medical Record'}
            {type === 'report' && 'Add Lab Report'}
            {type === 'all' && 'Add Record'}
          </Button>
        </>
      )}
    </div>
  );
};

export default EmptyState;
