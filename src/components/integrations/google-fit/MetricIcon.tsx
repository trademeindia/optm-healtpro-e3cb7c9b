
import React from 'react';
import { 
  Heart, 
  ActivitySquare, 
  Flame,
  Circle,
  Moon,
  Clock,
  ScanEye
} from 'lucide-react';
import { MetricIconProps } from './types';

const MetricIcon: React.FC<MetricIconProps> = ({ metricName }) => {
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

export default MetricIcon;
