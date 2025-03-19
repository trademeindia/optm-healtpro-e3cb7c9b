
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HotSpot } from './types';
import HotspotMarker from './HotspotMarker';
import { getSystemImage } from './utils';

interface MapVisualizationProps {
  activeSystem: string;
  zoom: number;
  hotspots: HotSpot[];
  activeHotspot: HotSpot | null;
  imageLoaded: boolean;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onHotspotClick: (hotspot: HotSpot) => void;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  activeSystem,
  zoom,
  hotspots,
  activeHotspot,
  imageLoaded,
  onImageLoad,
  onHotspotClick
}) => {
  return (
    <div className="relative flex justify-center overflow-hidden bg-gray-50 dark:bg-gray-700/20 rounded-lg h-[550px]">
      <motion.div
        className="relative w-full h-full flex justify-center items-center"
        style={{
          scale: zoom,
          transition: 'scale 0.3s ease-out'
        }}
      >
        {/* Anatomical model image */}
        <img
          src={getSystemImage(activeSystem)}
          alt="Human Anatomy Model"
          className="model-image max-h-full max-w-full object-contain"
          style={{ maxHeight: 'calc(100% - 20px)', width: 'auto' }}
          onLoad={onImageLoad}
        />
        
        {/* Hotspots - Only render if image is loaded */}
        {imageLoaded && (
          <AnimatePresence>
            {hotspots.map((hotspot) => (
              <HotspotMarker
                key={hotspot.id}
                hotspot={hotspot}
                isActive={activeHotspot?.id === hotspot.id}
                onClick={onHotspotClick}
              />
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default MapVisualization;
