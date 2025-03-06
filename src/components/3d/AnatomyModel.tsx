import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Maximize2, Info, AlertTriangle, Check, Activity, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import HotspotForm from './HotspotForm';

export interface Hotspot {
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
  onAddHotspot?: (hotspot: Hotspot) => void;
  onDeleteHotspot?: (id: string) => void;
  readOnly?: boolean;
}

const AnatomyModel: React.FC<AnatomyModelProps> = ({
  className,
  hotspots,
  onAddHotspot,
  onDeleteHotspot,
  readOnly = false,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [addingHotspot, setAddingHotspot] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempClickPosition, setTempClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [isHotspotFormOpen, setIsHotspotFormOpen] = useState(false);
  const { toast } = useToast();
  
  const handleHotspotClick = (id: string, label: string, status: 'normal' | 'warning' | 'critical') => {
    if (editMode) {
      if (onDeleteHotspot) {
        onDeleteHotspot(id);
        toast({
          title: "Hotspot removed",
          description: `${label} has been removed`,
        });
      }
      return;
    }
    
    setActiveHotspot(id === activeHotspot ? null : id);
    
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
  
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!addingHotspot || readOnly) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTempClickPosition({ x, y });
    setIsHotspotFormOpen(true);
  };

  const handleSaveHotspot = (hotspotData: Partial<Hotspot>) => {
    if (!onAddHotspot || !tempClickPosition) return;
    
    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}`,
      x: tempClickPosition.x,
      y: tempClickPosition.y,
      z: 0,
      color: hotspotData.color || '#52C41A',
      label: hotspotData.label || 'New Hotspot',
      description: hotspotData.description || 'No description provided',
      status: hotspotData.status || 'normal',
    };
    
    onAddHotspot(newHotspot);
    toast({
      title: "Issue added",
      description: `${newHotspot.label} has been added to the patient record`,
      variant: newHotspot.status === 'critical' ? 'destructive' : 
               newHotspot.status === 'warning' ? 'default' : 'default',
    });
    
    setAddingHotspot(false);
    setTempClickPosition(null);
  };

  const handleCloseForm = () => {
    setIsHotspotFormOpen(false);
    setTempClickPosition(null);
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

  const getHotspotIcon = (status: 'normal' | 'warning' | 'critical') => {
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

  const getPulseAnimation = (status: 'normal' | 'warning' | 'critical') => {
    if (status === 'critical') return 'animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    if (status === 'warning') return 'animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    return '';
  };

  const getTooltipSide = (x: number, y: number): "top" | "right" | "bottom" | "left" => {
    if (x < 25) return "right";
    if (x > 75) return "left";
    if (y < 30) return "bottom";
    return "top";
  };

  const getTooltipAlign = (x: number, y: number): "start" | "center" | "end" => {
    if (y < 25) return "start";
    if (y > 75) return "end";
    return "center";
  };

  const getCollisionPadding = () => {
    return {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    };
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
        <div className="absolute top-2 right-2 z-20 flex space-x-2">
          {!readOnly && (
            <>
              <Button
                onClick={() => {
                  setAddingHotspot(!addingHotspot);
                  setEditMode(false);
                }}
                variant={addingHotspot ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
                title={addingHotspot ? "Cancel adding" : "Add hotspot"}
              >
                {addingHotspot ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => {
                  setEditMode(!editMode);
                  setAddingHotspot(false);
                }}
                variant={editMode ? "destructive" : "outline"}
                size="icon"
                className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
                title={editMode ? "Exit delete mode" : "Delete hotspots"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
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
            className={cn(
              "relative w-full h-full flex items-center justify-center",
              addingHotspot && !readOnly ? "cursor-crosshair" : ""
            )}
            style={{ 
              transform: `scale(${zoom})`,
              transition: 'transform 0.3s ease'
            }}
            onClick={handleImageClick}
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
                        activeHotspot === hotspot.id ? "z-10" : "z-0",
                        editMode && !readOnly ? "hover:ring-2 hover:ring-destructive" : ""
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
                      {editMode && !readOnly ? 
                        <X className="h-3 w-3 text-white" /> : 
                        (hotspot.icon || getHotspotIcon(hotspot.status))}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side={getTooltipSide(hotspot.x, hotspot.y)} 
                    align={getTooltipAlign(hotspot.x, hotspot.y)}
                    sideOffset={20}
                    avoidCollisions={true}
                    collisionPadding={getCollisionPadding()}
                    className="p-0"
                  >
                    <div className="w-full max-w-[300px] space-y-2 p-4 overflow-visible">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "inline-block w-2 h-2 rounded-full",
                          hotspot.status === 'critical' ? "bg-red-500" : 
                          hotspot.status === 'warning' ? "bg-yellow-500" : 
                          "bg-green-500"
                        )}></span>
                        <h3 className="font-bold text-sm">{hotspot.label}</h3>
                      </div>
                      <p className="text-xs text-wrap break-words whitespace-normal">{hotspot.description}</p>
                      {hotspot.status !== 'normal' && (
                        <p className={cn(
                          "text-xs font-medium mt-1 px-2 py-1 rounded text-center",
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
            
            {addingHotspot && !readOnly && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="p-4 bg-background/70 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-center">Click anywhere on the anatomy model to add a hotspot</p>
                </div>
              </div>
            )}
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
      
      <HotspotForm 
        isOpen={isHotspotFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveHotspot}
        position={tempClickPosition}
      />
    </div>
  );
};

export default AnatomyModel;
