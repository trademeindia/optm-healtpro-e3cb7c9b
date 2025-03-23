
import { useEffect } from 'react';
import { DetectionStatus, UseDetectionStatusHandlerProps } from './types';

export const useDetectionStatusHandler = ({
  status,
  onStatusChange
}: UseDetectionStatusHandlerProps) => {
  // Trigger status change callback when detection status changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);
  
  return null;
};
