
import React from 'react';
import { FeedbackMessage, FeedbackType, MotionStats } from '../posture-monitor/types';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: FeedbackMessage;
  stats: MotionStats;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, stats }) => {
  const getIcon = () => {
    switch (feedback.type) {
      case FeedbackType.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case FeedbackType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case FeedbackType.ERROR:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getBorderColor = () => {
    switch (feedback.type) {
      case FeedbackType.SUCCESS:
        return "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30";
      case FeedbackType.WARNING:
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30";
      case FeedbackType.ERROR:
        return "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30";
      default:
        return "border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/30";
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Feedback Message */}
      <Card className={`col-span-1 md:col-span-2 p-4 ${getBorderColor()}`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div>
            <h3 className="font-medium text-base mb-1">Real-time Feedback</h3>
            <p className="text-sm">
              {feedback.message || "Position yourself in front of the camera to begin"}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Stats Overview */}
      <Card className="p-4">
        <h3 className="font-medium text-base mb-2">Exercise Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-muted/30 rounded">
            <div className="text-xl font-bold">{stats.totalReps}</div>
            <div className="text-xs text-muted-foreground">Total Reps</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded">
            <div className="text-xl font-bold">{stats.accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center p-2 bg-green-100 dark:bg-green-900/20 rounded">
            <div className="text-xl font-bold text-green-700 dark:text-green-400">{stats.goodReps}</div>
            <div className="text-xs text-green-800 dark:text-green-500">Good Form</div>
          </div>
          <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded">
            <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">{stats.badReps}</div>
            <div className="text-xs text-yellow-800 dark:text-yellow-500">Needs Work</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FeedbackDisplay;
