
import { useState, useEffect } from 'react';
import { useSymptoms } from '@/contexts/SymptomContext';
import { Hotspot, BodySystem } from './types';
import { 
  getHotspotPosition, 
  getSeverityColor, 
  getSeverityLevel
} from './utils';

// Define the body systems with additional ones from screenshot
export const BODY_SYSTEMS: BodySystem[] = [
  { id: 'full-body', label: 'Full body' },
  { id: 'skin', label: 'Skin' },
  { id: 'muscular', label: 'Muscular' },
  { id: 'skeletal', label: 'Skeletal' },
  { id: 'organs', label: 'Organs' },
  { id: 'vascular', label: 'Vascular' },
  { id: 'nervous', label: 'Nervous' },
  { id: 'lymphatic', label: 'Lymphatic' }
];

export const useAnatomicalView = (
  selectedRegion?: string, 
  onSelectRegion?: (region: string) => void,
  patientId?: number
) => {
  const [activeSystem, setActiveSystem] = useState('muscular');
  const [isRotating, setIsRotating] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 2.8]);
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
    setCameraPosition(prev => [prev[0], prev[1], Math.max(prev[2] - 0.3, 1.5)]);
  };
  
  const handleZoomOut = () => {
    setCameraPosition(prev => [prev[0], prev[1], Math.min(prev[2] + 0.3, 8)]);
  };
  
  const handleResetView = () => {
    setCameraPosition([0, 0, 2.8]);
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
