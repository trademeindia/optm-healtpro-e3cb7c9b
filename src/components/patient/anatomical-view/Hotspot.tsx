
import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { HotspotProps } from './types';

const Hotspot: React.FC<HotspotProps> = ({ 
  position, 
  color, 
  size, 
  onClick, 
  label, 
  description,
  severity
}) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.8} 
          emissive={color} 
          emissiveIntensity={hovered ? 1 : 0.5} 
        />
      </mesh>
      
      {hovered && (
        <Html
          position={[0, size + 0.1, 0]}
          center
          style={{
            width: '160px',
            pointerEvents: 'none',
          }}
        >
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 text-sm border z-50">
            <div className="font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
            <div className={`text-xs mt-1 ${
              severity === 'high' ? 'text-red-500' : 
              severity === 'medium' ? 'text-orange-500' : 
              'text-green-500'
            }`}>
              Severity: {severity}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default Hotspot;
