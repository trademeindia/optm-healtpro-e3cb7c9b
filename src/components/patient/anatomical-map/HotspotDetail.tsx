
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HotSpot } from './types';

interface HotspotDetailProps {
  hotspot: HotSpot;
}

const HotspotDetail: React.FC<HotspotDetailProps> = ({ hotspot }) => {
  const getSeverityLabel = () => {
    if (hotspot.severity > 8) return 'Severe';
    if (hotspot.severity > 5) return 'Moderate';
    if (hotspot.severity > 3) return 'Mild';
    return 'Minimal';
  };

  const getSeverityColor = () => {
    if (hotspot.severity > 8) return 'text-red-500';
    if (hotspot.severity > 5) return 'text-orange-500';
    if (hotspot.severity > 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm md:text-base flex items-center justify-between">
            {hotspot.label}
            <span className={`text-xs font-medium ${getSeverityColor()}`}>
              {getSeverityLabel()} • {hotspot.severity}/10
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1 text-xs md:text-sm">
          <p className="text-muted-foreground mb-2">{hotspot.description}</p>
          
          {hotspot.recommendations && hotspot.recommendations.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-medium mb-1">Recommendations:</h4>
              <ul className="list-disc pl-5 text-xs space-y-1">
                {hotspot.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {hotspot.relatedSymptoms && hotspot.relatedSymptoms.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-medium mb-1">Related Symptoms:</h4>
              <div className="flex flex-wrap gap-1">
                {hotspot.relatedSymptoms.map((symptom, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px]"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HotspotDetail;
