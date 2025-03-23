
import React, { ErrorInfo } from 'react';
import { DetectionErrorType } from '@/lib/human/types';
import DetectionErrorDisplay from './DetectionErrorDisplay';

interface MotionDetectionErrorBoundaryProps {
  children: React.ReactNode;
  onReset: () => void;
}

interface MotionDetectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class MotionDetectionErrorBoundary extends React.Component<
  MotionDetectionErrorBoundaryProps,
  MotionDetectionErrorBoundaryState
> {
  constructor(props: MotionDetectionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in Motion Detection Component:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Map the React error to our detection error types
      return (
        <DetectionErrorDisplay
          errorType={DetectionErrorType.UNKNOWN}
          errorMessage={this.state.error?.message || 'An unexpected error occurred in the motion detection component'}
          onRetry={() => {
            this.setState({ hasError: false, error: null, errorInfo: null });
            this.props.onReset();
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default MotionDetectionErrorBoundary;
