
import React from 'react';
import { FeedbackMessage, FeedbackType } from './types';
import { AlertCircle, Check, Info, AlertTriangle } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: FeedbackMessage;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  const getFeedbackColor = () => {
    switch (feedback.type) {
      case FeedbackType.SUCCESS:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case FeedbackType.ERROR:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case FeedbackType.WARNING:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case FeedbackType.INFO:
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };
  
  const getFeedbackIcon = () => {
    switch (feedback.type) {
      case FeedbackType.SUCCESS:
        return <Check className="h-5 w-5" />;
      case FeedbackType.ERROR:
        return <AlertCircle className="h-5 w-5" />;
      case FeedbackType.WARNING:
        return <AlertTriangle className="h-5 w-5" />;
      case FeedbackType.INFO:
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg flex items-center gap-3 ${getFeedbackColor()}`}>
      {getFeedbackIcon()}
      <span className="text-base font-medium">{feedback.message}</span>
    </div>
  );
};

export default FeedbackDisplay;
