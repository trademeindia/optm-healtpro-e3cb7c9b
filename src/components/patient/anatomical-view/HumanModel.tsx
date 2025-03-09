
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

  // Select the appropriate image based on active system
  const getSystemImage = () => {
    switch(activeSystem) {
      case 'muscular':
        return "/lovable-uploads/5a2de827-6408-43ae-91c8-4bfd13c1ed17.png";
      case 'skeletal':
        return "/lovable-uploads/c259fc72-51f3-49b7-863e-d018adadb9df.png";
      default:
        return "/lovable-uploads/a6f71747-46dd-486d-97a5-2e263119b969.png";
    }
  };
  
  return (
    <group>
      <Html
        transform
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        center
        sprite
        scale={[1.35, 1.35, 1.35]} // Adjusted scale to fit better
        distanceFactor={10}
      >
        <div className="flex items-center justify-center anatomy-model-container" style={{ width: '100%', height: '100%' }}>
          <img 
            src={getSystemImage()}
            alt={`Human Anatomy ${activeSystem.charAt(0).toUpperCase() + activeSystem.slice(1)} System`}
            className="h-auto w-auto object-contain model-image"
            style={{ 
              pointerEvents: 'none',
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'center'
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
