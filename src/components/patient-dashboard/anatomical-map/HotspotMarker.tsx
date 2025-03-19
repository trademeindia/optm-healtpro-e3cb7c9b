
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HealthIssue } from './types';
import { getSeverityColor } from './utils';

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
            className={`absolute w-5 h-5 rounded-full cursor-pointer ${getSeverityColor(issue.severity)} flex items-center justify-center border-2 border-white shadow-md transition-all duration-200 ${
              isSelected ? 'w-7 h-7 z-10 scale-110' : 
              isHovered ? 'scale-105' : ''
            }`}
            style={{
              left: `${issue.location.x}%`,
              top: `${issue.location.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onClick(issue)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="text-white text-xs font-bold">{issue.id}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[200px]">
          <p className="font-semibold">{issue.name}</p>
          <p className="text-xs">{issue.severity.toUpperCase()} severity</p>
          {issue.muscleGroup && (
            <p className="text-xs mt-1">Affects: {issue.muscleGroup}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;
