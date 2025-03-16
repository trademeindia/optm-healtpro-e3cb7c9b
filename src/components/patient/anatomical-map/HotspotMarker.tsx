
import React from 'react';
import { motion } from 'framer-motion';
import { HotSpot } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HotspotMarkerProps {
  hotspot: HotSpot;
  isActive: boolean;
  onClick: (hotspot: HotSpot) => void;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, isActive, onClick }) => {
  const getMarkerSize = () => {
    // Adjust size based on severity
    const baseSize = hotspot.severity > 7 ? 6 : hotspot.severity > 4 ? 5 : 4;
    return {
      width: `${baseSize + (isActive ? 2 : 0)}px`,
      height: `${baseSize + (isActive ? 2 : 0)}px`,
    };
  };

  const getSeverityColor = () => {
    if (hotspot.severity > 8) return 'bg-red-500';
    if (hotspot.severity > 5) return 'bg-orange-500';
    if (hotspot.severity > 3) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            className={`absolute rounded-full ${getSeverityColor()} shadow-md cursor-pointer ${
              isActive ? 'z-20 ring-2 ring-white' : 'z-10'
            }`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              ...getMarkerSize()
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              boxShadow: isActive ? '0 0 0 2px rgba(255,255,255,0.8)' : 'none'
            }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onClick(hotspot)}
            transition={{ duration: 0.2 }}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs bg-white dark:bg-gray-800 p-2 max-w-[200px] text-center">
          <p className="font-medium">{hotspot.label}</p>
          {hotspot.description && (
            <p className="text-muted-foreground text-[10px]">{hotspot.description}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;
