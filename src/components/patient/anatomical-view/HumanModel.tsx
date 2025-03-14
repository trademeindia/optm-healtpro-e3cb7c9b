
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
    // Simulate loading time for the model
    const timer = setTimeout(() => {
      setModelLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeSystem]); // Reset loading when system changes
  
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
