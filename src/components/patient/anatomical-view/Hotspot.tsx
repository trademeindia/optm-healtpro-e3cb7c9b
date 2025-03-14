
import React from 'react';
import { AnatomicalMapping, Biomarker } from '@/types/medicalData';

interface HotspotProps {
  mapping: AnatomicalMapping;
  biomarkers: Biomarker[];
}

const Hotspot: React.FC<HotspotProps> = ({ mapping, biomarkers }) => {
  const { x, y } = mapping.coordinates;
  
  // Determine color based on severity
  const getColor = (severity: number) => {
    if (severity >= 8) return 'bg-red-500';
    if (severity >= 5) return 'bg-amber-500';
    return 'bg-yellow-400';
  };
  
  // Determine size based on number of biomarkers
  const getSize = (biomarkerCount: number) => {
    if (biomarkerCount >= 3) return 'h-4 w-4';
    if (biomarkerCount >= 2) return 'h-3 w-3';
    return 'h-2 w-2';
  };
  
  return (
    <div 
      className={`absolute rounded-full animate-pulse ${getColor(mapping.severity)} ${getSize(biomarkers.length)}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      title={mapping.bodyPart}
    />
  );
};

export default Hotspot;
