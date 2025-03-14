
import React from 'react';
import { Html } from '@react-three/drei';
import { HotspotProps } from './types';
import { AnatomicalMapping, Biomarker } from '@/types/medicalData';

// We now handle both the 3D model hotspots and the 2D anatomical map hotspots
// through interface overloading
const Hotspot = (props: HotspotProps | { mapping: AnatomicalMapping; biomarkers: Biomarker[] }) => {
  // If it's a 3D hotspot from the anatomical view
  if ('position' in props && 'color' in props) {
    const { position, color, size, label, onClick } = props;
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
  } 
  // If it's a 2D hotspot from the anatomical map
  else if ('mapping' in props) {
    const { mapping, biomarkers } = props;
    const severity = mapping.severity;
    const severityColor = 
      severity >= 8 ? 'bg-red-500' : 
      severity >= 5 ? 'bg-orange-500' : 
      'bg-yellow-500';

    return (
      <div 
        className={`absolute w-5 h-5 rounded-full ${severityColor} flex items-center justify-center cursor-pointer`}
        style={{ 
          left: `${mapping.coordinates.x}%`, 
          top: `${mapping.coordinates.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        title={mapping.bodyPart}
      >
        <span className="text-white text-xs font-bold">
          {mapping.affectedBiomarkers.length}
        </span>
      </div>
    );
  }
  
  // Default return in case neither condition is met
  return null;
};

export default Hotspot;
