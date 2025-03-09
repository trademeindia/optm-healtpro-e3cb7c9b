
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
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/a6f71747-46dd-486d-97a5-2e263119b969.png" 
            alt="Human Anatomy Muscular System" 
            className="max-h-[500px] w-auto object-contain"
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              pointerEvents: 'none',
              opacity: activeSystem === 'muscular' ? 1 : 0.7 
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
