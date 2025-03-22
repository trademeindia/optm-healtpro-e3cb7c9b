
import React from 'react';
import { FeedbackType } from './types';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle 
} from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: string | null;
  feedbackType: FeedbackType;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ 
  feedback, 
  feedbackType 
}) => {
  if (!feedback) return null;

  const getBgColor = () => {
    switch (feedbackType) {
      case FeedbackType.SUCCESS:
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case FeedbackType.WARNING:
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
      case FeedbackType.ERROR:
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case FeedbackType.INFO:
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getTextColor = () => {
    switch (feedbackType) {
      case FeedbackType.SUCCESS:
        return 'text-green-700 dark:text-green-300';
      case FeedbackType.WARNING:
        return 'text-amber-700 dark:text-amber-300';
      case FeedbackType.ERROR:
        return 'text-red-700 dark:text-red-300';
      case FeedbackType.INFO:
      default:
        return 'text-blue-700 dark:text-blue-300';
    }
  };

  const getIcon = () => {
    switch (feedbackType) {
      case FeedbackType.SUCCESS:
        return <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case FeedbackType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />;
      case FeedbackType.ERROR:
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />;
      case FeedbackType.INFO:
      default:
        return <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
    }
  };

  return (
    <div className={`rounded-md border p-4 ${getBgColor()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDisplay;
