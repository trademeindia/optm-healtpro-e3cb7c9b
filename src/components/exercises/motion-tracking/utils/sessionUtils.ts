
import { v4 as uuidv4 } from 'uuid';
import { MotionState } from '@/lib/human/types';
import type { MotionStats } from '../hooks/useSessionStats';

// Creates a new exercise session
export const createSession = async (exerciseType: string): Promise<string> => {
  // In a real application, this would make an API call to create a session
  const sessionId = uuidv4();
  
  // Store session info in localStorage for demo purposes
  localStorage.setItem(`session_${sessionId}`, JSON.stringify({
    id: sessionId,
    exerciseType,
    startTime: Date.now(),
    endTime: null,
    completed: false
  }));
  
  console.log(`Created new session: ${sessionId} for exercise: ${exerciseType}`);
  
  return sessionId;
};

// Saves detection data for the current session
export const saveDetectionData = async (
  sessionId: string,
  detectionResult: any,
  angles: any,
  biomarkers: any,
  motionState: MotionState,
  exerciseType: string,
  stats: MotionStats
): Promise<void> => {
  // In a real application, this would make an API call to save the data
  
  // For demo, we'll save minimal data to localStorage
  const timestamp = Date.now();
  const key = `detection_${sessionId}_${timestamp}`;
  
  // Extract only necessary data to avoid storage issues
  const minimalDetectionData = {
    timestamp,
    sessionId,
    exerciseType,
    motionState,
    angles,
    biomarkers,
    stats
  };
  
  localStorage.setItem(key, JSON.stringify(minimalDetectionData));
};

// Completes the current session
export const completeSession = (
  sessionId: string,
  stats: MotionStats
): void => {
  // In a real application, this would make an API call to complete the session
  
  // Get existing session
  const sessionDataString = localStorage.getItem(`session_${sessionId}`);
  if (!sessionDataString) {
    console.error(`Session ${sessionId} not found`);
    return;
  }
  
  try {
    const sessionData = JSON.parse(sessionDataString);
    
    // Update session data
    sessionData.endTime = Date.now();
    sessionData.completed = true;
    sessionData.stats = stats;
    
    // Save updated session
    localStorage.setItem(`session_${sessionId}`, JSON.stringify(sessionData));
    
    console.log(`Completed session ${sessionId} with ${stats.totalReps} total reps`);
  } catch (error) {
    console.error('Error completing session:', error);
  }
};
