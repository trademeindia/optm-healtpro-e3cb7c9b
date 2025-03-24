
import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { FeedbackType } from '../utils/feedbackUtils';

interface FeedbackDisplayProps {
  message: string;
  type: FeedbackType;
  className?: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, type, className }) => {
  const getIcon = () => {
    switch (type) {
      case FeedbackType.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case FeedbackType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case FeedbackType.ERROR:
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case FeedbackType.INFO:
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {getIcon()}
      <span>{message}</span>
    </div>
  );
};

export default FeedbackDisplay;
