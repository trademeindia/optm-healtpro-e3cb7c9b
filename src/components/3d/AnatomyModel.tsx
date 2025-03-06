
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, ArrowRight, RotateCw, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface AnatomyModelProps {
  className?: string;
  image: string;
  hotspots: Hotspot[];
}

const AnatomyModel: React.FC<AnatomyModelProps> = ({
  className,
  image,
  hotspots,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleHotspotClick = (id: string) => {
    setActiveHotspot(id === activeHotspot ? null : id);
  };

  const rotateModel = (direction: 'left' | 'right') => {
    const amount = direction === 'left' ? -30 : 30;
    setRotation(prev => prev + amount);
  };

  return (
    <div className={cn("anatomy-model-container relative h-full", className)}>
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={image}
          alt="Anatomical model"
          className="anatomy-model max-h-[400px] object-contain"
          animate={{ 
            rotateY: rotation,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <Button 
            onClick={() => rotateModel('left')}
            variant="secondary"
            className="p-2 rounded-full glass-morphism h-10 w-10 flex items-center justify-center"
            aria-label="Rotate left"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button 
            onClick={() => rotateModel('right')}
            variant="secondary"
            className="p-2 rounded-full glass-morphism h-10 w-10 flex items-center justify-center"
            aria-label="Rotate right"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
        </div>

        {hotspots.map((hotspot) => (
          <React.Fragment key={hotspot.id}>
            <motion.div
              className={cn(
                "hotspot absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md border-2 border-white transition-all duration-300 ease-in-out z-10",
                activeHotspot === hotspot.id && "active scale-110 shadow-lg border-primary"
              )}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                backgroundColor: hotspot.color,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => handleHotspotClick(hotspot.id)}
            >
              {activeHotspot !== hotspot.id && <div className="hotspot-pulse absolute w-full h-full rounded-full bg-primary/30 animate-pulse-light" />}
              {hotspot.icon || '+'}
            </motion.div>

            <div
              className={cn(
                "annotation glass-morphism absolute p-4 rounded-lg max-w-xs z-30 opacity-0 scale-95 transition-all duration-300 ease-in-out pointer-events-none",
                activeHotspot === hotspot.id && "opacity-100 scale-100 pointer-events-auto"
              )}
              style={{
                left: `${hotspot.x > 50 ? hotspot.x - 30 : hotspot.x + 10}%`,
                top: `${hotspot.y > 50 ? hotspot.y - 20 : hotspot.y + 10}%`,
              }}
            >
              <h3 className="text-base font-semibold mb-1">{hotspot.label}</h3>
              <p className="text-sm text-foreground/80">{hotspot.description}</p>
            </div>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default AnatomyModel;
