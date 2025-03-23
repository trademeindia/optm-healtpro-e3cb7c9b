
import React from 'react';
import { BodyAngles } from '../posture-monitor/types';
import { Card } from '@/components/ui/card';

interface BiomarkersDisplayProps {
  biomarkers: Record<string, any>;
  angles: BodyAngles;
}

const BiomarkersDisplay: React.FC<BiomarkersDisplayProps> = ({ 
  biomarkers, 
  angles 
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-3">Biomechanical Analysis</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Angles Display */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Body Angles</h4>
          <ul className="space-y-1">
            {angles.kneeAngle && (
              <li className="text-sm">
                Knee: <span className="font-medium">{Math.round(angles.kneeAngle)}°</span>
              </li>
            )}
            {angles.hipAngle && (
              <li className="text-sm">
                Hip: <span className="font-medium">{Math.round(angles.hipAngle)}°</span>
              </li>
            )}
            {angles.shoulderAngle && (
              <li className="text-sm">
                Shoulder: <span className="font-medium">{Math.round(angles.shoulderAngle)}°</span>
              </li>
            )}
          </ul>
        </div>
        
        {/* Biomarkers Display */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Performance Metrics</h4>
          <ul className="space-y-1">
            {Object.entries(biomarkers).map(([key, value]) => (
              <li key={key} className="text-sm capitalize">
                {key}: <span className="font-medium">
                  {typeof value === 'number' ? Math.round(value * 100) : value}
                  {typeof value === 'number' ? '%' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Recommendations */}
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Recommendations</h4>
          <p className="text-sm">
            {angles.kneeAngle && angles.kneeAngle < 140 
              ? "Maintain this depth for optimal muscle engagement."
              : "Try to achieve deeper knee bend for better results."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BiomarkersDisplay;
