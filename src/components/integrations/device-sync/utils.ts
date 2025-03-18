
import { Heart, ActivitySquare, Circle, Flame, ScanEye, Moon, Clock } from 'lucide-react';
import React from 'react';

export const getMetricIcon = (metricName: string) => {
  switch (metricName.toLowerCase()) {
    case 'heart rate':
      return <Heart className="w-4 h-4 md:w-5 md:h-5" />;
    case 'steps':
      return <ActivitySquare className="w-4 h-4 md:w-5 md:h-5" />;
    case 'calories':
      return <Flame className="w-4 h-4 md:w-5 md:h-5" />;
    case 'distance':
      return <Circle className="w-4 h-4 md:w-5 md:h-5" />;
    case 'sleep':
      return <Moon className="w-4 h-4 md:w-5 md:h-5" />;
    case 'active minutes':
      return <Clock className="w-4 h-4 md:w-5 md:h-5" />;
    default:
      return <ScanEye className="w-4 h-4 md:w-5 md:h-5" />;
  }
};
