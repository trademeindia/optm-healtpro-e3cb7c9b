
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackType, SquatState } from '@/lib/human/types';
import { BodyAngles } from '@/lib/human/types';

interface FeedbackDisplayProps {
  kneeAngle: number | null;
  hipAngle: number | null;
  shoulderAngle: number | null;
  squatState: SquatState;
  customFeedback: { message: string | null; type: FeedbackType } | null;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  kneeAngle,
  hipAngle,
  shoulderAngle,
  squatState,
  customFeedback
}) => {
  // Generate feedback based on angles and state
  const generateFeedback = () => {
    if (customFeedback && customFeedback.message) {
      return customFeedback;
    }
    
    // If no custom feedback, generate based on current state
    if (!kneeAngle) {
      return {
        message: "Position yourself so your full body is visible to the camera.",
        type: FeedbackType.INFO
      };
    }
    
    // Feedback based on squat state
    switch (squatState) {
      case SquatState.DESCENDING:
        return {
          message: "Good! Keep your back straight as you descend.",
          type: FeedbackType.INFO
        };
      case SquatState.BOTTOM:
        // Check depth
        if (kneeAngle < 100) {
          return {
            message: "Great depth! Hold for a moment at the bottom.",
            type: FeedbackType.SUCCESS
          };
        } else {
          return {
            message: "Try to go a bit deeper if your mobility allows.",
            type: FeedbackType.INFO
          };
        }
      case SquatState.ASCENDING:
        // Check if hips are rising too fast
        if (hipAngle && hipAngle < 140) {
          return {
            message: "Keep your chest up as you rise.",
            type: FeedbackType.WARNING
          };
        } else {
          return {
            message: "Good! Push through your heels as you rise.",
            type: FeedbackType.SUCCESS
          };
        }
      case SquatState.STANDING:
        return {
          message: "Stand tall with shoulders back and core engaged.",
          type: FeedbackType.INFO
        };
      default:
        return {
          message: "Ready to begin. Make sure your full body is visible.",
          type: FeedbackType.INFO
        };
    }
  };
  
  const feedback = generateFeedback();
  
  // Set color based on feedback type
  const messageClass = 
    feedback.type === FeedbackType.WARNING ? 'text-orange-500 dark:text-orange-400' :
    feedback.type === FeedbackType.SUCCESS ? 'text-green-500 dark:text-green-400' :
    feedback.type === FeedbackType.ERROR ? 'text-red-500 dark:text-red-400' :
    'text-primary';
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Exercise Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className={`text-base ${messageClass}`}>
            {feedback.message}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-muted p-2 rounded-md">
            <div className="text-sm">Current State</div>
            <div className="font-semibold capitalize">{squatState}</div>
          </div>
          <div className="bg-muted p-2 rounded-md">
            <div className="text-sm">Knee Angle</div>
            <div className="font-semibold">{kneeAngle ? `${Math.round(kneeAngle)}°` : 'N/A'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
