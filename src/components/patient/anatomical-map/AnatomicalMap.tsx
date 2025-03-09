
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSymptoms } from '@/contexts/SymptomContext';
import { AnatomicalMapProps, HotSpot } from './types';
import { symptomsToHotspots } from './utils';
import MapControls from './MapControls';
import HotspotMarker from './HotspotMarker';
import HotspotDetail from './HotspotDetail';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnatomicalMap: React.FC<AnatomicalMapProps> = ({ className }) => {
  const { symptoms } = useSymptoms();
  const [zoom, setZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<HotSpot | null>(null);
  const [hotspots, setHotspots] = useState<HotSpot[]>([]);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeSystem, setActiveSystem] = useState('muscular');
  
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

  // Select the appropriate image based on active system
  const getSystemImage = () => {
    switch (activeSystem) {
      case 'muscular':
        return "/lovable-uploads/49a33513-51a5-4cbb-b210-a6308cfa91bf.png";
      case 'skeletal':
        return "/lovable-uploads/c259fc72-51f3-49b7-863e-d018adadb9df.png";
      case 'skin':
        return "/lovable-uploads/a6f71747-46dd-486d-97a5-2e263119b969.png";
      case 'organs':
        return "/lovable-uploads/5a2de827-6408-43ae-91c8-4bfd13c1ed17.png";
      case 'vascular':
      case 'nervous':
      case 'lymphatic':
        return "/lovable-uploads/2f92810e-f197-4554-81aa-25c65d85b001.png";
      default:
        return "/lovable-uploads/49a33513-51a5-4cbb-b210-a6308cfa91bf.png";
    }
  };

  return (
    <Card className={`bg-white dark:bg-gray-800 shadow-sm ${className || ''}`}>
      <CardHeader className="pb-3 flex flex-col">
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
        
        <Tabs 
          defaultValue="muscular" 
          value={activeSystem}
          onValueChange={setActiveSystem}
          className="w-full mt-4"
        >
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="full-body" className="text-xs sm:text-sm">Full body</TabsTrigger>
            <TabsTrigger value="skin" className="text-xs sm:text-sm">Skin</TabsTrigger>
            <TabsTrigger value="muscular" className="text-xs sm:text-sm">Muscular</TabsTrigger>
            <TabsTrigger value="skeletal" className="text-xs sm:text-sm">Skeletal</TabsTrigger>
            <TabsTrigger value="organs" className="text-xs sm:text-sm">Organs</TabsTrigger>
            <TabsTrigger value="vascular" className="text-xs sm:text-sm">Vascular</TabsTrigger>
            <TabsTrigger value="nervous" className="text-xs sm:text-sm">Nervous</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0 pb-4 px-4">
        <div className="relative flex justify-center overflow-hidden bg-gray-50 dark:bg-gray-700/20 rounded-lg h-[550px]">
          <motion.div
            className="relative w-full h-full flex justify-center"
            style={{
              scale: zoom,
              transition: 'scale 0.2s ease-out'
            }}
          >
            {/* Anatomical model image */}
            <img
              src={getSystemImage()}
              alt="Human Anatomy Model"
              className="h-full object-contain max-w-full"
              style={{ maxHeight: '550px' }}
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
