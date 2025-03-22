
import React from 'react';
import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FeedbackType } from './types';

interface FeedbackDisplayProps {
  feedback: string;
  feedbackType: FeedbackType;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, feedbackType }) => {
  // Define alert variants based on feedback type
  const alertVariants = {
    [FeedbackType.INFO]: {
      variant: 'default' as const,
      icon: <Info className="h-4 w-4" />,
      title: 'Info'
    },
    [FeedbackType.WARNING]: {
      variant: 'default' as const,
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      title: 'Attention'
    },
    [FeedbackType.SUCCESS]: {
      variant: 'default' as const,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      title: 'Success'
    },
    [FeedbackType.ERROR]: {
      variant: 'destructive' as const,
      icon: <AlertCircle className="h-4 w-4" />,
      title: 'Error'
    }
  };

  const { variant, icon, title } = alertVariants[feedbackType];

  return (
    <Alert variant={variant}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{feedback}</AlertDescription>
    </Alert>
  );
};

export default FeedbackDisplay;
