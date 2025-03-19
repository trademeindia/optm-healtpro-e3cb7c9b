
import React, { useState } from 'react';
import { BodyRegion, PainSymptom, painSeverityOptions } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BodyRegionMarkerProps {
  region: BodyRegion;
  symptom?: PainSymptom;
  onClick: () => void;
}

const BodyRegionMarker: React.FC<BodyRegionMarkerProps> = ({ region, symptom, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine marker styling based on symptom severity
  const getMarkerStyle = () => {
    if (!symptom) {
      return 'w-4 h-4 bg-transparent border border-gray-400 hover:border-primary';
    }
    
    const severityOption = painSeverityOptions.find(option => option.value === symptom.severity);
    const sizeClass = symptom.severity === 'severe' ? 'w-6 h-6' : 
                      symptom.severity === 'moderate' ? 'w-5 h-5' : 'w-4 h-4';
    
    return `${sizeClass} ${severityOption?.color || 'bg-blue-500'} border-2 border-white shadow-md`;
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`absolute rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 ${getMarkerStyle()} ${
              isHovered ? 'scale-110 z-10' : ''
            }`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-testid={`region-marker-${region.id}`}
          />
        </TooltipTrigger>
        <TooltipContent side="right" className="z-50 max-w-[220px] p-3">
          <p className="font-semibold">{region.name}</p>
          {region.description && (
            <p className="text-xs text-muted-foreground mt-1">{region.description}</p>
          )}
          {symptom ? (
            <div className="mt-2">
              <p className="text-sm font-medium">Reported Symptoms:</p>
              <p className="text-xs"><span className="font-medium">Type:</span> {symptom.painType}</p>
              <p className="text-xs"><span className="font-medium">Severity:</span> {symptom.severity}</p>
              <p className="text-xs mt-1 text-muted-foreground">{symptom.description}</p>
            </div>
          ) : (
            <p className="text-xs mt-1 italic">Click to add symptoms</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BodyRegionMarker;
