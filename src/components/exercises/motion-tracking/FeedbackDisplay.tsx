
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackType } from '@/lib/human/types';

interface FeedbackDisplayProps {
  feedback: { message: string | null; type: FeedbackType };
  stats: {
    totalReps: number;
    goodReps: number;
    badReps: number;
    accuracy: number;
    currentStreak?: number;
    bestStreak?: number;
  };
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, stats }) => {
  // Default message if no feedback
  const displayMessage = feedback.message || 'Ready for exercise. Maintain good posture.';
  
  // Set color based on feedback type
  const messageClass = 
    feedback.type === FeedbackType.WARNING ? 'text-orange-500 dark:text-orange-400' :
    feedback.type === FeedbackType.SUCCESS ? 'text-green-500 dark:text-green-400' :
    feedback.type === FeedbackType.ERROR ? 'text-red-500 dark:text-red-400' :
    'text-primary'; // Default for INFO or any other type
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Exercise Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className={`text-base font-medium ${messageClass}`}>
            {displayMessage}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm">Reps</div>
            <div className="font-semibold text-lg">{stats.totalReps}</div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm">Good</div>
            <div className="font-semibold text-lg text-green-500">{stats.goodReps}</div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm">Needs Work</div>
            <div className="font-semibold text-lg text-orange-500">{stats.badReps}</div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm">Accuracy</div>
            <div className="font-semibold text-lg">{stats.accuracy}%</div>
          </div>
          
          <div className="bg-muted p-3 rounded-md col-span-1 md:col-span-2">
            <div className="text-sm">Current Streak</div>
            <div className="font-semibold text-lg">
              {stats.currentStreak !== undefined ? stats.currentStreak : 0} reps
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md col-span-1 md:col-span-2">
            <div className="text-sm">Best Streak</div>
            <div className="font-semibold text-lg">
              {stats.bestStreak !== undefined ? stats.bestStreak : 0} reps
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
