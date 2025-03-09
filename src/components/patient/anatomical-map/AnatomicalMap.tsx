
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSymptoms } from '@/contexts/SymptomContext';
import { AnatomicalMapProps, HotSpot } from './types';
import { symptomsToHotspots } from './utils';
import MapControls from './MapControls';
import HotspotMarker from './HotspotMarker';
import HotspotDetail from './HotspotDetail';

const AnatomicalMap: React.FC<AnatomicalMapProps> = () => {
  const { symptoms } = useSymptoms();
  const [zoom, setZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<HotSpot | null>(null);
  const [hotspots, setHotspots] = useState<HotSpot[]>([]);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleZoomIn = () => {
    if (zoom < 2) setZoom(prev => prev + 0.2);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.6) setZoom(prev => prev - 0.2);
  };
  
  const handleHotspotClick = (hotspot: HotSpot) => {
    setActiveHotspot(hotspot === activeHotspot ? null : hotspot);
  };

  // Function to handle image load event to ensure markers are positioned correctly
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setMapDimensions({
      width: img.clientWidth,
      height: img.clientHeight
    });
    setImageLoaded(true);
  };

  // Convert symptoms to hotspots whenever symptoms change
  useEffect(() => {
    console.log("Symptoms updated in AnatomicalMap:", symptoms);
    setHotspots(symptomsToHotspots(symptoms));
  }, [symptoms]);

  return (
    <Card className="glass-morphism">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Anatomical Map</CardTitle>
            <CardDescription>Interactive visualization of affected areas</CardDescription>
          </div>
          <MapControls 
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0 pb-4 px-4">
        <div className="relative flex justify-center overflow-hidden bg-muted/20 rounded-lg border border-border/50 h-[500px]">
          <motion.div
            className="relative w-full h-full flex justify-center"
            style={{
              scale: zoom,
              transition: 'scale 0.2s ease-out'
            }}
          >
            {/* Anatomical model image */}
            <img
              src="/lovable-uploads/1470fab3-8415-4671-8b34-b510f4784781.png"
              alt="Human Anatomy Model"
              className="h-full object-contain max-w-full"
              style={{ maxHeight: '500px' }}
              onLoad={handleImageLoad}
            />
            
            {/* Hotspots - Only render if image is loaded */}
            {imageLoaded && (
              <AnimatePresence>
                {hotspots.map((hotspot) => (
                  <HotspotMarker
                    key={hotspot.id}
                    hotspot={hotspot}
                    isActive={activeHotspot?.id === hotspot.id}
                    onClick={handleHotspotClick}
                  />
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
        
        {/* Detail panel for active hotspot */}
        {activeHotspot && <HotspotDetail hotspot={activeHotspot} />}
      </CardContent>
    </Card>
  );
};

export default AnatomicalMap;
