import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSymptoms, SymptomEntry } from '@/contexts/SymptomContext';

interface AnatomicalRegion {
  id: string;
  name: string;
  // Coordinates represent the percentage position on the image
  x: number;
  y: number;
}

// Updated anatomical regions with accurate coordinates
const anatomicalRegions: Record<string, AnatomicalRegion> = {
  head: { id: 'region-head', name: 'Head', x: 50, y: 9 },
  neck: { id: 'region-neck', name: 'Neck', x: 50, y: 15 },
  rightShoulder: { id: 'region-r-shoulder', name: 'Right Shoulder', x: 41, y: 21 },
  leftShoulder: { id: 'region-l-shoulder', name: 'Left Shoulder', x: 59, y: 21 },
  chest: { id: 'region-chest', name: 'Chest', x: 50, y: 25 },
  upperBack: { id: 'region-upper-back', name: 'Upper Back', x: 50, y: 25 },
  rightElbow: { id: 'region-r-elbow', name: 'Right Elbow', x: 35, y: 35 },
  leftElbow: { id: 'region-l-elbow', name: 'Left Elbow', x: 65, y: 35 },
  abdomen: { id: 'region-abdomen', name: 'Abdomen', x: 50, y: 36 },
  lowerBack: { id: 'region-lower-back', name: 'Lower Back', x: 50, y: 37 },
  rightWrist: { id: 'region-r-wrist', name: 'Right Wrist', x: 33, y: 44 },
  leftWrist: { id: 'region-l-wrist', name: 'Left Wrist', x: 67, y: 44 },
  rightHip: { id: 'region-r-hip', name: 'Right Hip', x: 42, y: 48 },
  leftHip: { id: 'region-l-hip', name: 'Left Hip', x: 58, y: 48 },
  rightKnee: { id: 'region-r-knee', name: 'Right Knee', x: 42, y: 67 },
  leftKnee: { id: 'region-l-knee', name: 'Left Knee', x: 58, y: 67 },
  rightAnkle: { id: 'region-r-ankle', name: 'Right Ankle', x: 42, y: 84 },
  leftAnkle: { id: 'region-l-ankle', name: 'Left Ankle', x: 58, y: 84 },
  rightFoot: { id: 'region-r-foot', name: 'Right Foot', x: 43, y: 91 },
  leftFoot: { id: 'region-l-foot', name: 'Left Foot', x: 57, y: 91 },
  rightHand: { id: 'region-r-hand', name: 'Right Hand', x: 31, y: 48 },
  leftHand: { id: 'region-l-hand', name: 'Left Hand', x: 69, y: 48 },
  rightFinger: { id: 'region-r-finger', name: 'Right Finger', x: 30, y: 51 },
  leftFinger: { id: 'region-l-finger', name: 'Left Finger', x: 70, y: 51 },
};

// Function to get hotspot color based on pain level
const getPainLevelColor = (level: number) => {
  if (level <= 3) return 'rgba(34, 197, 94, 0.8)'; // Green for low pain
  if (level <= 6) return 'rgba(249, 115, 22, 0.7)'; // Orange for medium pain
  return 'rgba(234, 56, 76, 0.8)'; // Red for high pain
};

const AnatomicalMap: React.FC = () => {
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
    const newHotspots: HotSpot[] = symptoms.map(symptom => ({
      id: symptom.id,
      region: symptom.location,
      size: 20 + (symptom.painLevel * 0.8), // Size based on pain level
      color: getPainLevelColor(symptom.painLevel),
      label: symptom.symptomName,
      description: symptom.notes
    }));
    
    setHotspots(newHotspots);
  }, [symptoms]);

  // Get the position for a hotspot based on its anatomical region
  const getHotspotPosition = (region: string) => {
    if (!region) {
      console.warn('Region is undefined');
      return { x: 50, y: 50 }; // Default to center if region is undefined
    }
    
    const regionData = anatomicalRegions[region];
    if (!regionData) {
      console.warn(`Region ${region} not found in anatomical regions`);
      return { x: 50, y: 50 }; // Fallback to center if region not found
    }
    
    return { x: regionData.x, y: regionData.y };
  };

  return (
    <Card className="glass-morphism">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Anatomical Map</CardTitle>
            <CardDescription>Interactive visualization of affected areas</CardDescription>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.6}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={zoom >= 2}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
                {hotspots.map((hotspot) => {
                  const position = getHotspotPosition(hotspot.region);
                  return (
                    <TooltipProvider key={hotspot.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            className="absolute cursor-pointer rounded-full flex items-center justify-center"
                            style={{
                              left: `${position.x}%`,
                              top: `${position.y}%`,
                              width: `${hotspot.size}px`,
                              height: `${hotspot.size}px`,
                              backgroundColor: hotspot.color,
                              border: activeHotspot?.id === hotspot.id ? '2px solid white' : '2px dashed rgba(255,255,255,0.7)',
                              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                              transform: 'translate(-50%, -50%)', // Center the hotspot on its position
                              zIndex: 20 // Ensure hotspots are above the image
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => handleHotspotClick(hotspot)}
                          >
                            <Target className="h-3 w-3 text-white" />
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{hotspot.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
        
        {/* Detail panel for active hotspot */}
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-card rounded-lg border"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: activeHotspot.color }}
              ></div>
              <h4 className="font-semibold">{activeHotspot.label}</h4>
              <span className="text-xs text-muted-foreground">
                ({anatomicalRegions[activeHotspot.region]?.name})
              </span>
            </div>
            <p className="text-sm mt-1 text-muted-foreground">{activeHotspot.description}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnatomicalMap;
