
import React from 'react';
import { cn } from '@/lib/utils';
import { BodyRegion, PainSymptom } from './types';

interface BodyRegionMarkerProps {
  region: BodyRegion;
  symptom?: PainSymptom | null;
  onClick: () => void;
}

// Severity to color mapping
const getSeverityColor = (severity?: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-orange-500';
    case 'low':
      return 'bg-yellow-500';
    default:
      return 'bg-primary';
  }
};

const BodyRegionMarker: React.FC<BodyRegionMarkerProps> = ({ region, symptom, onClick }) => {
  const hasSymptom = !!symptom;
  
  // Calculate position based on region coordinates
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${region.x}%`,
    top: `${region.y}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: hasSymptom ? 20 : 10
  };
  
  return (
    <button
      className={cn(
        'w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center',
        hasSymptom 
          ? `${getSeverityColor(symptom?.severity)} animate-pulse shadow-md shadow-red-300 border-2 border-white`
          : 'bg-transparent hover:bg-blue-300 hover:border-2 border-blue-300'
      )}
      style={style}
      onClick={onClick}
      title={region.name}
    >
      {hasSymptom && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        </span>
      )}
    </button>
  );
};

export default BodyRegionMarker;
