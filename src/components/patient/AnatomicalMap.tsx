
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
import { useSymptomContext } from '@/contexts/SymptomContext';

interface AnatomicalRegion {
  id: string;
  name: string;
  // Coordinates represent the percentage position on the image
  x: number;
  y: number;
}

// Updated anatomical regions with more accurate coordinates for the anatomical model image
const anatomicalRegions: Record<string, AnatomicalRegion> = {
  head: { id: 'region-head', name: 'Head', x: 50, y: 8 },
  temples: { id: 'region-temples', name: 'Temples and forehead', x: 50, y: 7 },
  neck: { id: 'region-neck', name: 'Neck', x: 50, y: 15 },
  rightShoulder: { id: 'region-r-shoulder', name: 'Right Shoulder', x: 31, y: 22 },
  leftShoulder: { id: 'region-l-shoulder', name: 'Left Shoulder', x: 69, y: 22 },
  chest: { id: 'region-chest', name: 'Chest', x: 50, y: 26 },
  upperBack: { id: 'region-upper-back', name: 'Upper Back', x: 50, y: 26 },
  rightElbow: { id: 'region-r-elbow', name: 'Right Elbow', x: 25, y: 35 },
  leftElbow: { id: 'region-l-elbow', name: 'Left Elbow', x: 75, y: 35 },
  abdomen: { id: 'region-abdomen', name: 'Abdomen', x: 50, y: 38 },
  lowerBack: { id: 'region-lower-back', name: 'Lower back', x: 50, y: 42 },
  rightWrist: { id: 'region-r-wrist', name: 'Right Wrist', x: 22, y: 45 },
  leftWrist: { id: 'region-l-wrist', name: 'Left Wrist', x: 78, y: 45 },
  rightHip: { id: 'region-r-hip', name: 'Right Hip', x: 42, y: 50 },
  leftHip: { id: 'region-l-hip', name: 'Left Hip', x: 58, y: 50 },
  groin: { id: 'region-groin', name: 'Groin', x: 50, y: 53 },
  rightKnee: { id: 'region-r-knee', name: 'Right Knee', x: 42, y: 67 },
  leftKnee: { id: 'region-l-knee', name: 'Left Knee', x: 58, y: 67 },
  rightAnkle: { id: 'region-r-ankle', name: 'Right Ankle', x: 42, y: 84 },
  leftAnkle: { id: 'region-l-ankle', name: 'Left Ankle', x: 58, y: 84 },
  rightFoot: { id: 'region-r-foot', name: 'Right Foot', x: 42, y: 92 },
  leftFoot: { id: 'region-l-foot', name: 'Left Foot', x: 58, y: 92 },
};

// Helper function to map common symptom locations to anatomical regions
const mapLocationToRegion = (location: string): string => {
  const locationMap: Record<string, string> = {
    // Head regions
    'head': 'head',
    'forehead': 'temples',
    'temples': 'temples',
    'temple': 'temples',
    'headache': 'head',
    'migraine': 'head',
    
    // Torso regions
    'neck': 'neck',
    'throat': 'neck',
    'chest': 'chest',
    'upper back': 'upperBack',
    'back': 'lowerBack',
    'lower back': 'lowerBack',
    'abdomen': 'abdomen',
    'stomach': 'abdomen',
    
    // Arms and shoulders
    'right shoulder': 'rightShoulder',
    'left shoulder': 'leftShoulder',
    'shoulder': 'rightShoulder', // Default to right if not specified
    'right elbow': 'rightElbow',
    'left elbow': 'leftElbow',
    'elbow': 'rightElbow', // Default to right if not specified
    'right wrist': 'rightWrist',
    'left wrist': 'leftWrist',
    'wrist': 'rightWrist', // Default to right if not specified
    
    // Hips and legs
    'right hip': 'rightHip',
    'left hip': 'leftHip',
    'hip': 'rightHip', // Default to right if not specified
    'hip joint': 'rightHip',
    'groin': 'groin',
    'right knee': 'rightKnee',
    'left knee': 'leftKnee',
    'knee': 'rightKnee', // Default to right if not specified
    'right ankle': 'rightAnkle',
    'left ankle': 'leftAnkle',
    'ankle': 'rightAnkle', // Default to right if not specified
    'right foot': 'rightFoot',
    'left foot': 'leftFoot',
    'foot': 'rightFoot', // Default to right if not specified
  };
  
  // Convert input to lowercase for case-insensitive matching
  const lowercaseLocation = location.toLowerCase();
  
  // Check for exact matches first
  if (locationMap[lowercaseLocation]) {
    return locationMap[lowercaseLocation];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(locationMap)) {
    if (lowercaseLocation.includes(key)) {
      return value;
    }
  }
  
  // Default to abdomen if no match found
  console.warn(`No anatomical region match found for: ${location}`);
  return 'abdomen';
};

interface HotSpot {
  id: string;
  region: string; // Corresponds to keys in anatomicalRegions
  size: number;
  color: string;
  label: string;
  description: string;
}

const AnatomicalMap: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<HotSpot | null>(null);
  const [hotspots, setHotspots] = useState<HotSpot[]>([]);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const { symptoms } = useSymptomContext();
  
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

  // Convert symptoms from the SymptomContext to hotspots
  useEffect(() => {
    if (symptoms && symptoms.length > 0) {
      const mappedHotspots = symptoms.map(symptom => {
        const region = mapLocationToRegion(symptom.location);
        const painLevel = symptom.painLevel || 5;
        
        // Determine color based on pain level
        let color = 'rgba(14, 165, 233, 0.7)'; // Default blue
        if (painLevel <= 3) {
          color = 'rgba(22, 163, 74, 0.7)'; // Green for low pain
        } else if (painLevel <= 6) {
          color = 'rgba(249, 115, 22, 0.7)'; // Orange for medium pain
        } else {
          color = 'rgba(234, 56, 76, 0.8)'; // Red for high pain
        }
        
        return {
          id: symptom.id,
          region,
          size: 18 + (painLevel / 10) * 7, // Size varies with pain level
          color,
          label: symptom.symptomName,
          description: symptom.notes || `${symptom.symptomName} in ${symptom.location}`
        };
      });
      
      setHotspots(mappedHotspots);
    } else {
      setHotspots([]);
    }
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
              src="/lovable-uploads/f8fa3f1a-6170-4647-a504-6de89f8cbea4.png"
              alt="Human Anatomy Model"
              className="h-full object-contain max-w-full"
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
                          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                          transform: 'translate(-50%, -50%)', // Center the hotspot on its position
                          zIndex: 20 // Ensure hotspots are above the image
                        }}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleHotspotClick(hotspot)}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
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
