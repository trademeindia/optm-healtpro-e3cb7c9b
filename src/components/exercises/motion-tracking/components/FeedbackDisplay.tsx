
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

  return (
    <div className={`flex items-start rounded-md feedback-display ${className}`}>
      {renderIcon()}
      <div className="flex-1">{message}</div>
    </div>
  );
};

export default FeedbackDisplay;
