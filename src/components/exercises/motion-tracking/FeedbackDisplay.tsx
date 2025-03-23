
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackType } from '@/lib/human/types';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

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
  
  // Get appropriate icon and color for feedback type
  const getFeedbackDisplay = () => {
    switch (feedback.type) {
      case FeedbackType.WARNING:
        return { 
          icon: <AlertCircle className="h-5 w-5" />,
          colorClass: 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50'
        };
      case FeedbackType.SUCCESS:
        return { 
          icon: <CheckCircle className="h-5 w-5" />,
          colorClass: 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-950/50'
        };
      case FeedbackType.ERROR:
        return { 
          icon: <AlertCircle className="h-5 w-5" />,
          colorClass: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50'
        };
      default:
        return { 
          icon: <Info className="h-5 w-5" />,
          colorClass: 'text-primary bg-primary/5'
        };
    }
  };
  
  const { icon, colorClass } = getFeedbackDisplay();
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Exercise Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className={`p-3 rounded-lg flex items-start gap-3 ${colorClass}`}>
            <span className="mt-0.5">{icon}</span>
            <span className="text-base font-medium">{displayMessage}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Reps</div>
            <div className="font-semibold text-lg">{stats.totalReps}</div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Good</div>
            <div className="font-semibold text-lg text-green-500">{stats.goodReps}</div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Needs Work</div>
            <div className="font-semibold text-lg text-orange-500">{stats.badReps}</div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="font-semibold text-lg">{stats.accuracy}%</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-3 text-center">
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className="font-semibold text-lg">
              {stats.currentStreak !== undefined ? stats.currentStreak : 0} reps
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Best Streak</div>
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
