
import React, { useState } from 'react';
import { BodyRegion, PainSymptom, painSeverityOptions } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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
      return 'w-4 h-4 bg-transparent border border-gray-400 hover:border-primary hover:bg-primary/10';
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
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Region clicked: ${region.name}`);
              onClick();
            }}
            onMouseEnter={() => {
              setIsHovered(true);
              console.log(`Region hovered: ${region.name}`);
            }}
            onMouseLeave={() => setIsHovered(false)}
            data-testid={`region-marker-${region.id}`}
            aria-label={region.name}
          >
            {symptom && isHovered && (
              <span className="absolute -top-6 whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-medium shadow-md z-20">
                {region.name}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="z-50 max-w-[250px] p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold">{region.name}</h3>
            {symptom && (
              <Badge className={`${
                symptom.severity === 'severe' ? 'bg-red-500' : 
                symptom.severity === 'moderate' ? 'bg-orange-500' : 
                'bg-yellow-500'
              } text-white`}>
                {symptom.severity}
              </Badge>
            )}
          </div>
          
          {region.description && (
            <p className="text-xs text-muted-foreground mt-1">{region.description}</p>
          )}
          
          {symptom ? (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium">Reported Symptoms:</p>
              <p className="text-xs"><span className="font-medium">Type:</span> {symptom.painType}</p>
              <p className="text-xs"><span className="font-medium">Last updated:</span> {new Date(symptom.updatedAt).toLocaleString()}</p>
              <p className="text-xs mt-1 text-muted-foreground">{symptom.description}</p>
              {symptom.triggers && symptom.triggers.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs font-medium">Triggers:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {symptom.triggers.map((trigger, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
