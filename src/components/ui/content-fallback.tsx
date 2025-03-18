
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from './card';
import { Button } from './button';

interface ContentFallbackProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  onRetry?: () => void;
  isLoading?: boolean;
}

export const ContentFallback: React.FC<ContentFallbackProps> = ({
  title = 'Content Unavailable',
  message = 'The content could not be displayed. Please try again later.',
  icon = <AlertCircle className="h-12 w-12 text-amber-500" />,
  onRetry,
  isLoading = false
}) => {
  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading content...</p>
          </>
        ) : (
          <>
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentFallback;
