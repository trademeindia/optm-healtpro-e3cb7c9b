
import React, { useState, useEffect } from 'react';
import ModelImage from './ModelImage';
import LoadingSpinner from './LoadingSpinner';
import HotspotsGroup from './HotspotsGroup';
import { HumanModelProps } from './types';

const HumanModel: React.FC<HumanModelProps> = ({
  activeSystem,
  hotspots,
  onHotspotClick,
  isEditMode = false
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setModelLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!modelLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <group>
      <ModelImage activeSystem={activeSystem} />
      <HotspotsGroup 
        hotspots={hotspots} 
        onHotspotClick={onHotspotClick} 
        isEditMode={isEditMode} 
      />
    </group>
  );
};

export default HumanModel;
