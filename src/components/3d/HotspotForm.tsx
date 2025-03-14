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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Issue</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Area/Muscle Name</Label>
            <Input 
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Deltoid Muscle"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue or condition"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Severity</Label>
            <Select 
              value={status} 
              onValueChange={(value: 'normal' | 'warning' | 'critical') => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HotspotForm;
