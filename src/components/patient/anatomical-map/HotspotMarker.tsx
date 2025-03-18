
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HotspotMarkerProps } from './types';

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, isActive, onClick }) => {
  // Use x and y coordinates directly from the hotspot
  const position = { x: hotspot.x, y: hotspot.y };
  
  // Determine marker size based on severity
  const getMarkerSize = () => {
    const baseSize = hotspot.size || 24;
    return isActive ? baseSize * 1.2 : baseSize;
  };
  
  // Get border width based on active state
  const getBorderWidth = () => {
    return isActive ? 3 : 2;
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="absolute cursor-pointer rounded-full flex items-center justify-center pointer-events-auto"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: `${getMarkerSize()}px`,
              height: `${getMarkerSize()}px`,
              backgroundColor: isActive ? hotspot.color : 'rgba(255, 255, 255, 0.85)',
              border: `${getBorderWidth()}px solid ${hotspot.color}`,
              boxShadow: isActive ? '0 0 12px rgba(0,0,0,0.4)' : '0 0 8px rgba(0,0,0,0.3)',
              transform: 'translate(-50%, -50%)', // Center the hotspot on its position
              zIndex: isActive ? 30 : 20, // Ensure active hotspots are above others
              transition: 'all 0.2s ease'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.15, boxShadow: '0 0 15px rgba(0,0,0,0.4)' }}
            onClick={() => onClick(hotspot)}
          >
            {isActive ? (
              <span className="text-white text-xs font-bold">{hotspot.id}</span>
            ) : (
              <span className="text-xs font-bold" style={{ color: hotspot.color }}>{hotspot.id}</span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={5} className="z-50 font-medium">
          <div className="p-2">
            <p className="font-medium">{hotspot.label}</p>
            {hotspot.description && (
              <p className="text-xs text-muted-foreground max-w-[200px]">{hotspot.description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;
