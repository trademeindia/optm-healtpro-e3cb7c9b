
import React from 'react';
import { HotSpot } from './types';
import HotspotMarker from './HotspotMarker';

interface MapVisualizationProps {
  activeSystem: string;
  zoom: number;
  hotspots: HotSpot[];
  activeHotspot: HotSpot | null;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onHotspotClick: (hotspot: HotSpot) => void;
  imageLoaded: boolean;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  activeSystem,
  zoom,
  hotspots,
  activeHotspot,
  onImageLoad,
  onHotspotClick,
  imageLoaded
}) => {
  // Map image paths for different systems
  const systemImages = {
    muscular: '/lovable-uploads/a6f71747-46dd-486d-97a5-2e263119b969.png',
    skeletal: '/lovable-uploads/bc0cdad1-9678-4b95-ac1c-9b03f27fbb17.png',
    nervous: '/lovable-uploads/5bd27e90-bafe-4183-8e98-175ad131a999.png',
    circulatory: '/lovable-uploads/58d7c82f-c734-4735-93a0-fdd18967ec6a.png'
  };

  return (
    <div className="anatomy-map-wrapper">
      <div 
        className="relative overflow-hidden rounded-md" 
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <img
          src={systemImages[activeSystem as keyof typeof systemImages] || systemImages.muscular}
          alt={`${activeSystem} system anatomy map`}
          className="anatomy-map-image"
          onLoad={onImageLoad}
        />
        
        {imageLoaded && hotspots.map(hotspot => (
          <HotspotMarker
            key={hotspot.id}
            hotspot={hotspot}
            isActive={activeHotspot?.id === hotspot.id}
            onClick={onHotspotClick}
            size={hotspot.metadata.severity.toLowerCase() === 'high' ? 'lg' : hotspot.metadata.severity.toLowerCase() === 'medium' ? 'md' : 'sm'}
          />
        ))}
      </div>
    </div>
  );
};

export default MapVisualization;
