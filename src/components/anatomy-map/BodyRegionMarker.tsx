
import React from 'react';
import { BodyRegion, PainSymptom } from './types';

interface BodyRegionMarkerProps {
  region: BodyRegion;
  active: boolean;
  symptoms: PainSymptom[];
  onClick: () => void;
}

const BodyRegionMarker: React.FC<BodyRegionMarkerProps> = ({
  region,
  active,
  symptoms,
  onClick
}) => {
  // Count active symptoms for this region
  const symptomCount = symptoms.filter(s => s.bodyRegionId === region.id && s.isActive).length;
  
  // Determine size based on number of symptoms
  const sizeClass = 
    symptomCount > 3 ? 'hotspot-size-lg' : 
    symptomCount > 0 ? 'hotspot-size-md' : 
    'hotspot-size-sm';

  // Determine color based on highest severity
  const determineMarkerColor = () => {
    const regionSymptoms = symptoms.filter(s => s.bodyRegionId === region.id && s.isActive);
    if (regionSymptoms.length === 0) return 'bg-blue-400';
    
    const hasSevere = regionSymptoms.some(s => s.severity === 'severe');
    const hasModerate = regionSymptoms.some(s => s.severity === 'moderate');
    
    if (hasSevere) return 'bg-red-500';
    if (hasModerate) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div 
      className={`hotspot-marker ${sizeClass} ${active ? 'hotspot-active hotspot-pulse' : ''}`}
      style={{
        left: `${region.x}%`,
        top: `${region.y}%`,
        backgroundColor: determineMarkerColor()
      }}
      onClick={onClick}
    >
      {symptomCount > 0 && (
        <span className="text-white text-xs font-bold">{symptomCount}</span>
      )}
    </div>
  );
};

export default BodyRegionMarker;
