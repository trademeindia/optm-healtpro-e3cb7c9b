
import React from 'react';
import { motion } from 'framer-motion';
import { HotspotDetailProps } from './types';
import { anatomicalRegions } from './regions';

const HotspotDetail: React.FC<HotspotDetailProps> = ({ hotspot }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-card rounded-lg border"
    >
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: hotspot.color }}
        ></div>
        <h4 className="font-semibold">{hotspot.label}</h4>
        <span className="text-xs text-muted-foreground">
          ({anatomicalRegions[hotspot.region]?.name})
        </span>
      </div>
      <p className="text-sm mt-1 text-muted-foreground">{hotspot.description}</p>
    </motion.div>
  );
};

export default HotspotDetail;
