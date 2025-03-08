
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { useSymptoms } from '@/contexts/SymptomContext';
import { SymptomTrackerProps, bodyRegions } from './types';
import { getPainLevelColor, getLocationLabel } from './utils';
import NewSymptomForm from './NewSymptomForm';
import SymptomList from './SymptomList';
import PainTrendChart from './PainTrendChart';

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ className }) => {
  const { symptoms, addSymptom } = useSymptoms();
  const [open, setOpen] = useState(false);

  // Get the location label helper function
  const getLocationLabelHelper = (locationValue: string) => {
    return getLocationLabel(locationValue, bodyRegions);
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

      <DialogTrigger asChild>
        <Button className="mb-4 w-full" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Log New Symptom
        </Button>
      </DialogTrigger>
      
      <NewSymptomForm 
        open={open} 
        setOpen={setOpen} 
        onSubmit={addSymptom} 
      />
      
      <SymptomList 
        symptoms={symptoms} 
        getLocationLabel={getLocationLabelHelper} 
        getPainLevelColor={getPainLevelColor} 
      />
      
      <PainTrendChart 
        symptoms={symptoms} 
        getPainLevelColor={getPainLevelColor} 
      />
    </motion.div>
  );
};

export default SymptomTracker;
