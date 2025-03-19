
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
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`absolute ${getMarkerSize()} rounded-full cursor-pointer ${getSeverityColor(issue.severity)} flex items-center justify-center border-2 ${
              isSelected ? 'border-white scale-110 shadow-lg' : 
              isHovered ? 'border-white/80 scale-105 shadow-md' : 'border-white/60 shadow-sm'
            } transition-all duration-200 ${getZIndex()}`}
            style={{
              left: `${issue.location.x}%`,
              top: `${issue.location.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onClick(issue)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-testid={`hotspot-${issue.id}`}
          >
            <span className="text-white text-xs font-bold">{issue.id}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[220px] bg-white/95 backdrop-blur-sm z-50">
          <p className="font-semibold">{issue.name}</p>
          <p className="text-xs text-muted-foreground">{getSeverityLabel(issue.severity)} severity</p>
          {issue.muscleGroup && (
            <p className="text-xs mt-1">Affects: {issue.muscleGroup}</p>
          )}
          <p className="text-xs mt-1 italic">Click for details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;
