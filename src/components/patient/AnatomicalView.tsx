
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { AnatomicalCanvas } from './anatomical-view';
import { HotspotDetails } from './anatomical-view';
import { IssuesCounter } from './anatomical-view';
import { SystemSelector } from './anatomical-view';
import { useAnatomicalView } from './anatomical-view';
import { AnatomicalViewProps } from './anatomical-view';

const AnatomicalView: React.FC<AnatomicalViewProps> = ({ 
  selectedRegion, 
  onSelectRegion,
  patientId 
}) => {
  // Track the internal selected region
  const [internalSelectedRegion, setInternalSelectedRegion] = useState<string | undefined>(selectedRegion);
  
  // Update internal state when external selectedRegion changes
  useEffect(() => {
    setInternalSelectedRegion(selectedRegion);
  }, [selectedRegion]);

  // Handler for internal region selection
  const handleRegionSelect = (region: string) => {
    setInternalSelectedRegion(region);
    // Propagate change to parent if callback provided
    if (onSelectRegion) {
      onSelectRegion(region);
    }
  };

  const {
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
  } = useAnatomicalView(internalSelectedRegion, handleRegionSelect, patientId);

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>3D Anatomical View</CardTitle>
            <CardDescription>Interactive visualization of patient issues</CardDescription>
          </div>
          
          <SystemSelector 
            systems={bodySystems} 
            activeSystem={activeSystem} 
            onSystemChange={setActiveSystem} 
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0 pb-6 px-4 relative" style={{ minHeight: '70vh', position: 'relative' }}>
        <AnatomicalCanvas 
          activeSystem={activeSystem}
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          cameraPosition={cameraPosition}
          hotspots={hotspots}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetView={handleResetView}
          handleHotspotClick={handleHotspotClick}
        />
        
        {activeHotspotDetails && (
          <HotspotDetails hotspot={activeHotspotDetails} />
        )}
        
        <IssuesCounter count={hotspots.length} />
      </CardContent>
    </Card>
  );
};

export default AnatomicalView;
