
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Activity, AlertTriangle, X, Info } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Hotspot } from './types';

interface HotspotItemProps {
  hotspot: Hotspot;
  activeHotspot: string | null;
  editMode: boolean;
  readOnly: boolean;
  onClick: (id: string, label: string, status: 'normal' | 'warning' | 'critical') => void;
}

const HotspotItem: React.FC<HotspotItemProps> = ({
  hotspot,
  activeHotspot,
  editMode,
  readOnly,
  onClick
}) => {
  const getHotspotIcon = (status: 'normal' | 'warning' | 'critical') => {
    switch(status) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3 text-white" />;
      case 'warning':
        return <Activity className="h-3 w-3 text-white" />;
      case 'normal':
        return <Check className="h-3 w-3 text-white" />;
      default:
        return <Info className="h-3 w-3 text-white" />;
    }
  };

  const getPulseAnimation = (status: 'normal' | 'warning' | 'critical') => {
    if (status === 'critical') return 'animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    if (status === 'warning') return 'animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    return '';
  };

  const getTooltipSide = (x: number, y: number): "top" | "right" | "bottom" | "left" => {
    if (x < 25) return "right";
    if (x > 75) return "left";
    if (y < 30) return "bottom";
    return "top";
  };

  const getTooltipAlign = (x: number, y: number): "start" | "center" | "end" => {
    if (y < 25) return "start";
    if (y > 75) return "end";
    return "center";
  };

  const getCollisionPadding = () => {
    return {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    };
  };

  return (
    <TooltipProvider key={hotspot.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "absolute flex items-center justify-center cursor-pointer",
              getPulseAnimation(hotspot.status),
              hotspot.status === 'critical' ? "w-7 h-7" : "w-6 h-6",
              hotspot.status !== 'normal' ? "ring-2 ring-white ring-opacity-50" : "",
              activeHotspot === hotspot.id ? "z-10" : "z-0",
              editMode && !readOnly ? "hover:ring-2 hover:ring-destructive" : ""
            )}
            style={{
              backgroundColor: hotspot.status === 'critical' ? '#FF4D4F' : 
                              hotspot.status === 'warning' ? '#FAAD14' : 
                              '#52C41A',
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              borderRadius: '50%'
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: activeHotspot === hotspot.id ? [1, 1.2, 1] : 1,
              transition: {
                scale: activeHotspot === hotspot.id ? {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1
                } : {}
              }
            }}
            onClick={() => onClick(hotspot.id, hotspot.label, hotspot.status)}
          >
            {editMode && !readOnly ? 
              <X className="h-3 w-3 text-white" /> : 
              (hotspot.icon || getHotspotIcon(hotspot.status))}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side={getTooltipSide(hotspot.x, hotspot.y)} 
          align={getTooltipAlign(hotspot.x, hotspot.y)}
          sideOffset={20}
          avoidCollisions={true}
          collisionPadding={getCollisionPadding()}
          className="p-0"
        >
          <div className="w-full max-w-[300px] space-y-2 p-4 overflow-visible">
            <div className="flex items-center gap-2">
              <span className={cn(
                "inline-block w-2 h-2 rounded-full",
                hotspot.status === 'critical' ? "bg-red-500" : 
                hotspot.status === 'warning' ? "bg-yellow-500" : 
                "bg-green-500"
              )}></span>
              <h3 className="font-bold text-sm">{hotspot.label}</h3>
            </div>
            <p className="text-xs text-wrap break-words whitespace-normal">{hotspot.description}</p>
            {hotspot.status !== 'normal' && (
              <p className={cn(
                "text-xs font-medium mt-1 px-2 py-1 rounded text-center",
                hotspot.status === 'critical' ? "bg-red-100 text-red-800" : 
                "bg-yellow-100 text-yellow-800"
              )}>
                {hotspot.status === 'critical' ? 'Critical issue' : 'Minor issue'}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotItem;
