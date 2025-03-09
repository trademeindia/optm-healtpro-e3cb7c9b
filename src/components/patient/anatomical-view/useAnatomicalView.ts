
import { useState, useEffect } from 'react';
import { useSymptoms } from '@/contexts/SymptomContext';
import { Hotspot } from './types';
import { 
  getHotspotPosition, 
  getSeverityColor, 
  getSeverityLevel, 
  BODY_SYSTEMS 
} from './utils';

export const useAnatomicalView = (
  selectedRegion?: string, 
  onSelectRegion?: (region: string) => void,
  patientId?: number
) => {
  const [activeSystem, setActiveSystem] = useState('muscular');
  const [isRotating, setIsRotating] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const { symptoms } = useSymptoms();

  const hotspots: Hotspot[] = symptoms.map(symptom => ({
    id: symptom.id,
    position: getHotspotPosition(symptom.location),
    label: symptom.symptomName,
    description: symptom.notes,
    severity: getSeverityLevel(symptom.painLevel),
    color: getSeverityColor(symptom.painLevel),
    size: 0.1 + (symptom.painLevel * 0.02)
  }));
  
  const handleZoomIn = () => {
    setCameraPosition(prev => [prev[0], prev[1], prev[2] - 1]);
  };
  
  const handleZoomOut = () => {
    setCameraPosition(prev => [prev[0], prev[1], prev[2] + 1]);
  };
  
  const handleResetView = () => {
    setCameraPosition([0, 0, 5]);
    setIsRotating(false);
  };
  
  const handleHotspotClick = (id: string) => {
    setActiveHotspot(id === activeHotspot ? null : id);
    if (onSelectRegion) {
      const symptom = symptoms.find(s => s.id === id);
      if (symptom) {
        onSelectRegion(symptom.location);
      }
    }
  };
  
  const activeHotspotDetails = activeHotspot 
    ? hotspots.find(h => h.id === activeHotspot) 
    : null;

  return {
    activeSystem,
    setActiveSystem,
    isRotating,
    setIsRotating,
    cameraPosition,
    setCameraPosition,
    activeHotspot,
    setActiveHotspot,
    hotspots,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleHotspotClick,
    activeHotspotDetails,
    bodySystems: BODY_SYSTEMS
  };
};
