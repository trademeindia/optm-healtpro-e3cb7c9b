
import React from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HotspotMarkerProps } from './types';

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, isActive, onClick }) => {
  // Determine tooltip positioning based on hotspot coordinates
  const getTooltipSide = (): "top" | "right" | "bottom" | "left" => {
    if (hotspot.x < 25) return "right";
    if (hotspot.x > 75) return "left";
    if (hotspot.y < 30) return "bottom";
    return "top";
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="absolute cursor-pointer rounded-full flex items-center justify-center region-marker-transition"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.size}px`,
              height: `${hotspot.size}px`,
              backgroundColor: isActive ? hotspot.color : 'rgba(255, 255, 255, 0.7)',
              border: `2px solid ${hotspot.color}`,
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              transform: 'translate(-50%, -50%)', 
              zIndex: isActive ? 30 : 20
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
        <TooltipContent 
          side={getTooltipSide()} 
          className="region-tooltip z-50"
        >
          <p className="font-medium">{hotspot.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;
