
import { useState, useEffect } from 'react';
import { BodySystem, Hotspot } from './types';

export const useAnatomicalView = (
  selectedRegion?: string, 
  onSelectRegion?: (region: string) => void,
  patientId?: number
) => {
  // Available body systems
  const bodySystems: BodySystem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'skeletal', label: 'Skeletal' },
    { id: 'muscular', label: 'Muscular' },
    { id: 'muscular-new', label: 'Muscular HD' },
    { id: 'nervous', label: 'Nervous' }
  ];
  
  // State for the active system, camera, rotation, etc.
  const [activeSystem, setActiveSystem] = useState('overview');
  const [isRotating, setIsRotating] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 4]);
  
  // Mock hotspots data - this would come from an API in a real app
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  
  // Active hotspot details (when a hotspot is clicked)
  const [activeHotspotDetails, setActiveHotspotDetails] = useState<Hotspot | null>(null);
  
  // Generate mock hotspots data based on selected region and system
  useEffect(() => {
    // This would be replaced with an API call in a real application
    // Sample hotspot data
    const mockHotspots: Hotspot[] = selectedRegion ? [
      {
        id: '1',
        position: [0.5, 0.8, 0],
        label: `${selectedRegion} Issue 1`,
        description: `Pain in ${selectedRegion} area likely caused by muscle tension`,
        severity: 'Moderate',
        color: '#FF4500',
        size: 0.15,
        region: selectedRegion
      },
      {
        id: '2',
        position: [-0.5, 0.3, 0],
        label: `${selectedRegion} Issue 2`,
        description: `Inflammation detected in ${selectedRegion} region`,
        severity: 'Mild',
        color: '#FFA500',
        size: 0.12,
        region: selectedRegion
      }
    ] : [];
    
    setHotspots(mockHotspots);
  }, [selectedRegion, activeSystem]);
  
  // Camera zoom controls
  const handleZoomIn = () => {
    setCameraPosition(prev => [prev[0], prev[1], Math.max(prev[2] - 0.5, 2.5)]);
  };
  
  const handleZoomOut = () => {
    setCameraPosition(prev => [prev[0], prev[1], Math.min(prev[2] + 0.5, 7)]);
  };
  
  const handleResetView = () => {
    setCameraPosition([0, 0, 4]);
    setIsRotating(false);
  };
  
  // Hotspot click handler
  const handleHotspotClick = (id: string) => {
    const hotspot = hotspots.find(h => h.id === id);
    setActiveHotspotDetails(hotspot || null);
    
    // If this hotspot is in a different region than the currently selected one,
    // update the selected region
    if (hotspot && hotspot.region !== selectedRegion && onSelectRegion) {
      onSelectRegion(hotspot.region);
    }
  };
  
  return {
    activeSystem,
    setActiveSystem,
    isRotating,
    setIsRotating,
    cameraPosition,
    hotspots,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleHotspotClick,
    activeHotspotDetails,
    bodySystems
  };
};
