
import React from 'react';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';
import { Card } from '@/components/ui/card';
import { Activity, ChevronRight, BarChart, Target, ArrowRight } from 'lucide-react';

interface BiomarkersDisplayProps {
  biomarkers: Record<string, any>;
  angles: BodyAngles;
}

const BiomarkersDisplay: React.FC<BiomarkersDisplayProps> = ({ 
  biomarkers, 
  angles 
}) => {
  // Format angle value for display
  const formatAngle = (angle: number | null) => {
    if (angle === null) return "--";
    return Math.round(angle) + "°";
  };
  
  // Determine optimal range status
  const getAngleStatus = (angle: number | null, min: number, max: number) => {
    if (angle === null) return "neutral";
    
    if (angle >= min && angle <= max) {
      return "optimal";
    } else if (angle < min) {
      return "below";
    } else {
      return "above";
    }
  };
  
  // Get class name based on status
  const getStatusClassname = (status: string) => {
    switch(status) {
      case "optimal": return "text-green-600 dark:text-green-400";
      case "below": return "text-yellow-600 dark:text-yellow-400";
      case "above": return "text-yellow-600 dark:text-yellow-400";
      default: return "text-muted-foreground";
    }
  };
  
  // Get descriptive text based on knee angle
  const getKneeRecommendation = () => {
    if (!angles.kneeAngle) return "Position yourself so your knees are visible.";
    
    const status = getAngleStatus(angles.kneeAngle, 90, 140);
    
    switch(status) {
      case "optimal": 
        return "Great knee bend! Maintain this depth for best results.";
      case "below": 
        return "Your squat is very deep. Ensure your heels stay on the ground.";
      case "above": 
        return "Try to achieve deeper knee bend for better muscle engagement.";
      default:
        return "Adjust your position to get accurate knee measurements.";
    }
  };
  
  const kneeStatus = getAngleStatus(angles.kneeAngle, 90, 140);
  const hipStatus = getAngleStatus(angles.hipAngle, 75, 120);
  const shoulderStatus = getAngleStatus(angles.shoulderAngle, 160, 180);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">Biomechanical Analysis</h3>
        </div>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Angles Display */}
        <div className="bg-muted/10 p-3 rounded-md border">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center mb-3">
            <Target className="h-4 w-4 mr-1" />
            Body Angles
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Knee Angle:</span>
              <span className={`font-medium ${getStatusClassname(kneeStatus)}`}>
                {formatAngle(angles.kneeAngle)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Hip Angle:</span>
              <span className={`font-medium ${getStatusClassname(hipStatus)}`}>
                {formatAngle(angles.hipAngle)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Shoulder Angle:</span>
              <span className={`font-medium ${getStatusClassname(shoulderStatus)}`}>
                {formatAngle(angles.shoulderAngle)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Biomarkers Display */}
        <div className="bg-muted/10 p-3 rounded-md border">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center mb-3">
            <BarChart className="h-4 w-4 mr-1" />
            Performance Metrics
          </h4>
          <div className="space-y-3">
            {Object.entries(biomarkers).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="font-medium">
                  {typeof value === 'number' ? `${Math.round(value * 100)}%` : value}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="bg-muted/10 p-3 rounded-md border">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center mb-3">
            <ChevronRight className="h-4 w-4 mr-1" />
            Real-time Analysis
          </h4>
          <p className="text-sm mb-3">
            {getKneeRecommendation()}
          </p>
          {angles.kneeAngle && (
            <div className="text-xs text-muted-foreground mt-2 pt-2 border-t flex items-center justify-between">
              <span>Optimal knee angle: 90° - 140°</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BiomarkersDisplay;
