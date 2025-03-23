
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DetectionErrorType, DetectionError } from '@/lib/human/types';
import DetectionErrorDisplay from './DetectionErrorDisplay';

interface Props {
  children: ReactNode;
  onError?: (error: Error) => void;
  onRetry: () => void;
}

interface State {
  hasError: boolean;
  error: DetectionError | null;
}

class MotionDetectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: any): State {
    // Format the error for our detection error system
    const detectionError: DetectionError = {
      type: error.type || DetectionErrorType.UNKNOWN,
      message: error.message || 'An unexpected error occurred',
      retryable: true
    };
    
    return {
      hasError: true,
      error: detectionError
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Motion detection error boundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <DetectionErrorDisplay 
          error={this.state.error} 
          onRetry={this.props.onRetry} 
        />
      );
    }

    return this.props.children;
  }
}

export default MotionDetectionErrorBoundary;
