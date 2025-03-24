
import React from 'react';
import { FeedbackType } from '@/lib/human/types';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface FeedbackDisplayProps {
  message: string | null;
  type: FeedbackType;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, type }) => {
  if (!message) return null;
  
  const getFeedbackIcon = () => {
    switch (type) {
      case FeedbackType.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case FeedbackType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case FeedbackType.ERROR:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case FeedbackType.INFO:
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getFeedbackClass = () => {
    switch (type) {
      case FeedbackType.SUCCESS:
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case FeedbackType.WARNING:
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
      case FeedbackType.ERROR:
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
      case FeedbackType.INFO:
      default:
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
    }
  };
  
  return (
    <Card className={`border ${getFeedbackClass()}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {getFeedbackIcon()}
          <p className="text-sm">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
