
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  message: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  buttonText,
  onButtonClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
