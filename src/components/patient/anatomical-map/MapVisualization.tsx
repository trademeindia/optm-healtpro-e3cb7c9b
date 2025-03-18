
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
          transition: 'scale 0.2s ease-out'
        }}
      >
        {/* Anatomical model image with position relative for proper hotspot positioning */}
        <div className="relative h-full max-h-full flex items-center justify-center">
          <img
            src={getSystemImage(activeSystem)}
            alt={`${activeSystem} Anatomical System`}
            className="model-image h-auto max-h-[500px] w-auto object-contain"
            style={{ 
              maxHeight: '90%',
              width: 'auto',
              zIndex: 10,
              display: 'block'
            }}
            onLoad={onImageLoad}
          />
          
          {/* Hotspots container with absolute positioning relative to the image container */}
          {imageLoaded && (
            <div className="absolute inset-0 w-full h-full pointer-events-none">
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
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MapVisualization;
