
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

interface BiomarkersDisplayProps {
  biomarkers: Record<string, any>;
  angles: BodyAngles;
}

const BiomarkersDisplay: React.FC<BiomarkersDisplayProps> = ({ biomarkers, angles }) => {
  if (!biomarkers || Object.keys(biomarkers).length === 0) return null;
  
  // Helper function to determine the color class based on score
  const getScoreColorClass = (score: number) => {
    if (score > 85) return 'bg-green-500';
    if (score > 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Posture Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Posture Score */}
          {biomarkers.postureScore !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Posture Score</span>
                <span className="text-sm font-medium">
                  {Math.round(biomarkers.postureScore)}%
                </span>
              </div>
              <Progress 
                value={biomarkers.postureScore} 
                className="h-2" 
                indicatorClassName={getScoreColorClass(biomarkers.postureScore)} 
              />
            </div>
          )}
          
          {/* Shoulder Symmetry */}
          {biomarkers.shoulderSymmetry !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Shoulder Balance</span>
                <span className="text-sm font-medium">
                  {Math.round(biomarkers.shoulderSymmetry)}%
                </span>
              </div>
              <Progress 
                value={biomarkers.shoulderSymmetry} 
                className="h-2" 
                indicatorClassName={getScoreColorClass(biomarkers.shoulderSymmetry)} 
              />
            </div>
          )}
          
          {/* Balance Score */}
          {biomarkers.balanceScore !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Balance</span>
                <span className="text-sm font-medium">
                  {Math.round(biomarkers.balanceScore)}%
                </span>
              </div>
              <Progress 
                value={biomarkers.balanceScore} 
                className="h-2" 
                indicatorClassName={getScoreColorClass(biomarkers.balanceScore)} 
              />
            </div>
          )}
          
          {/* Angles Display */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {angles.kneeAngle !== null && (
              <div className="bg-muted p-2 rounded-md text-center">
                <div className="text-xs">Knee Angle</div>
                <div className="font-semibold">{Math.round(angles.kneeAngle)}°</div>
              </div>
            )}
            
            {angles.hipAngle !== null && (
              <div className="bg-muted p-2 rounded-md text-center">
                <div className="text-xs">Hip Angle</div>
                <div className="font-semibold">{Math.round(angles.hipAngle)}°</div>
              </div>
            )}
            
            {angles.shoulderAngle !== null && (
              <div className="bg-muted p-2 rounded-md text-center">
                <div className="text-xs">Shoulder Angle</div>
                <div className="font-semibold">{Math.round(angles.shoulderAngle)}°</div>
              </div>
            )}
            
            {angles.neckAngle !== null && (
              <div className="bg-muted p-2 rounded-md text-center">
                <div className="text-xs">Neck Angle</div>
                <div className="font-semibold">{Math.round(angles.neckAngle)}°</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkersDisplay;
