
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { NewSymptomFormProps } from './types';
import { bodyRegions } from './types';
import { getPainLevelColor } from './utils';

const NewSymptomForm: React.FC<NewSymptomFormProps> = ({ open, setOpen, onSubmit }) => {
  const [newSymptom, setNewSymptom] = React.useState<any>({
    date: new Date(),
    painLevel: 1
  });
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSymptom(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewSymptom(prev => ({ ...prev, location: value }));
  };

  const handlePainLevelChange = (level: number) => {
    setNewSymptom(prev => ({ ...prev, painLevel: level }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSymptom.symptomName || !newSymptom.location) {
      toast({
        title: "Missing Information",
        description: "Please provide symptom name and location",
        variant: "destructive",
      });
      return;
    }
    
    const symptomEntry = {
      id: Date.now().toString(),
      date: newSymptom.date || new Date(),
      symptomName: newSymptom.symptomName || '',
      painLevel: newSymptom.painLevel || 1,
      location: newSymptom.location || '',
      notes: newSymptom.notes || ''
    };
    
    onSubmit(symptomEntry);
    setNewSymptom({
      date: new Date(),
      painLevel: 1
    });
    setOpen(false);
    
    toast({
      title: "Symptom Logged",
      description: "Your symptom has been recorded successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a New Symptom</DialogTitle>
          <DialogDescription>
            Record your symptoms to track your health over time
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="symptomName">Symptom Name</Label>
            <Input 
              id="symptomName" 
              name="symptomName" 
              value={newSymptom.symptomName || ''} 
              onChange={handleInputChange} 
              placeholder="E.g., Headache, Back Pain, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Pain Level (1-10)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <button
                  key={level}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full text-sm font-medium transition-colors",
                    newSymptom.painLevel === level
                      ? getPainLevelColor(level)
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                  onClick={() => handlePainLevelChange(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={newSymptom.location}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Select body part" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Body Parts</SelectLabel>
                  {bodyRegions.map(region => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={newSymptom.notes || ''} 
              onChange={handleInputChange} 
              placeholder="Additional details about your symptoms..."
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Symptom
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSymptomForm;
