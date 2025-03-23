
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
    
    // Check if it's a chunk loading error or dynamic import error
    const isLoadingError = 
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Loading CSS chunk') ||
      error.message.includes('ChunkLoadError');
    
    if (isLoadingError) {
      console.warn('Detected module loading error, attempting to recover...');
      
      // Clear the application cache if browser supports it
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
            console.log(`Cache ${cacheName} deleted`);
          });
        });
      }
    }
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRefresh = () => {
    console.log('Refreshing the page to recover from error');
    
    // Clear any potentially problematic state storage
    sessionStorage.removeItem('lastRoute');
    localStorage.removeItem('lastPath');
    
    // Hard reload the page to ensure fresh assets
    window.location.reload(true);
  }

  handleClearCache = () => {
    console.log('Clearing cache and reloading the page');
    
    // Clear application cache
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => {
          caches.delete(name).then(() => {
            console.log(`Cache ${name} deleted`);
          });
        });
      });
    }
    
    // Clear local storage and session storage items
    localStorage.clear();
    sessionStorage.clear();
    
    // Force reload from server, not from cache
    window.location.reload(true);
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
      let isChunkError = false;
      
      if (this.state.error) {
        isChunkError = this.state.error.message.includes('Failed to fetch dynamically imported module') || 
                      this.state.error.message.includes('ChunkLoadError') ||
                      this.state.error.message.includes('Loading chunk');
        
        if (isChunkError) {
          errorMessage = "Failed to load required module. This might be due to network issues or a cached version of the application.";
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
              
              {isChunkError && (
                <Button 
                  variant="secondary"
                  onClick={this.handleClearCache}
                  className="mb-2 sm:mb-0"
                >
                  Clear Cache & Reload
                </Button>
              )}
              
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
