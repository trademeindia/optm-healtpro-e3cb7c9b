
import React from 'react';
import { motion } from 'framer-motion';
import { Hotspot } from './types';

interface HotspotDetailsProps {
  hotspot: Hotspot;
}

const HotspotDetails: React.FC<HotspotDetailsProps> = ({ hotspot }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border max-w-[300px] z-10"
    >
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: hotspot.color }}
        ></div>
        <h4 className="font-semibold">{hotspot.label}</h4>
        {hotspot.region && (
          <span className="text-xs text-muted-foreground ml-1">
            ({hotspot.region})
          </span>
        )}
      </div>
      <p className="text-sm mb-2">{hotspot.description}</p>
      <div className={`text-xs font-medium ${
        hotspot.severity === 'Severe' ? 'text-red-500' : 
        hotspot.severity === 'Moderate' ? 'text-orange-500' : 
        'text-green-500'
      }`}>
        Severity: {hotspot.severity}
      </div>
    </motion.div>
  );
};

export default HotspotDetails;
