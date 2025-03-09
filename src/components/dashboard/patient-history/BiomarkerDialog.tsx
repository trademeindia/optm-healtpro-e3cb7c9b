
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BiomarkerDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  newBiomarker: {
    name: string;
    value: number;
    unit: string;
    normalRange: string;
    status: string;
    timestamp: string;
  };
  setNewBiomarker: React.Dispatch<React.SetStateAction<{
    name: string;
    value: number;
    unit: string;
    normalRange: string;
    status: string;
    timestamp: string;
  }>>;
  handleAddBiomarker: () => void;
}

const BiomarkerDialog: React.FC<BiomarkerDialogProps> = ({
  showDialog,
  setShowDialog,
  newBiomarker,
  setNewBiomarker,
  handleAddBiomarker
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Biomarker</DialogTitle>
          <DialogDescription>
            Record new biomarker test results for this patient
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm">Biomarker Name</label>
              <Input 
                placeholder="e.g., C-Reactive Protein (CRP)"
                value={newBiomarker.name}
                onChange={(e) => setNewBiomarker({...newBiomarker, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Value</label>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="e.g., 5.5"
                  value={newBiomarker.value}
                  onChange={(e) => setNewBiomarker({...newBiomarker, value: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Unit</label>
                <Input 
                  placeholder="e.g., mg/L"
                  value={newBiomarker.unit}
                  onChange={(e) => setNewBiomarker({...newBiomarker, unit: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Normal Range</label>
              <Input 
                placeholder="e.g., 0.0 - 8.0"
                value={newBiomarker.normalRange}
                onChange={(e) => setNewBiomarker({...newBiomarker, normalRange: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Status</label>
              <select 
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={newBiomarker.status}
                onChange={(e) => setNewBiomarker({...newBiomarker, status: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="elevated">Elevated</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Date</label>
              <Input 
                type="date" 
                value={newBiomarker.timestamp}
                onChange={(e) => setNewBiomarker({...newBiomarker, timestamp: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddBiomarker}>
            Add Biomarker
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerDialog;
