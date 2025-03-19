
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecordFormData } from '../hooks/useRecordsForm';

interface AddRecordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recordType: 'record' | 'report';
  recordForm: RecordFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  recordTypesOptions: string[];
}

const AddRecordDialog: React.FC<AddRecordDialogProps> = ({
  isOpen,
  onOpenChange,
  recordType,
  recordForm,
  onInputChange,
  onFileChange,
  onSelectChange,
  onSubmit,
  recordTypesOptions
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            Add New {recordType === 'record' ? 'Medical Record' : 'Report'}
          </DialogTitle>
          <DialogDescription>
            Enter the details below to add a new {recordType === 'record' ? 'medical record' : 'report'} for this patient.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={recordForm.name} onChange={onInputChange} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" value={recordForm.date} onChange={onInputChange} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" value={recordForm.type} onValueChange={(value) => onSelectChange({ target: { name: 'type', value } } as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {recordTypesOptions.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={recordForm.description} onChange={onInputChange} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Upload File (optional)</Label>
            <Input id="file" name="file" type="file" onChange={onFileChange} />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordDialog;
