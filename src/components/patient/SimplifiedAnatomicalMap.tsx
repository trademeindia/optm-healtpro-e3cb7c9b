
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import MapVisualization from '@/components/patient/anatomical-map/MapVisualization';

interface SimplifiedAnatomicalMapProps {
  patientId: number;
  onRegionSelect?: (region: string) => void;
}

const SimplifiedAnatomicalMap: React.FC<SimplifiedAnatomicalMapProps> = ({ 
  patientId,
  onRegionSelect 
}) => {
  const [activeSystem, setActiveSystem] = useState("skeletal");
  const [zoom, setZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<any>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Mock hotspots data
  const hotspots = [
    { id: 1, name: "Shoulder", x: 50, y: 25, description: "Right shoulder area" },
    { id: 2, name: "Lower Back", x: 50, y: 60, description: "Lumbar region" },
    { id: 3, name: "Knee", x: 45, y: 80, description: "Left knee joint" }
  ];

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setActiveHotspot(null);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
  };

  const handleHotspotClick = (hotspot: any) => {
    setActiveHotspot(hotspot);
    if (onRegionSelect) {
      onRegionSelect(hotspot.name);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Anatomical Map</h3>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleZoomIn}
            disabled={zoom >= 1.5}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleReset}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 h-[600px] md:h-[400px]">
        <div className="flex-1">
          <MapVisualization
            activeSystem={activeSystem}
            zoom={zoom}
            hotspots={hotspots}
            activeHotspot={activeHotspot}
            imageLoaded={imageLoaded}
            onImageLoad={handleImageLoad}
            onHotspotClick={handleHotspotClick}
          />
        </div>
        
        <div className="flex-1 mt-4 md:mt-0">
          {activeHotspot ? (
            <div className="h-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2">{activeHotspot.name}</h3>
              <p className="text-muted-foreground mb-4">{activeHotspot.description}</p>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Common Issues</h4>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Inflammation</li>
                    <li>Stiffness</li>
                    <li>Pain on movement</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Recommendations</h4>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Stretching exercises</li>
                    <li>Cold compress</li>
                    <li>Posture management</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-muted-foreground">Select a region on the anatomical map</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplifiedAnatomicalMap;
