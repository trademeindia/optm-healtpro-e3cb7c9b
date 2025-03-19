
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { RecordItem } from '../types';
import { useAuth } from '@/contexts/auth';

interface RecordsTableProps {
  data: RecordItem[];
  handleSort: (field: 'date' | 'name') => void;
  handleDeleteRecord: (id: string, isReport?: boolean) => boolean;
  sortField?: 'date' | 'name';
  sortDirection?: 'asc' | 'desc';
}

const RecordsTable: React.FC<RecordsTableProps> = ({
  data,
  handleSort,
  handleDeleteRecord,
  sortField = 'date',
  sortDirection = 'desc'
}) => {
  const { user } = useAuth();
  const canEdit = user?.role === 'doctor' || user?.role === 'admin';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getSortIcon = (field: 'date' | 'name') => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Name {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center">
                Date {getSortIcon('date')}
              </div>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            {canEdit && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.name}</TableCell>
              <TableCell>{formatDate(record.date)}</TableCell>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.description || 'No description'}</TableCell>
              {canEdit && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRecord(record.id, record.isReport)}
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecordsTable;
