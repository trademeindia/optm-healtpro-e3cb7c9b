
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Maximize2, Info, AlertTriangle, Check, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  label: string;
  description: string;
  status: 'normal' | 'warning' | 'critical';
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
  const { toast } = useToast();
  
  const handleHotspotClick = (id: string, label: string, status: string) => {
    setActiveHotspot(id === activeHotspot ? null : id);
    
    // Show toast notification with issue details
    if (status !== 'normal') {
      toast({
        title: `${label} issue detected`,
        description: status === 'critical' ? 
          'Critical condition requiring immediate attention' : 
          'Minor issue detected, monitoring recommended',
        variant: status === 'critical' ? 'destructive' : 'default',
      });
    }
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

  const getHotspotIcon = (status: string) => {
    switch(status) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3 text-white" />;
      case 'warning':
        return <Activity className="h-3 w-3 text-white" />;
      case 'normal':
        return <Check className="h-3 w-3 text-white" />;
      default:
        return <Info className="h-3 w-3 text-white" />;
    }
  };

  const getPulseAnimation = (status: string) => {
    if (status === 'critical') return 'animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    if (status === 'warning') return 'animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    return '';
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
                        "absolute flex items-center justify-center cursor-pointer",
                        getPulseAnimation(hotspot.status),
                        hotspot.status === 'critical' ? "w-7 h-7" : "w-6 h-6",
                        hotspot.status !== 'normal' ? "ring-2 ring-white ring-opacity-50" : "",
                        activeHotspot === hotspot.id ? "z-10" : "z-0"
                      )}
                      style={{
                        backgroundColor: hotspot.status === 'critical' ? '#FF4D4F' : 
                                        hotspot.status === 'warning' ? '#FAAD14' : 
                                        '#52C41A',
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        borderRadius: '50%'
                      }}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        scale: activeHotspot === hotspot.id ? [1, 1.2, 1] : 1,
                        transition: {
                          scale: activeHotspot === hotspot.id ? {
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 1
                          } : {}
                        }
                      }}
                      onClick={() => handleHotspotClick(hotspot.id, hotspot.label, hotspot.status)}
                    >
                      {hotspot.icon || getHotspotIcon(hotspot.status)}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-50 max-w-[250px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "inline-block w-2 h-2 rounded-full",
                          hotspot.status === 'critical' ? "bg-red-500" : 
                          hotspot.status === 'warning' ? "bg-yellow-500" : 
                          "bg-green-500"
                        )}></span>
                        <h3 className="font-bold text-sm">{hotspot.label}</h3>
                      </div>
                      <p className="text-xs">{hotspot.description}</p>
                      {hotspot.status !== 'normal' && (
                        <p className={cn(
                          "text-xs font-medium mt-1 px-2 py-1 rounded",
                          hotspot.status === 'critical' ? "bg-red-100 text-red-800" : 
                          "bg-yellow-100 text-yellow-800"
                        )}>
                          {hotspot.status === 'critical' ? 'Critical issue' : 'Minor issue'}
                        </p>
                      )}
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
