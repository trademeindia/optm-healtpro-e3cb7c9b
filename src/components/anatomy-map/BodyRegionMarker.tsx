
import React from 'react';
import { BodyRegion } from './types';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BodyRegionMarkerProps {
  region: BodyRegion;
  hasSymptom: boolean;
  onClick: () => void;
}

const BodyRegionMarker: React.FC<BodyRegionMarkerProps> = ({ 
  region, 
  hasSymptom, 
  onClick 
}) => {
  // Ensure markers are visible with better contrasting colors
  const markerColor = hasSymptom ? 'bg-red-500 border-red-600' : 'bg-blue-400 border-blue-500';
  
  // Add debug info
  console.log(`Rendering marker for ${region.name} at (${region.x}%, ${region.y}%)${hasSymptom ? ' with symptom' : ''}`);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`absolute w-4 h-4 rounded-full ${markerColor} border-2 hover:scale-125 transition-transform z-10`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={onClick}
            aria-label={`${region.name} ${hasSymptom ? '(has symptoms)' : ''}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{region.name}</p>
          {hasSymptom && <p className="text-xs text-red-500 font-medium">Has symptoms</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BodyRegionMarker;
