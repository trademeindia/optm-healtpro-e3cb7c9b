
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CalendarIcon, FileIcon, Trash2 } from 'lucide-react';
import { RecordItem } from '../types';

interface RecordsTableProps {
  data: RecordItem[];
  handleSort: (field: 'date' | 'name') => void;
  handleDeleteRecord: (id: string, isReport?: boolean) => void;
  emptyMessage: React.ReactNode;
}

const RecordsTable: React.FC<RecordsTableProps> = ({
  data,
  handleSort,
  handleDeleteRecord,
  emptyMessage
}) => {
  if (data.length === 0) {
    return <>{emptyMessage}</>;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%] cursor-pointer hover:bg-accent/50" onClick={() => handleSort('name')}>
              Name
            </TableHead>
            <TableHead className="w-[25%] cursor-pointer hover:bg-accent/50" onClick={() => handleSort('date')}>
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Date
              </div>
            </TableHead>
            <TableHead className="w-[20%]">Type</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {item.name}
                </div>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.type}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRecord(item.id, item.isReport)}
                  aria-label="Delete record"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecordsTable;
