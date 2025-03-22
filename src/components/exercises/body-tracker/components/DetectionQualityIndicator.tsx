
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface DetectionQualityIndicatorProps {
  quality: number; // 0-100
}

const DetectionQualityIndicator: React.FC<DetectionQualityIndicatorProps> = ({ quality }) => {
  // Determine color and text based on quality level
  const getQualityInfo = () => {
    if (quality >= 75) {
      return {
        label: 'Excellent',
        color: 'bg-green-500',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      };
    } else if (quality >= 50) {
      return {
        label: 'Good',
        color: 'bg-blue-500',
        icon: <CheckCircle className="h-4 w-4 text-blue-500" />
      };
    } else if (quality >= 25) {
      return {
        label: 'Fair',
        color: 'bg-yellow-500',
        icon: <AlertCircle className="h-4 w-4 text-yellow-500" />
      };
    } else {
      return {
        label: quality === 0 ? 'No detection' : 'Poor',
        color: 'bg-red-500',
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      };
    }
  };

  const { label, color, icon } = getQualityInfo();

  return (
    <div className="mt-2 mb-2 bg-muted p-2 rounded">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-sm font-medium">Detection Quality: {label}</span>
        </div>
        <span className="text-sm font-medium">{Math.round(quality)}%</span>
      </div>
      <Progress value={quality} className={`h-2 ${color}`} />
      
      {quality < 25 && (
        <div className="mt-1 text-xs text-muted-foreground">
          {quality === 0 ? (
            <p>No body detected. Please ensure you are visible in the camera.</p>
          ) : (
            <p>Try adjusting lighting or position to improve detection.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetectionQualityIndicator;
