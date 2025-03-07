
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Calendar, Activity, Plus, Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSymptomContext, SymptomEntry } from '@/contexts/SymptomContext';

interface SymptomTrackerProps {
  className?: string;
}

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ className }) => {
  const { symptoms, addSymptom } = useSymptomContext();
  
  const [newSymptom, setNewSymptom] = useState<Partial<SymptomEntry>>({
    date: new Date(),
    painLevel: 1
  });
  
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSymptom(prev => ({ ...prev, [name]: value }));
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
    
    const symptomEntry: SymptomEntry = {
      id: Date.now().toString(),
      date: newSymptom.date || new Date(),
      symptomName: newSymptom.symptomName || '',
      painLevel: newSymptom.painLevel || 1,
      location: newSymptom.location || '',
      notes: newSymptom.notes || ''
    };
    
    addSymptom(symptomEntry);
    setNewSymptom({
      date: new Date(),
      painLevel: 1
    });
    setOpen(false);
    
    toast({
      title: "Symptom Logged",
      description: "Your symptom has been recorded and added to the anatomical map",
    });
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'bg-medical-green text-white';
    if (level <= 6) return 'bg-medical-yellow text-white';
    return 'bg-medical-red text-white';
  };

  return (
    <motion.div
      className={cn("glass-morphism rounded-2xl p-4 md:p-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg font-semibold">Symptom & Pain Tracker</h3>
          <p className="text-sm text-muted-foreground">
            Track your symptoms and pain levels over time
          </p>
        </div>
        <Activity className="w-5 h-5 text-primary" />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 w-full">
            <Plus className="w-4 h-4 mr-2" />
            Log New Symptom
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log a New Symptom</DialogTitle>
            <DialogDescription>
              Add details about your symptom. It will appear on your anatomical map.
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
              <Input 
                id="location" 
                name="location" 
                value={newSymptom.location || ''} 
                onChange={handleInputChange} 
                placeholder="Where does it hurt? (e.g., Lower back, Left knee)"
              />
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
      
      <div className="space-y-3 mb-4 max-h-[350px] overflow-y-auto pr-2">
        {symptoms.length > 0 ? (
          symptoms.map(symptom => (
            <div 
              key={symptom.id} 
              className="p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{symptom.symptomName}</h4>
                  <p className="text-sm text-muted-foreground">{symptom.location}</p>
                </div>
                <div 
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    getPainLevelColor(symptom.painLevel)
                  )}
                >
                  Pain: {symptom.painLevel}/10
                </div>
              </div>
              {symptom.notes && (
                <p className="text-sm mt-2 text-muted-foreground">{symptom.notes}</p>
              )}
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {format(symptom.date, 'MMM d, yyyy')}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No symptoms recorded yet. Click "Log New Symptom" to add one.
          </div>
        )}
      </div>
      
      <div className="bg-secondary/50 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="w-4 h-4 text-medical-yellow" />
          <h4 className="font-medium">Pain Trend</h4>
        </div>
        <div className="h-16 flex items-end gap-1">
          {symptoms.slice().reverse().map((symptom, index) => (
            <div 
              key={symptom.id} 
              className="relative flex-1 flex flex-col items-center"
              title={`${symptom.symptomName}: ${symptom.painLevel}/10`}
            >
              <div 
                className={cn(
                  "w-full rounded-t",
                  getPainLevelColor(symptom.painLevel)
                )}
                style={{ height: `${symptom.painLevel * 10}%` }}
              ></div>
              <span className="text-xs mt-1 text-muted-foreground">
                {format(symptom.date, 'dd')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SymptomTracker;
