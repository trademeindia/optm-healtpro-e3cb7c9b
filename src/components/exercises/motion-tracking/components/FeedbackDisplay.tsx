
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackType } from '@/lib/human/types';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface FeedbackDisplayProps {
  message: string | null;
  type: FeedbackType;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, type }) => {
  if (!message) return null;
  
  let Icon = Info;
  let bgColor = 'bg-blue-50 dark:bg-blue-900/20';
  let textColor = 'text-blue-800 dark:text-blue-200';
  let iconColor = 'text-blue-500 dark:text-blue-400';
  
  switch (type) {
    case FeedbackType.SUCCESS:
      Icon = CheckCircle;
      bgColor = 'bg-green-50 dark:bg-green-900/20';
      textColor = 'text-green-800 dark:text-green-200';
      iconColor = 'text-green-500 dark:text-green-400';
      break;
    case FeedbackType.WARNING:
      Icon = AlertTriangle;
      bgColor = 'bg-amber-50 dark:bg-amber-900/20';
      textColor = 'text-amber-800 dark:text-amber-200';
      iconColor = 'text-amber-500 dark:text-amber-400';
      break;
    case FeedbackType.ERROR:
      Icon = AlertCircle;
      bgColor = 'bg-red-50 dark:bg-red-900/20';
      textColor = 'text-red-800 dark:text-red-200';
      iconColor = 'text-red-500 dark:text-red-400';
      break;
    default:
      break;
  }
  
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardContent className="p-4">
        <div className={`p-3 rounded-lg flex items-start gap-3 ${bgColor}`}>
          <span className="mt-0.5">{Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}</span>
          <span className={`text-sm ${textColor}`}>{message}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
