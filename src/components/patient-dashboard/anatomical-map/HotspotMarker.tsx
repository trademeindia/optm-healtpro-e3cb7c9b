
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HealthIssue } from './types';
import { getSeverityColor, getSeverityLabel } from './utils';

interface HotspotMarkerProps {
  issue: HealthIssue;
  isSelected: boolean;
  onClick: (issue: HealthIssue) => void;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ issue, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get proper size based on selection state
  const getMarkerSize = () => {
    if (isSelected) return 'w-7 h-7';
    if (isHovered) return 'w-6 h-6';
    return 'w-5 h-5';
  };
  
  // Get proper z-index to ensure visibility
  const getZIndex = () => {
    if (isSelected) return 'z-30';
    return 'z-20';
  };
  
  // Determine tooltip positioning based on issue location
  const getTooltipSide = (): "top" | "right" | "bottom" | "left" => {
    if (issue.location.x < 25) return "right";
    if (issue.location.x > 75) return "left";
    if (issue.location.y < 30) return "bottom";
    return "top";
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`absolute ${getMarkerSize()} rounded-full cursor-pointer ${getSeverityColor(issue.severity)} flex items-center justify-center ${
              isSelected ? 'border-2 border-white scale-110 shadow-lg hotspot-pulse' : 
              isHovered ? 'border-2 border-white/80 scale-105 shadow-md' : 'border-2 border-white/60 shadow-sm'
            } transition-all duration-200 ${getZIndex()}`}
            style={{
              left: `${issue.location.x}%`,
              top: `${issue.location.y}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: isSelected ? '0 0 15px rgba(0, 0, 0, 0.4)' : '0 0 8px rgba(0, 0, 0, 0.2)'
            }}
            onClick={() => onClick(issue)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-testid={`hotspot-${issue.id}`}
          >
            <span className="text-white text-xs font-bold">{issue.id}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={getTooltipSide()} 
          className="hotspot-tooltip z-50"
          sideOffset={12}
        >
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${
                issue.severity === 'high' ? "bg-red-500" :
                issue.severity === 'medium' ? "bg-amber-500" :
                "bg-green-500"
              }`}></span>
              <h3 className="font-semibold text-sm">{issue.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{getSeverityLabel(issue.severity)} severity</p>
            {issue.muscleGroup && (
              <p className="text-xs mt-1">Affects: {issue.muscleGroup}</p>
            )}
            <p className="text-xs mt-1 italic">Click for details</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;
