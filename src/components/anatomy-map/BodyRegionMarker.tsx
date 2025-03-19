
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BodyRegion, PainSymptom } from './types';

interface BodyRegionMarkerProps {
  region: BodyRegion;
  active: boolean;
  symptoms: PainSymptom[];
  onClick: () => void;
}

const BodyRegionMarker: React.FC<BodyRegionMarkerProps> = ({ 
  region, 
  active, 
  symptoms,
  onClick 
}) => {
  // Check if there are symptoms for this region
  const regionSymptoms = symptoms.filter(s => s.bodyRegionId === region.id);
  const hasSymptoms = regionSymptoms.length > 0;
  
  // Determine color based on symptoms
  const getMarkerColor = () => {
    if (!hasSymptoms) return 'bg-blue-400 dark:bg-blue-600';
    
    // Find max pain level for this region
    const maxPain = Math.max(...regionSymptoms.map(s => s.painLevel || 0));
    
    if (maxPain >= 7) return 'bg-red-500 dark:bg-red-600';
    if (maxPain >= 4) return 'bg-amber-500 dark:bg-amber-600';
    return 'bg-green-500 dark:bg-green-600';
  };
  
  // Determine size based on symptoms or active state
  const getMarkerSize = () => {
    if (active) return 'hotspot-size-lg';
    if (hasSymptoms) return 'hotspot-size-md';
    return 'hotspot-size-sm';
  };
  
  // Get proper z-index to ensure visibility
  const getZIndex = () => {
    if (active) return 'z-30';
    if (hasSymptoms) return 'z-20';
    return 'z-10';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`hotspot-marker ${getMarkerSize()} ${getMarkerColor()} ${getZIndex()}`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: active ? [1, 1.2, 1] : 1,
              transition: {
                scale: active ? {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1
                } : {}
              }
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
          >
            {hasSymptoms && (
              <span className="absolute -top-2 -right-2 bg-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-800">
                {regionSymptoms.length}
              </span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="right"
          align="start"
          className="hotspot-tooltip max-w-[200px]"
        >
          <p className="font-medium">{region.name}</p>
          <p className="text-xs text-muted-foreground">{region.description}</p>
          {hasSymptoms && (
            <div className="mt-1 pt-1 border-t border-border/50">
              <p className="text-xs font-medium">Symptoms: {regionSymptoms.length}</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BodyRegionMarker;
