
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
    <div className="relative flex justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-900/30 rounded-lg h-[550px] shadow-inner">
      <motion.div
        className="relative w-full h-full flex justify-center items-center anatomy-model-wrapper"
        style={{
          scale: zoom,
          transition: 'scale 0.3s ease-out'
        }}
      >
        {/* Anatomical model image */}
        <img
          src={getSystemImage(activeSystem)}
          alt={`${activeSystem} Anatomical System`}
          className="model-image max-h-full max-w-full object-contain"
          style={{ maxHeight: 'calc(100% - 20px)', width: 'auto' }}
          onLoad={onImageLoad}
          draggable={false}
        />
        
        {/* Hotspots - Only render if image is loaded */}
        {imageLoaded && (
          <AnimatePresence mode="sync">
            {hotspots.map((hotspot, index) => (
              <HotspotMarker
                key={hotspot.id || `hotspot-${index}`}
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
