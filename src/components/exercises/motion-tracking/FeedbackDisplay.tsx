
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackType } from '../posture-monitor/types';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

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
  if (!feedback.message) return null;
  
  // Set color and icon based on feedback type
  const getFeedbackStyles = () => {
    switch (feedback.type) {
      case FeedbackType.SUCCESS:
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          textColor: 'text-green-700 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          borderColor: 'border-green-200 dark:border-green-900'
        };
      case FeedbackType.WARNING:
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          textColor: 'text-yellow-700 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
          borderColor: 'border-yellow-200 dark:border-yellow-900'
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
  
  const getAccuracyColor = () => {
    if (stats.accuracy >= 80) return 'bg-green-500';
    if (stats.accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className={`border shadow-sm ${borderColor} ${bgColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          <span>Exercise Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className={`text-base ${textColor} font-medium p-2 rounded-md bg-white/50 dark:bg-gray-900/30 shadow-sm feedback-message`}>
            {feedback.message}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Form Accuracy</span>
              <span className="font-medium">{stats.accuracy.toFixed(0)}%</span>
            </div>
            <Progress value={stats.accuracy} className="h-2" indicatorClassName={getAccuracyColor()} />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Total Reps</div>
              <div className="font-semibold text-xl stat-number">{stats.totalReps}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Good Form</div>
              <div className="font-semibold text-xl text-green-700 dark:text-green-400 stat-number">{stats.goodReps}</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Needs Work</div>
              <div className="font-semibold text-xl text-yellow-700 dark:text-yellow-400 stat-number">{stats.badReps}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
