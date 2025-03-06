
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface AnatomyModelProps {
  className?: string;
  image?: string;
  modelUrl?: string;
  hotspots: Hotspot[];
}

const AnatomyModel: React.FC<AnatomyModelProps> = ({
  className,
  hotspots,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  
  const handleHotspotClick = (id: string) => {
    setActiveHotspot(id === activeHotspot ? null : id);
  };
  
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      if (direction === 'in') return Math.min(prev + 0.1, 2);
      if (direction === 'out') return Math.max(prev - 0.1, 0.5);
      return prev;
    });
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div 
      className={cn(
        "anatomy-model-container relative bg-transparent",
        fullscreen ? "fixed inset-0 z-50 bg-background/90 backdrop-blur-sm" : "h-full", 
        className
      )}
    >
      <motion.div
        className="relative w-full h-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-2 right-2 z-20">
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 relative overflow-hidden">
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{ 
              transform: `scale(${zoom})`,
              transition: 'transform 0.3s ease'
            }}
          >
            <img 
              src="/lovable-uploads/5948eb29-98e2-4f5e-84f5-215cd42d103e.png" 
              alt="Human Anatomy" 
              className="h-full object-contain"
            />
            
            {hotspots.map((hotspot) => (
              <TooltipProvider key={hotspot.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={cn(
                        "absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer",
                        activeHotspot === hotspot.id ? "z-10" : "z-0"
                      )}
                      style={{
                        backgroundColor: hotspot.color,
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        scale: activeHotspot === hotspot.id ? 1.2 : 1,
                        boxShadow: activeHotspot === hotspot.id ? '0 0 8px rgba(255,255,255,0.5)' : 'none'
                      }}
                      onClick={() => handleHotspotClick(hotspot.id)}
                    >
                      {hotspot.icon || '+'}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="max-w-[200px]">
                      <h3 className="font-bold text-sm">{hotspot.label}</h3>
                      <p className="text-xs">{hotspot.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <Button 
            onClick={() => handleZoom('in')}
            variant="secondary"
            className="p-1 md:p-2 rounded-full glass-morphism h-8 w-8 md:h-10 md:w-10 flex items-center justify-center"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button 
            onClick={() => handleZoom('out')}
            variant="secondary"
            className="p-1 md:p-2 rounded-full glass-morphism h-8 w-8 md:h-10 md:w-10 flex items-center justify-center"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnatomyModel;
