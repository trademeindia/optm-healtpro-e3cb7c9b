
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
    if (!hasSymptoms) return 'bg-blue-400 dark:bg-blue-600 border-blue-300 dark:border-blue-500';
    
    // Find max severity for this region
    const maxSeverity = Math.max(...regionSymptoms.map(s => {
      switch (s.severity) {
        case 'severe': return 8;
        case 'moderate': return 5;
        case 'mild': return 3;
        default: return 1;
      }
    }));
    
    if (maxSeverity >= 7) return 'bg-red-500 dark:bg-red-600 border-red-400 dark:border-red-500';
    if (maxSeverity >= 4) return 'bg-amber-500 dark:bg-amber-600 border-amber-400 dark:border-amber-500';
    return 'bg-green-500 dark:bg-green-600 border-green-400 dark:border-green-500';
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

  // Determine tooltip positioning based on region coordinates
  const getTooltipSide = (): "top" | "right" | "bottom" | "left" => {
    if (region.x < 25) return "right";
    if (region.x > 75) return "left";
    if (region.y < 30) return "bottom";
    return "top";
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`hotspot-marker ${getMarkerSize()} ${getMarkerColor()} ${getZIndex()} ${active ? 'hotspot-active hotspot-pulse' : ''} border-2`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: active ? [1, 1.1, 1] : 1,
              transition: {
                scale: active ? {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5
                } : {}
              }
            }}
            whileHover={{ scale: 1.2, boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
          >
            {hasSymptoms && (
              <span className="absolute -top-2 -right-2 bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold border border-gray-200 dark:border-gray-700">
                {regionSymptoms.length}
              </span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side={getTooltipSide()}
          align="center"
          className="hotspot-tooltip max-w-[200px]"
          sideOffset={10}
        >
          <div className="p-3 space-y-2">
            <p className="font-medium">{region.name}</p>
            <p className="text-xs text-muted-foreground">{region.description}</p>
            {hasSymptoms && (
              <div className="mt-1 pt-1 border-t border-border/50">
                <p className="text-xs font-medium">Symptoms: {regionSymptoms.length}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BodyRegionMarker;
