
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Hotspot } from './types';

interface HotspotFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotspot: Partial<Hotspot>) => void;
  position: { x: number; y: number } | null;
}

const HotspotForm: React.FC<HotspotFormProps> = ({
  isOpen,
  onClose,
  onSave,
  position
}) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'normal' | 'warning' | 'critical'>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position) return;
    
    const hotspotData: Partial<Hotspot> = {
      x: position.x,
      y: position.y,
      z: 0,
      label,
      description,
      status,
      color: status === 'critical' ? '#FF4D4F' : 
             status === 'warning' ? '#FAAD14' : '#52C41A',
    };
    
    onSave(hotspotData);
    
    // Reset form
    setLabel('');
    setDescription('');
    setStatus('normal');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-gray-950 shadow-xl rounded-xl border border-gray-200 dark:border-gray-800">
        <DialogHeader className="px-6 pt-6 pb-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Add New Issue</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Area/Muscle Name
            </Label>
            <Input 
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Deltoid Muscle"
              className="w-full border-gray-300 dark:border-gray-600"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue or condition"
              className="w-full min-h-[100px] border-gray-300 dark:border-gray-600"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Severity
            </Label>
            <Select 
              value={status} 
              onValueChange={(value: 'normal' | 'warning' | 'critical') => setStatus(value)}
            >
              <SelectTrigger id="status" className="w-full border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HotspotForm;
