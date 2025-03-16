
import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HotspotMarkerProps } from './types';
import { getHotspotPosition } from './regions';

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, isActive, onClick }) => {
  // Use x and y coordinates directly from the hotspot
  const position = { x: hotspot.x, y: hotspot.y };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="absolute cursor-pointer rounded-full flex items-center justify-center"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: `${hotspot.size}px`,
              height: `${hotspot.size}px`,
              backgroundColor: isActive ? hotspot.color : 'rgba(255, 255, 255, 0.7)',
              border: `2px solid ${hotspot.color}`,
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              transform: 'translate(-50%, -50%)', // Center the hotspot on its position
              zIndex: 20 // Ensure hotspots are above the image
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => onClick(hotspot)}
          >
            {isActive ? (
              <span className="text-white text-xs font-bold">{hotspot.id}</span>
            ) : (
              <span className="text-xs font-bold" style={{ color: hotspot.color }}>{hotspot.id}</span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{hotspot.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;
