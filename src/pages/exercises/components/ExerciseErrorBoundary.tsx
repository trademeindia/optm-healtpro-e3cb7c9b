import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary specifically for the Exercise page components
 * Catches JS errors in child component tree and displays a fallback UI
 */
class ExerciseErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the console
    console.error('Exercise component error caught by boundary:', error);
    console.error('Component stack trace:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }
  
  private handleReset = (): void => {
    // Reset the error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render(): ReactNode {
    // If there's an error, render the fallback UI
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, render the default fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-300">Something went wrong</h2>
          <p className="text-red-600 dark:text-red-400 mb-4 text-center max-w-md">
            {this.state.error?.message || "An unexpected error occurred in the exercise component"}
          </p>
          <div className="flex gap-3">
            <Button
              onClick={this.handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="destructive"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    // If there's no error, render the children
    return this.props.children;
  }
}

export default ExerciseErrorBoundary;
