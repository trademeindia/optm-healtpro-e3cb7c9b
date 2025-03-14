
import React from 'react';
import Hotspot from './Hotspot';
import { HotspotsGroupProps } from './types';

const HotspotsGroup: React.FC<HotspotsGroupProps> = ({ 
  hotspots, 
  onHotspotClick,
  isEditMode = false
}) => {
  return (
    <group>
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
          isEditMode={isEditMode}
        />
      ))}
    </group>
  );
};

export default HotspotsGroup;
