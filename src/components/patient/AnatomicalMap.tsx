
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnatomicalRegion {
  id: string;
  name: string;
  // Coordinates represent the percentage position on the image
  x: number;
  y: number;
}

// Refined anatomical regions with more accurate coordinates based on the specific image
const anatomicalRegions: Record<string, AnatomicalRegion> = {
  head: { id: 'region-head', name: 'Head', x: 50, y: 12 },
  neck: { id: 'region-neck', name: 'Neck', x: 50, y: 19 },
  rightShoulder: { id: 'region-r-shoulder', name: 'Right Shoulder', x: 36, y: 25 },
  leftShoulder: { id: 'region-l-shoulder', name: 'Left Shoulder', x: 64, y: 25 },
  chest: { id: 'region-chest', name: 'Chest', x: 50, y: 30 },
  upperBack: { id: 'region-upper-back', name: 'Upper Back', x: 50, y: 28 },
  rightElbow: { id: 'region-r-elbow', name: 'Right Elbow', x: 30, y: 38 },
  leftElbow: { id: 'region-l-elbow', name: 'Left Elbow', x: 70, y: 38 },
  abdomen: { id: 'region-abdomen', name: 'Abdomen', x: 50, y: 42 },
  lowerBack: { id: 'region-lower-back', name: 'Lower Back', x: 50, y: 42 },
  rightWrist: { id: 'region-r-wrist', name: 'Right Wrist', x: 25, y: 48 },
  leftWrist: { id: 'region-l-wrist', name: 'Left Wrist', x: 75, y: 48 },
  rightHip: { id: 'region-r-hip', name: 'Right Hip', x: 40, y: 53 },
  leftHip: { id: 'region-l-hip', name: 'Left Hip', x: 60, y: 53 },
  rightKnee: { id: 'region-r-knee', name: 'Right Knee', x: 42, y: 70 },
  leftKnee: { id: 'region-l-knee', name: 'Left Knee', x: 58, y: 70 },
  rightAnkle: { id: 'region-r-ankle', name: 'Right Ankle', x: 43, y: 86 },
  leftAnkle: { id: 'region-l-ankle', name: 'Left Ankle', x: 57, y: 86 },
  rightFoot: { id: 'region-r-foot', name: 'Right Foot', x: 42, y: 93 },
  leftFoot: { id: 'region-l-foot', name: 'Left Foot', x: 58, y: 93 },
};

interface HotSpot {
  id: string;
  region: string; // Corresponds to keys in anatomicalRegions
  size: number;
  color: string;
  label: string;
  description: string;
}

// Sample hotspots that accurately reference body parts
const initialHotspots: HotSpot[] = [
  {
    id: 'spot1',
    region: 'neck',
    size: 20,
    color: 'rgba(234, 56, 76, 0.8)',
    label: 'Neck Strain',
    description: 'Mild tension in the trapezius muscle. Recommended: heat therapy and gentle stretching.'
  },
  {
    id: 'spot2',
    region: 'lowerBack',
    size: 25,
    color: 'rgba(249, 115, 22, 0.7)',
    label: 'Lower Back Pain',
    description: 'Lumbar muscle inflammation. Monitoring progress with prescribed anti-inflammatory medication.'
  },
  {
    id: 'spot3',
    region: 'rightHip',
    size: 18,
    color: 'rgba(139, 92, 246, 0.7)',
    label: 'Hip Joint',
    description: 'Minor inflammation in the right hip joint. Continuing physical therapy exercises.'
  },
  {
    id: 'spot4',
    region: 'leftKnee',
    size: 22,
    color: 'rgba(249, 115, 22, 0.7)',
    label: 'Left Knee',
    description: 'Mild patellofemoral pain syndrome. Responding well to strengthening exercises.'
  }
];

const AnatomicalMap: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<HotSpot | null>(null);
  const [hotspots, setHotspots] = useState<HotSpot[]>(initialHotspots);
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
              className="h-full object-contain"
              style={{ maxHeight: '500px' }}
              onLoad={handleImageLoad}
            />
            
            {/* Hotspots - Only render if image is loaded */}
            {imageLoaded && hotspots.map((hotspot) => {
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
                          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                          transform: 'translate(-50%, -50%)', // Center the hotspot on its position
                          zIndex: 10
                        }}
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
