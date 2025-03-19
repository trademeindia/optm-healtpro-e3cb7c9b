
import React from 'react';
import { Circle } from 'lucide-react';
import { HotSpot } from './types';

interface HotspotMarkerProps {
  hotspot: HotSpot;
  isActive: boolean;
  onClick: (hotspot: HotSpot) => void;
  size?: 'sm' | 'md' | 'lg';
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  hotspot,
  isActive,
  onClick,
  size = 'md'
}) => {
  const sizeClass = {
    sm: 'hotspot-size-sm',
    md: 'hotspot-size-md',
    lg: 'hotspot-size-lg'
  }[size];

  const severityClass = `hotspot-severity-${hotspot.metadata.severity.toLowerCase() === 'high' 
    ? 'high' 
    : hotspot.metadata.severity.toLowerCase() === 'medium' 
      ? 'medium' 
      : 'low'}`;

  return (
    <div
      className={`hotspot-marker ${sizeClass} ${severityClass} ${isActive ? 'hotspot-active hotspot-pulse' : ''}`}
      style={{
        left: `${hotspot.position.x}%`,
        top: `${hotspot.position.y}%`
      }}
      onClick={() => onClick(hotspot)}
    >
      <Circle className="hotspot-icon" size={16} />
      {isActive && (
        <div className="hotspot-label">{hotspot.label}</div>
      )}
    </div>
  );
};

export default HotspotMarker;
