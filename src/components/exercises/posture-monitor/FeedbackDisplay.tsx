
import React from 'react';
import { AlertCircle, Check, Info } from 'lucide-react';
import { FeedbackType } from './types';

interface FeedbackDisplayProps {
  feedback: string | null;
  feedbackType: FeedbackType;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, feedbackType }) => {
  if (!feedback) return null;

  const getFeedbackColor = () => {
    switch (feedbackType) {
      case FeedbackType.SUCCESS: 
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case FeedbackType.WARNING: 
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };
  
  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case FeedbackType.SUCCESS: return <Check className="h-4 w-4" />;
      case FeedbackType.WARNING: return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className={`p-3 rounded-lg flex items-center gap-2 ${getFeedbackColor()}`}>
      {getFeedbackIcon()}
      <span>{feedback}</span>
    </div>
  );
};

export default FeedbackDisplay;
