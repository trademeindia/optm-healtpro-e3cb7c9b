
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HealthIssue } from './types';

interface HotspotMarkerProps {
  issue: HealthIssue;
  isSelected: boolean;
  onClick: (issue: HealthIssue) => void;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ issue, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get proper size based on selection state
  const getMarkerSize = () => {
    if (isSelected) return 'w-8 h-8';
    if (isHovered) return 'w-7 h-7';
    return 'w-6 h-6';
  };
  
  // Get proper z-index to ensure visibility
  const getZIndex = () => {
    if (isSelected) return 'z-30';
    return 'z-20';
  };
  
  // Get color based on severity
  const getSeverityColor = () => {
    if (issue.severity === 'high') return 'bg-red-500';
    if (issue.severity === 'medium') return 'bg-orange-500';
    return 'bg-yellow-500';
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
            className={`absolute ${getMarkerSize()} rounded-full cursor-pointer ${getSeverityColor()} flex items-center justify-center ${
              isSelected ? 'border-2 border-white scale-110 shadow-lg hotspot-pulse' : 
              isHovered ? 'border-2 border-white/80 scale-105 shadow-md' : 'border border-white/60 shadow-sm'
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
                issue.severity === 'medium' ? "bg-orange-500" :
                "bg-yellow-500"
              }`}></span>
              <h3 className="font-semibold text-sm">{issue.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{
              issue.severity === 'high' ? 'Severe' :
              issue.severity === 'medium' ? 'Moderate' :
              'Mild'
            } severity</p>
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
