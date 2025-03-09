
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  AnatomicalCanvas, 
  DetailsPanel,
  Header,
  IssuesCounter,
  useAnatomicalView
} from './anatomical-view';
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
        <Header 
          systems={bodySystems}
          activeSystem={activeSystem}
          onSystemChange={setActiveSystem}
        />
      </CardHeader>
      
      <CardContent className="flex-1 pt-0 pb-6 px-4 relative" style={{ height: 'calc(100% - 80px)' }}>
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
        
        <DetailsPanel activeHotspotDetails={activeHotspotDetails} />
        
        <IssuesCounter count={hotspots.length} />
      </CardContent>
    </Card>
  );
};

export default AnatomicalView;
