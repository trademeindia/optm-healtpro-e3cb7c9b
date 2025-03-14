
import React from 'react';
import { Html } from '@react-three/drei';
import { HotspotProps } from './types';

const Hotspot: React.FC<HotspotProps> = ({ 
  position, 
  color, 
  size, 
  label, 
  description, 
  severity, 
  onClick 
}) => {
  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} />
      <Html distanceFactor={10} position={[0, size + 0.1, 0]} style={{ pointerEvents: 'none' }}>
        <div className="bg-white/80 px-2 py-1 rounded text-xs text-center whitespace-nowrap">
          {label}
        </div>
      </Html>
    </mesh>
  );
};

export default Hotspot;
