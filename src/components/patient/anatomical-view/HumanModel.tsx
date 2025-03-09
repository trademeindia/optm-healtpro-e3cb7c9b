
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
        return "/lovable-uploads/65ad9288-f18e-468c-bfe6-f52ba43bc0b9.png";
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
        scale={[3, 3, 3]} // Scaled up to be more visible
        distanceFactor={10}
      >
        <div className="flex items-center justify-center" style={{ width: '300px', height: '600px' }}>
          <img 
            src={getSystemImage()}
            alt={`Human Anatomy ${activeSystem.charAt(0).toUpperCase() + activeSystem.slice(1)} System`}
            className="h-auto w-full object-contain"
            style={{ 
              pointerEvents: 'none',
              maxHeight: '600px',
              transform: 'scale(1.2)' // Slightly bigger for better visibility
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
