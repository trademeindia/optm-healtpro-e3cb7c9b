
import React from 'react';
import { FileText, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Document } from './types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface DocumentItemProps {
  document: Document;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 p-2 rounded">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium line-clamp-1">{document.name}</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(document.date, 'MMM d, yyyy')}
            </span>
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
              {document.type}
            </span>
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(document.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(document.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DocumentItem;
