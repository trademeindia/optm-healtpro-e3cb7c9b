
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hand, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HotspotMarker {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  description?: string;
}

interface AnatomicalViewerProps {
  onSelectBodyPart?: (part: string) => void;
}

const AnatomicalViewer: React.FC<AnatomicalViewerProps> = ({ onSelectBodyPart }) => {
  const [activeSystem, setActiveSystem] = useState('full-body');
  const [zoom, setZoom] = useState(1);
  const [hotspots, setHotspots] = useState<HotspotMarker[]>([
    {
      id: 'shoulder',
      x: 25,
      y: 26,
      size: 40,
      color: 'rgba(234, 56, 76, 0.8)',
      label: 'Shoulder',
      description: 'Calcific tendinitis in the shoulder joint'
    },
    {
      id: 'respiratory',
      x: 50,
      y: 32,
      size: 40,
      color: 'rgba(249, 115, 22, 0.7)',
      label: 'Lungs',
      description: 'Normal respiratory function'
    },
    {
      id: 'abdomen',
      x: 50,
      y: 47,
      size: 30,
      color: 'rgba(34, 197, 94, 0.8)',
      label: 'Abdomen',
      description: 'Healthy digestive system'
    }
  ]);
  
  const handleZoomIn = () => {
    if (zoom < 1.5) setZoom(prev => prev + 0.1);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.7) setZoom(prev => prev - 0.1);
  };
  
  const handleReset = () => {
    setZoom(1);
  };
  
  const handleSystemChange = (system: string) => {
    setActiveSystem(system);
    if (onSelectBodyPart) onSelectBodyPart(system);
  };

  return (
    <Card className="h-full glass-morphism">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Anatomical Viewer</CardTitle>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={handleZoomOut}>
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
                  <Button size="icon" variant="ghost" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <Tabs value={activeSystem} onValueChange={handleSystemChange} className="w-full mt-2">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 p-1 justify-start bg-transparent">
            <TabsTrigger value="full-body" className="text-xs px-3 py-1 h-auto rounded-full bg-white">Full body</TabsTrigger>
            <TabsTrigger value="skin" className="text-xs px-3 py-1 h-auto rounded-full">Skin</TabsTrigger>
            <TabsTrigger value="muscular" className="text-xs px-3 py-1 h-auto rounded-full">Muscular</TabsTrigger>
            <TabsTrigger value="skeletal" className="text-xs px-3 py-1 h-auto rounded-full">Skeletal</TabsTrigger>
            <TabsTrigger value="organs" className="text-xs px-3 py-1 h-auto rounded-full">Organs</TabsTrigger>
            <TabsTrigger value="vascular" className="text-xs px-3 py-1 h-auto rounded-full">Vascular</TabsTrigger>
            <TabsTrigger value="nervous" className="text-xs px-3 py-1 h-auto rounded-full">Nervous</TabsTrigger>
            <TabsTrigger value="lymphatic" className="text-xs px-3 py-1 h-auto rounded-full">Lymphatic</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-2 flex-1 relative overflow-hidden">
        <div className="relative h-full flex justify-center items-center overflow-hidden rounded-md">
          <motion.div 
            style={{ scale: zoom }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <img 
              src="/lovable-uploads/e0313b5b-af3f-4c92-afe1-2a509dee3038.png" 
              alt="Anatomical Model" 
              className="max-h-[480px] object-contain"
            />
            
            {/* Hotspot markers */}
            {hotspots.map((hotspot) => (
              <TooltipProvider key={hotspot.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      className="absolute cursor-pointer rounded-full flex items-center justify-center"
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        width: `${hotspot.size}px`,
                        height: `${hotspot.size}px`,
                        backgroundColor: hotspot.color,
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid white',
                        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                      }}
                    >
                      {hotspot.id === 'shoulder' && <span className="text-white font-bold">3</span>}
                      {hotspot.id === 'respiratory' && <span className="text-white font-bold"></span>}
                      {hotspot.id === 'abdomen' && <span className="text-white font-bold">?</span>}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="p-1">
                      <div className="font-semibold">{hotspot.label}</div>
                      <div className="text-xs">{hotspot.description}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </motion.div>
          
          {/* Control buttons on the side */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
            <Button size="icon" variant="outline" className="h-10 w-10 rounded-full bg-white">
              <Hand className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="h-10 w-10 rounded-full bg-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9945 16H12.0035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            <Button size="icon" variant="outline" className="h-10 w-10 rounded-full bg-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.44 14.62L20 12.06L17.44 9.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12.06H8" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 4C4.13 4 1 7.13 1 11V17C1 20.87 4.13 24 8 24H14C17.87 24 21 20.87 21 17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnatomicalViewer;
