
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { DetectionQualityIndicatorProps } from '../types';

const DetectionQualityIndicator: React.FC<DetectionQualityIndicatorProps> = ({ quality }) => {
  // Determine progress color based on quality
  const getProgressColor = () => {
    if (quality > 75) return 'bg-green-500';
    if (quality > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get appropriate icon
  const getIcon = () => {
    if (quality > 75) return <CheckCircle className="h-3 w-3 text-green-500" />;
    if (quality > 50) return <AlertCircle className="h-3 w-3 text-yellow-500" />;
    return <AlertTriangle className="h-3 w-3 text-red-500" />;
  };
  
  return (
    <div className="mt-2 mb-3">
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1">
          {getIcon()}
          <span>Detection Quality</span>
        </div>
        <span className="font-medium">{Math.round(quality)}%</span>
      </div>
      <Progress 
        value={quality} 
        max={100} 
        className="h-1.5"
        indicatorClassName={getProgressColor()}
      />
    </div>
  );
};

export default DetectionQualityIndicator;
