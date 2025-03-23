
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BodyAngles } from '../posture-monitor/types';

interface BiomarkersDisplayProps {
  biomarkers: Record<string, any>;
  angles: BodyAngles;
}

const BiomarkersDisplay: React.FC<BiomarkersDisplayProps> = ({ 
  biomarkers, 
  angles 
}) => {
  // If no data, don't display
  if (!biomarkers || Object.keys(biomarkers).filter(key => biomarkers[key] !== null).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Biomechanical Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Joint Angles Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Joint Angles</h3>
            
            {angles.kneeAngle !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Knee</span>
                <div className="flex items-center">
                  <div 
                    className="h-2 w-24 bg-muted rounded-full overflow-hidden mr-2"
                    title={`${Math.round(angles.kneeAngle)}°`}
                  >
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(100, (angles.kneeAngle / 180) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(angles.kneeAngle)}°</span>
                </div>
              </div>
            )}
            
            {angles.hipAngle !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Hip</span>
                <div className="flex items-center">
                  <div 
                    className="h-2 w-24 bg-muted rounded-full overflow-hidden mr-2"
                    title={`${Math.round(angles.hipAngle)}°`}
                  >
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(100, (angles.hipAngle / 180) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(angles.hipAngle)}°</span>
                </div>
              </div>
            )}
            
            {angles.shoulderAngle !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Shoulder</span>
                <div className="flex items-center">
                  <div 
                    className="h-2 w-24 bg-muted rounded-full overflow-hidden mr-2"
                    title={`${Math.round(angles.shoulderAngle)}°`}
                  >
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(100, (angles.shoulderAngle / 180) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(angles.shoulderAngle)}°</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Biomarkers Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Performance Metrics</h3>
            
            {biomarkers.balance !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Balance</span>
                <div className="flex items-center">
                  <div 
                    className="h-2 w-24 bg-muted rounded-full overflow-hidden mr-2"
                    title={`${Math.round(biomarkers.balance * 100)}%`}
                  >
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${biomarkers.balance * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(biomarkers.balance * 100)}%</span>
                </div>
              </div>
            )}
            
            {biomarkers.symmetry !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Symmetry</span>
                <div className="flex items-center">
                  <div 
                    className="h-2 w-24 bg-muted rounded-full overflow-hidden mr-2"
                    title={`${Math.round(biomarkers.symmetry * 100)}%`}
                  >
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${biomarkers.symmetry * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(biomarkers.symmetry * 100)}%</span>
                </div>
              </div>
            )}
            
            {biomarkers.stability !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Stability</span>
                <div className="flex items-center">
                  <div 
                    className="h-2 w-24 bg-muted rounded-full overflow-hidden mr-2"
                    title={`${Math.round(biomarkers.stability * 100)}%`}
                  >
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${biomarkers.stability * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(biomarkers.stability * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkersDisplay;
