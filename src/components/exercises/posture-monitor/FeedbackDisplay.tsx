
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackType } from './types';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FeedbackDisplayProps {
  feedback: { message: string | null; type: FeedbackType };
  stats: {
    totalReps: number;
    goodReps: number;
    badReps: number;
    accuracy: number;
  };
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, stats }) => {
  // If no feedback or empty message, don't display
  if (!feedback.message) return null;
  
  // Set color and icon based on feedback type
  const getFeedbackStyles = () => {
    switch (feedback.type) {
      case FeedbackType.WARNING:
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          textColor: 'text-yellow-700 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
          borderColor: 'border-yellow-200 dark:border-yellow-900'
        };
      case FeedbackType.SUCCESS:
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          textColor: 'text-green-700 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          borderColor: 'border-green-200 dark:border-green-900'
        };
      case FeedbackType.ERROR:
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          textColor: 'text-red-700 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          borderColor: 'border-red-200 dark:border-red-900'
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          textColor: 'text-primary',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          borderColor: 'border-blue-200 dark:border-blue-900'
        };
    }
  };
  
  const { icon, textColor, bgColor, borderColor } = getFeedbackStyles();
  
  return (
    <Card className={`border shadow-sm visible-card ${borderColor} ${bgColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          <span>Exercise Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className={`text-base ${textColor} font-medium p-3 rounded-md bg-white/50 dark:bg-gray-900/30 shadow-sm feedback-message`}>
            {feedback.message}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Form Accuracy</span>
              <span className="font-medium high-contrast-text">{stats.accuracy.toFixed(0)}%</span>
            </div>
            <Progress 
              value={stats.accuracy} 
              className="h-2 mb-2"
              style={{ 
                "--progress-color": stats.accuracy < 30 ? '#ef4444' : 
                                 stats.accuracy < 70 ? '#f59e0b' : '#10b981'
              } as React.CSSProperties}
            />
          </div>
        
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-muted/50 p-3 rounded-md shadow-sm">
              <div className="text-sm text-muted-foreground">Reps</div>
              <div className="font-semibold text-lg">{stats.totalReps}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md shadow-sm">
              <div className="text-sm text-muted-foreground">Good</div>
              <div className="font-semibold text-lg text-green-600">{stats.goodReps}</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-md shadow-sm">
              <div className="text-sm text-muted-foreground">Needs Work</div>
              <div className="font-semibold text-lg text-yellow-600">{stats.badReps}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-md shadow-sm">
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <div className="font-semibold text-lg">{stats.accuracy.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
