
import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HotspotProps } from './types';
import { getHotspotPosition } from './regions';

const HotspotMarker: React.FC<HotspotProps> = ({ hotspot, isActive, onClick }) => {
  const position = getHotspotPosition(hotspot.region);
  
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
              backgroundColor: hotspot.color,
              border: isActive ? '2px solid white' : '2px dashed rgba(255,255,255,0.7)',
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
            <Target className="h-3 w-3 text-white" />
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
