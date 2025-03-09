
import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import Hotspot from './Hotspot';
import { HumanModelProps } from './types';

const HumanModel: React.FC<HumanModelProps> = ({ 
  activeSystem, 
  hotspots, 
  onHotspotClick 
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setModelLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!modelLoaded) {
    return (
      <Html center>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading anatomical model...</p>
        </div>
      </Html>
    );
  }
  
  return (
    <group>
      <Html
        transform
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        center
        sprite
      >
        <div className="absolute inset-0 flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
          <img 
            src={activeSystem === 'muscular' ? 
              "/lovable-uploads/629b68ae-fc38-455a-aee4-ec5b7619590f.png" : 
              "/lovable-uploads/a6f71747-46dd-486d-97a5-2e263119b969.png"}
            alt="Human Anatomy Muscular System" 
            className="max-h-[70vh] max-w-full h-auto w-auto object-contain"
            style={{ 
              pointerEvents: 'none',
              opacity: 1
            }}
          />
        </div>
      </Html>
      
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          position={hotspot.position}
          color={hotspot.color}
          size={hotspot.size}
          label={hotspot.label}
          description={hotspot.description}
          severity={hotspot.severity}
          onClick={() => onHotspotClick(hotspot.id)}
        />
      ))}
    </group>
  );
};

export default HumanModel;
