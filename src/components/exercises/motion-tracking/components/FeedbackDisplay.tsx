
import React from 'react';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { FeedbackType } from '../utils/feedbackUtils';

interface FeedbackDisplayProps {
  message: string;
  type: FeedbackType;
  className?: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, type, className }) => {
  const renderIcon = () => {
    switch (type) {
      case FeedbackType.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />;
      case FeedbackType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />;
      case FeedbackType.ERROR:
        return <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />;
      case FeedbackType.INFO:
      default:
        return <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case FeedbackType.SUCCESS:
        return 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800';
      case FeedbackType.WARNING:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800';
      case FeedbackType.ERROR:
        return 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800';
      case FeedbackType.INFO:
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800';
    }
  };

  return (
    <div className={`flex items-start p-3 rounded-md border feedback-display ${getBgColor()} ${className}`}>
      {renderIcon()}
      <div className="flex-1 text-sm">{message}</div>
    </div>
  );
};

export default FeedbackDisplay;
