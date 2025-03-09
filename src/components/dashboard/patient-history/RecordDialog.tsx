
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

interface RecordDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  uploadType: 'xray' | 'bloodTest' | 'medication' | 'notes';
  newRecord: {
    title: string;
    details: string;
    date: string;
  };
  setNewRecord: React.Dispatch<React.SetStateAction<{
    title: string;
    details: string;
    date: string;
  }>>;
  handleAddRecord: () => void;
}

const RecordDialog: React.FC<RecordDialogProps> = ({
  showDialog,
  setShowDialog,
  uploadType,
  newRecord,
  setNewRecord,
  handleAddRecord
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {uploadType === 'xray' && 'Add X-Ray or Scan Report'}
            {uploadType === 'bloodTest' && 'Add Blood Test Result'}
            {uploadType === 'medication' && 'Add Medication'}
            {uploadType === 'notes' && 'Add Clinical Note'}
          </DialogTitle>
          <DialogDescription>
            {uploadType === 'notes' 
              ? "Add clinical observations or treatment notes" 
              : "Upload medical documents or add details manually"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {uploadType !== 'notes' && (
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag files here or click to upload</p>
              <p className="text-xs text-muted-foreground mb-4">
                Supports PDF, JPEG, PNG files up to 10MB
              </p>
              <Button size="sm">Select Files</Button>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="text-sm font-medium">Record Details</div>
            
            <div className="space-y-2">
              <label className="text-sm">
                {uploadType === 'xray' && 'Image/Scan Name'}
                {uploadType === 'bloodTest' && 'Test Name'}
                {uploadType === 'medication' && 'Medication Name'}
                {uploadType === 'notes' && 'Note Title'}
              </label>
              <Input 
                placeholder={
                  uploadType === 'xray' ? "e.g., Chest X-Ray" : 
                  uploadType === 'bloodTest' ? "e.g., Complete Blood Count" :
                  uploadType === 'medication' ? "e.g., Ibuprofen 400mg" :
                  "e.g., Initial Assessment"
                }
                value={newRecord.title}
                onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Date</label>
              <Input 
                type="date" 
                value={newRecord.date}
                onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">
                {uploadType === 'xray' && 'Findings/Results'}
                {uploadType === 'bloodTest' && 'Results/Values'}
                {uploadType === 'medication' && 'Dosage & Instructions'}
                {uploadType === 'notes' && 'Note Content'}
              </label>
              <Textarea 
                placeholder={
                  uploadType === 'xray' ? "Describe findings or interpretation" : 
                  uploadType === 'bloodTest' ? "List test values and normal ranges" :
                  uploadType === 'medication' ? "Specify dosage, frequency and special instructions" :
                  "Enter detailed clinical notes"
                }
                rows={4}
                value={newRecord.details}
                onChange={(e) => setNewRecord({...newRecord, details: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddRecord}>
            {uploadType === 'notes' ? 'Save Note' : 'Add Record'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordDialog;
