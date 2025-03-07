
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HotSpot {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  description: string;
}

// Mock data - in a real app this would come from the patient's medical records
const initialHotspots: HotSpot[] = [
  {
    id: 'spot1',
    x: 50,
    y: 30,
    size: 20,
    color: 'rgba(234, 56, 76, 0.8)',
    label: 'Neck Strain',
    description: 'Mild tension in the trapezius muscle. Recommended: heat therapy and gentle stretching.'
  },
  {
    id: 'spot2',
    x: 50,
    y: 45,
    size: 25,
    color: 'rgba(249, 115, 22, 0.7)',
    label: 'Lower Back Pain',
    description: 'Lumbar muscle inflammation. Monitoring progress with prescribed anti-inflammatory medication.'
  },
  {
    id: 'spot3',
    x: 65,
    y: 60,
    size: 18,
    color: 'rgba(139, 92, 246, 0.7)',
    label: 'Hip Joint',
    description: 'Minor inflammation in the right hip joint. Continuing physical therapy exercises.'
  },
  {
    id: 'spot4',
    x: 45,
    y: 75,
    size: 22,
    color: 'rgba(249, 115, 22, 0.7)',
    label: 'Left Knee',
    description: 'Mild patellofemoral pain syndrome. Responding well to strengthening exercises.'
  }
];

const AnatomicalMap: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<HotSpot | null>(null);
  const [hotspots] = useState<HotSpot[]>(initialHotspots);
  
  const handleZoomIn = () => {
    if (zoom < 2) setZoom(prev => prev + 0.2);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.6) setZoom(prev => prev - 0.2);
  };
  
  const handleHotspotClick = (hotspot: HotSpot) => {
    setActiveHotspot(hotspot === activeHotspot ? null : hotspot);
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
            className="relative"
            style={{
              scale: zoom,
              transition: 'scale 0.2s ease-out'
            }}
          >
            {/* Anatomical model image */}
            <img
              src="/lovable-uploads/1470fab3-8415-4671-8b34-b510f4784781.png"
              alt="Human Anatomy Model"
              className="h-[500px] object-contain"
            />
            
            {/* Hotspots */}
            {hotspots.map((hotspot) => (
              <TooltipProvider key={hotspot.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="absolute cursor-pointer rounded-full flex items-center justify-center"
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        width: `${hotspot.size}px`,
                        height: `${hotspot.size}px`,
                        backgroundColor: hotspot.color,
                        border: activeHotspot?.id === hotspot.id ? '2px solid white' : '2px dashed rgba(255,255,255,0.7)',
                        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                      }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => handleHotspotClick(hotspot)}
                    >
                      <Info className="h-3 w-3 text-white" />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{hotspot.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </motion.div>
        </div>
        
        {/* Detail panel for active hotspot */}
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-card rounded-lg border"
          >
            <h4 className="font-semibold">{activeHotspot.label}</h4>
            <p className="text-sm mt-1 text-muted-foreground">{activeHotspot.description}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnatomicalMap;
