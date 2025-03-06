
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MapPin, Brain } from 'lucide-react';

interface PainLocation {
  id: string;
  x: number;
  y: number;
  painLevel: number;
  name: string;
}

interface PainLocationMapProps {
  className?: string;
}

const PainLocationMap: React.FC<PainLocationMapProps> = ({ className }) => {
  const [painLocations, setPainLocations] = useState<PainLocation[]>([
    { id: '1', x: 50, y: 20, painLevel: 7, name: 'Headache' },
    { id: '2', x: 30, y: 40, painLevel: 5, name: 'Shoulder Pain' },
    { id: '3', x: 50, y: 60, painLevel: 3, name: 'Lower Back Pain' },
  ]);
  
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // This is just for demonstration. In a real app, you'd open a dialog to name the pain point
    const newLocation: PainLocation = {
      id: Date.now().toString(),
      x,
      y,
      painLevel: 5, // Default pain level
      name: 'New Pain Point',
    };
    
    setPainLocations(prev => [...prev, newLocation]);
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'bg-medical-green/70';
    if (level <= 6) return 'bg-medical-yellow/70';
    return 'bg-medical-red/70';
  };

  const getPainLevelSize = (level: number) => {
    const baseSize = 16;
    const sizeIncrement = 2;
    return baseSize + (level * sizeIncrement);
  };

  return (
    <motion.div
      className={cn("glass-morphism rounded-2xl p-4 md:p-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg font-semibold">Pain Location Map</h3>
          <p className="text-sm text-muted-foreground">
            Click on the body to mark pain locations
          </p>
        </div>
        <Brain className="w-5 h-5 text-primary" />
      </div>
      
      <div 
        className="relative w-full h-72 bg-white/30 dark:bg-white/10 rounded-lg overflow-hidden"
        onClick={handleBodyClick}
      >
        {/* Human body silhouette - simplified for example */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg width="100px" height="220px" viewBox="0 0 100 220">
            {/* Head */}
            <circle cx="50" cy="30" r="20" fill="currentColor" />
            {/* Body */}
            <rect x="40" y="50" width="20" height="60" fill="currentColor" />
            {/* Arms */}
            <rect x="15" y="60" width="25" height="10" fill="currentColor" />
            <rect x="60" y="60" width="25" height="10" fill="currentColor" />
            {/* Legs */}
            <rect x="40" y="110" width="8" height="70" fill="currentColor" />
            <rect x="52" y="110" width="8" height="70" fill="currentColor" />
          </svg>
        </div>
        
        {/* Pain location markers */}
        {painLocations.map(location => (
          <div
            key={location.id}
            className={cn(
              "absolute rounded-full flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer",
              getPainLevelColor(location.painLevel),
              selectedLocation === location.id && "ring-2 ring-primary"
            )}
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
              width: `${getPainLevelSize(location.painLevel)}px`,
              height: `${getPainLevelSize(location.painLevel)}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLocation(location.id === selectedLocation ? null : location.id);
            }}
          >
            <MapPin className="w-3 h-3 text-white" />
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Pain Points</h4>
        <div className="flex flex-wrap gap-2">
          {painLocations.map(location => (
            <div
              key={location.id}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors",
                selectedLocation === location.id 
                  ? getPainLevelColor(location.painLevel) + " text-white"
                  : "bg-secondary"
              )}
              onClick={() => setSelectedLocation(location.id === selectedLocation ? null : location.id)}
            >
              <span>{location.name}</span>
              <span className="bg-white/30 dark:bg-black/30 px-1.5 py-0.5 rounded-full text-[10px]">
                {location.painLevel}/10
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PainLocationMap;
