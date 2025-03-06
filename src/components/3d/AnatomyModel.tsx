
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Tooltip from '../ui/Tooltip';

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
    <div className={cn("anatomy-model-container", className)}>
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={image}
          alt="Anatomical model"
          className="anatomy-model"
          animate={{ 
            rotateY: rotation,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <button 
            onClick={() => rotateModel('left')}
            className="p-2 rounded-full glass-morphism"
          >
            ↺
          </button>
          <button 
            onClick={() => rotateModel('right')}
            className="p-2 rounded-full glass-morphism"
          >
            ↻
          </button>
        </div>

        {hotspots.map((hotspot) => (
          <React.Fragment key={hotspot.id}>
            <motion.div
              className={cn(
                "hotspot",
                activeHotspot === hotspot.id && "active"
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
              {activeHotspot !== hotspot.id && <div className="hotspot-pulse" />}
              {hotspot.icon || '+'}
            </motion.div>

            <div
              className={cn(
                "annotation",
                activeHotspot === hotspot.id && "active"
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
