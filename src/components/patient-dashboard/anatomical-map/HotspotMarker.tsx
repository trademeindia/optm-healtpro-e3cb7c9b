
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
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`absolute w-5 h-5 rounded-full cursor-pointer ${getSeverityColor(issue.severity)} flex items-center justify-center border-2 ${
              isSelected ? 'border-white w-7 h-7 z-20 scale-110 shadow-lg' : 
              isHovered ? 'border-white scale-105 shadow-md' : 'border-white/80 shadow-sm'
            } transition-all duration-200`}
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
        <TooltipContent side="right" className="max-w-[220px] bg-white/95 backdrop-blur-sm z-30">
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
