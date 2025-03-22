
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
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800';
      case FeedbackType.WARNING: 
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
      default: 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
    }
  };
  
  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case FeedbackType.SUCCESS: return <Check className="h-4 w-4 flex-shrink-0" />;
      case FeedbackType.WARNING: return <AlertCircle className="h-4 w-4 flex-shrink-0" />;
      default: return <Info className="h-4 w-4 flex-shrink-0" />;
    }
  };

  return (
    <div className={`p-3 rounded-lg flex items-start gap-2 shadow-sm ${getFeedbackColor()}`}>
      <div className="mt-0.5">{getFeedbackIcon()}</div>
      <span className="text-sm">{feedback}</span>
    </div>
  );
};

export default FeedbackDisplay;
