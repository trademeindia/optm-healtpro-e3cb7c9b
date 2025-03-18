
import React from 'react';
import { Activity, Heart, Footprints, FlameKindling, Route, Moon, Timer } from 'lucide-react';
import { MetricIconProps } from './types';

const MetricIcon: React.FC<MetricIconProps> = ({ metricName }) => {
  switch (metricName.toLowerCase()) {
    case 'steps':
      return <Footprints className="h-4 w-4" />;
    case 'heart rate':
      return <Heart className="h-4 w-4" />;
    case 'calories':
      return <FlameKindling className="h-4 w-4" />;
    case 'distance':
      return <Route className="h-4 w-4" />;
    case 'sleep':
      return <Moon className="h-4 w-4" />;
    case 'active minutes':
      return <Timer className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export default MetricIcon;
