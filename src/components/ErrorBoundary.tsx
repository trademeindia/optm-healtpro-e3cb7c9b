
import React, { ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log("ErrorBoundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Check if it's a chunk loading error
    const isChunkLoadError = 
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Loading CSS chunk');
    
    if (isChunkLoadError) {
      console.warn('Detected chunk loading error, attempting to recover...');
    }
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRefresh = () => {
    console.log('Refreshing the page to recover from error');
    window.location.reload();
  }

  handleReturn = () => {
    console.log('Returning to home page');
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Extract helpful error message
      let errorMessage = "An unexpected error occurred";
      if (this.state.error) {
        if (this.state.error.message.includes('Failed to fetch dynamically imported module')) {
          errorMessage = "Failed to load required module. This might be due to network issues or a temporary problem.";
        } else {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-[60vh] bg-background flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border shadow-lg rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              {errorMessage}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                variant="default"
                onClick={this.handleRefresh}
                className="mb-2 sm:mb-0"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={this.handleReturn}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
