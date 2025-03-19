
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BodyRegion, PainSymptom } from './types';
import { CircleDot, Activity, AlertCircle, Heart } from 'lucide-react';

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
    if (!hasSymptoms) return 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 text-white';
    
    // Find max severity for this region
    const maxSeverity = Math.max(...regionSymptoms.map(s => {
      switch (s.severity) {
        case 'severe': return 8;
        case 'moderate': return 5;
        case 'mild': return 3;
        default: return 1;
      }
    }));
    
    if (maxSeverity >= 7) return 'bg-gradient-to-br from-red-400 to-red-600 border-red-300 text-white';
    if (maxSeverity >= 4) return 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-white';
    return 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white';
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

  // Render appropriate icon based on symptoms
  const renderIcon = () => {
    if (!hasSymptoms) {
      return <CircleDot className="text-white" size={active ? 18 : 14} />;
    } else {
      const maxSeverity = Math.max(...regionSymptoms.map(s => {
        switch (s.severity) {
          case 'severe': return 8;
          case 'moderate': return 5;
          case 'mild': return 3;
          default: return 1;
        }
      }));
      
      if (maxSeverity >= 7) {
        return <AlertCircle className="text-white" size={active ? 18 : 14} />;
      } else if (maxSeverity >= 4) {
        return <Activity className="text-white" size={active ? 18 : 14} />;
      } else {
        return <Heart className="text-white" size={active ? 18 : 14} />;
      }
    }
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
            whileHover={{ scale: 1.2, boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
          >
            {renderIcon()}
            {hasSymptoms && (
              <span className="absolute -top-2 -right-2 bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border border-gray-200 dark:border-gray-700 shadow-md">
                {regionSymptoms.length}
              </span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side={getTooltipSide()}
          align="center"
          className="hotspot-tooltip max-w-[220px] p-0 overflow-hidden"
          sideOffset={10}
        >
          <div className="p-3 space-y-2">
            <p className="font-semibold">{region.name}</p>
            {region.description && (
              <p className="text-xs text-muted-foreground">{region.description}</p>
            )}
            {hasSymptoms && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-xs font-medium">
                  {regionSymptoms.length} {regionSymptoms.length === 1 ? 'symptom' : 'symptoms'} reported
                </p>
                <ul className="mt-1 space-y-1">
                  {regionSymptoms.slice(0, 2).map(symptom => (
                    <li key={symptom.id} className="text-xs flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                        symptom.severity === 'severe' ? 'bg-red-500' : 
                        symptom.severity === 'moderate' ? 'bg-amber-500' : 
                        'bg-green-500'
                      }`}></span>
                      {symptom.painType}
                    </li>
                  ))}
                  {regionSymptoms.length > 2 && (
                    <li className="text-xs text-muted-foreground">
                      + {regionSymptoms.length - 2} more...
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BodyRegionMarker;
