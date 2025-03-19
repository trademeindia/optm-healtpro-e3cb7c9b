
import React from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HotspotMarkerProps } from './types';
import { MapPin, AlertCircle, Activity, CircleDot } from 'lucide-react';

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, isActive, onClick }) => {
  // Determine tooltip positioning based on hotspot coordinates
  const getTooltipSide = (): "top" | "right" | "bottom" | "left" => {
    if (hotspot.x < 25) return "right";
    if (hotspot.x > 75) return "left";
    if (hotspot.y < 30) return "bottom";
    return "top";
  };

  // Get the severity class for styling
  const getSeverityClass = () => {
    if (!hotspot.severity) return 'hotspot-severity-medium';
    if (hotspot.severity <= 3) return 'hotspot-severity-low';
    if (hotspot.severity <= 6) return 'hotspot-severity-medium';
    return 'hotspot-severity-high';
  };
  
  // Get size class based on severity and active state
  const getSizeClass = () => {
    if (isActive) return 'hotspot-size-lg';
    return hotspot.severity && hotspot.severity > 5 ? 'hotspot-size-md' : 'hotspot-size-sm';
  };

  // Render appropriate icon based on severity
  const renderIcon = () => {
    if (!hotspot.severity || hotspot.severity <= 3) {
      return <CircleDot className="hotspot-icon" size={isActive ? 16 : 12} />;
    } else if (hotspot.severity <= 6) {
      return <Activity className="hotspot-icon" size={isActive ? 16 : 12} />;
    } else {
      return <AlertCircle className="hotspot-icon" size={isActive ? 16 : 12} />;
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`hotspot-marker ${getSizeClass()} ${getSeverityClass()} ${isActive ? 'hotspot-active hotspot-pulse' : ''}`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              backgroundColor: isActive ? 
                `rgba(${hotspot.severity > 6 ? '239, 68, 68' : hotspot.severity > 3 ? '251, 191, 36' : '52, 211, 153'}, 0.6)` :
                `rgba(${hotspot.severity > 6 ? '239, 68, 68' : hotspot.severity > 3 ? '251, 191, 36' : '52, 211, 153'}, 0.5)`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: isActive ? 0.9 : 0.75 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.15, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onClick(hotspot)}
          >
            {renderIcon()}
            {isActive && hotspot.id && (
              <span className="hotspot-label text-white text-xs font-bold sr-only">{hotspot.id}</span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side={getTooltipSide()} 
          className="hotspot-tooltip z-50 shadow-lg"
          sideOffset={12}
        >
          <div className="p-3 space-y-2">
            <p className="font-semibold text-sm">{hotspot.label}</p>
            {hotspot.severity && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                hotspot.severity <= 3 ? 'bg-green-100 text-green-800' : 
                hotspot.severity <= 6 ? 'bg-amber-100 text-amber-800' : 
                'bg-red-100 text-red-800'
              }`}>
                Pain level: {hotspot.severity}/10
              </div>
            )}
            {hotspot.description && (
              <p className="text-xs text-muted-foreground">{hotspot.description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;
