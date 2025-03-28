
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SquatState } from '@/lib/human/types';

interface SquatGuideProps {
  squatCount: number;
  goodSquats: number;
  badSquats: number;
  currentSquatState: SquatState;
  kneeAngle: number | null;
  hipAngle: number | null;
}

const SquatGuide: React.FC<SquatGuideProps> = ({
  squatCount,
  goodSquats,
  badSquats,
  currentSquatState,
  kneeAngle,
  hipAngle
}) => {
  const renderStateMessage = () => {
    switch (currentSquatState) {
      case SquatState.STANDING:
        return "Stand with feet shoulder-width apart and begin to squat down";
      case SquatState.DESCENDING:
        return "Keep descending, maintain straight back";
      case SquatState.BOTTOM:
        return "Great! Now push through heels to rise up";
      case SquatState.ASCENDING:
        return "Continue rising while maintaining form";
      default:
        return "Prepare for squat";
    }
  };
  
  return (
    <Card className="border shadow-sm bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Squat Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="text-sm font-medium">Total Squats:</div>
            <div className="text-sm">{squatCount}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm font-medium">Good Form:</div>
            <div className="text-sm text-green-600">{goodSquats}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm font-medium">Needs Improvement:</div>
            <div className="text-sm text-amber-600">{badSquats}</div>
          </div>
          
          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Current State:</h4>
            <div className="p-3 bg-primary/10 rounded-md text-sm">
              {renderStateMessage()}
            </div>
          </div>
          
          {kneeAngle !== null && (
            <div className="flex justify-between">
              <div className="text-sm font-medium">Knee Angle:</div>
              <div className="text-sm">{Math.round(kneeAngle)}°</div>
            </div>
          )}
          
          {hipAngle !== null && (
            <div className="flex justify-between">
              <div className="text-sm font-medium">Hip Angle:</div>
              <div className="text-sm">{Math.round(hipAngle)}°</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SquatGuide;
