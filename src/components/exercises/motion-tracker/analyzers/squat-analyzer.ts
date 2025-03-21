
import { Pose, ExerciseMetrics, FeedbackType } from '../types';
import { calculateAngle } from '../utils/angle-calculations';

// State management for squat detection
type SquatState = 'standing' | 'descending' | 'bottom' | 'ascending';

interface SquatAnalyzerState {
  currentState: SquatState;
  prevState: SquatState;
  repInProgress: boolean;
  kneeAngles: number[];
  hipAngles: number[];
  lastGoodFormMessage: number;
  formErrors: Map<string, number>;
}

// Threshold angles for squat detection
const KNEE_STANDING_THRESHOLD = 160;
const KNEE_BOTTOM_THRESHOLD = 100;
const HIP_PROPER_MIN = 70;
const HIP_PROPER_MAX = 140;

// Initialize state
let state: SquatAnalyzerState = {
  currentState: 'standing',
  prevState: 'standing',
  repInProgress: false,
  kneeAngles: [],
  hipAngles: [],
  lastGoodFormMessage: 0,
  formErrors: new Map()
};

/**
 * Reset analyzer state when switching exercises
 */
export const resetSquatAnalyzerState = () => {
  state = {
    currentState: 'standing',
    prevState: 'standing',
    repInProgress: false,
    kneeAngles: [],
    hipAngles: [],
    lastGoodFormMessage: 0,
    formErrors: new Map()
  };
};

/**
 * Analyze squat form and count reps
 */
export const squatAnalyzer = {
  analyze: (pose: Pose, currentMetrics: ExerciseMetrics) => {
    // Get relevant keypoints
    const leftHip = pose.keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = pose.keypoints.find(kp => kp.name === 'right_hip');
    const leftKnee = pose.keypoints.find(kp => kp.name === 'left_knee');
    const rightKnee = pose.keypoints.find(kp => kp.name === 'right_knee');
    const leftAnkle = pose.keypoints.find(kp => kp.name === 'left_ankle');
    const rightAnkle = pose.keypoints.find(kp => kp.name === 'right_ankle');
    const leftShoulder = pose.keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = pose.keypoints.find(kp => kp.name === 'right_shoulder');
    
    // If we're missing keypoints, return current metrics with uncertainty feedback
    if (!leftHip || !rightHip || !leftKnee || !rightKnee || 
        !leftAnkle || !rightAnkle || !leftShoulder || !rightShoulder) {
      return {
        metrics: currentMetrics,
        feedback: {
          message: "Move so your full body is visible",
          type: FeedbackType.WARNING
        }
      };
    }
    
    // Calculate knee angles (between hip, knee, and ankle)
    const leftKneeAngle = calculateAngle(
      leftHip, 
      leftKnee, 
      leftAnkle
    );
    
    const rightKneeAngle = calculateAngle(
      rightHip, 
      rightKnee, 
      rightAnkle
    );
    
    // Average both knee angles for more stable detection
    const kneeAngle = Math.round((leftKneeAngle + rightKneeAngle) / 2);
    
    // Calculate hip angles (between shoulder, hip, and knee)
    const leftHipAngle = calculateAngle(
      leftShoulder, 
      leftHip, 
      leftKnee
    );
    
    const rightHipAngle = calculateAngle(
      rightShoulder, 
      rightHip, 
      rightKnee
    );
    
    // Average both hip angles
    const hipAngle = Math.round((leftHipAngle + rightHipAngle) / 2);
    
    // Store angles for range of motion calculation
    state.kneeAngles.push(kneeAngle);
    state.hipAngles.push(hipAngle);
    
    // Determine current squat state based on knee angle
    state.prevState = state.currentState;
    
    if (kneeAngle > KNEE_STANDING_THRESHOLD) {
      state.currentState = 'standing';
    } else if (kneeAngle < KNEE_BOTTOM_THRESHOLD) {
      state.currentState = 'bottom';
    } else if (state.prevState === 'standing' || state.prevState === 'descending') {
      state.currentState = 'descending';
    } else {
      state.currentState = 'ascending';
    }
    
    // Detect rep completion
    let repCompleted = false;
    let isGoodForm = true;
    let formFeedback = null;
    
    // If a squat rep is completed (going from bottom to standing)
    if (state.prevState === 'ascending' && state.currentState === 'standing') {
      repCompleted = true;
      
      // Check form based on recorded angles during the rep
      const minKneeAngle = Math.min(...state.kneeAngles);
      const minHipAngle = Math.min(...state.hipAngles);
      const maxHipAngle = Math.max(...state.hipAngles);
      
      // Clear angles for next rep
      state.kneeAngles = [];
      state.hipAngles = [];
      
      // Check if the depth was sufficient
      if (minKneeAngle > KNEE_BOTTOM_THRESHOLD) {
        isGoodForm = false;
        formFeedback = {
          message: "Squat deeper - bend knees more",
          type: FeedbackType.WARNING
        };
        
        // Record form error
        const depthErrors = state.formErrors.get('depth') || 0;
        state.formErrors.set('depth', depthErrors + 1);
      }
      // Check if hips were in proper position
      else if (minHipAngle < HIP_PROPER_MIN) {
        isGoodForm = false;
        formFeedback = {
          message: "Keep your back more upright",
          type: FeedbackType.WARNING
        };
        
        // Record form error
        const backErrors = state.formErrors.get('back_angle') || 0;
        state.formErrors.set('back_angle', backErrors + 1);
      }
      // Good rep!
      else {
        formFeedback = {
          message: "Great squat! Keep it up!",
          type: FeedbackType.SUCCESS
        };
      }
    }
    // Provide real-time feedback during the squat
    else if (state.currentState === 'descending') {
      // Feedback on hip position (not leaning too far forward)
      if (hipAngle < HIP_PROPER_MIN) {
        formFeedback = {
          message: "Don't lean forward too much",
          type: FeedbackType.WARNING
        };
      }
      // Encourage proper depth
      else if (kneeAngle > 120 && state.kneeAngles.length > 10) {
        formFeedback = {
          message: "Keep going lower",
          type: FeedbackType.INFO
        };
      }
    }
    else if (state.currentState === 'bottom') {
      // Good feedback at bottom position
      if (hipAngle >= HIP_PROPER_MIN && hipAngle <= HIP_PROPER_MAX) {
        // Don't spam good form messages (max once per second)
        if (Date.now() - state.lastGoodFormMessage > 1000) {
          formFeedback = {
            message: "Good depth! Now push up",
            type: FeedbackType.SUCCESS
          };
          state.lastGoodFormMessage = Date.now();
        }
      }
    }
    
    // Update metrics if a rep was completed
    let updatedMetrics = { ...currentMetrics };
    
    if (repCompleted) {
      updatedMetrics.reps += 1;
      
      if (isGoodForm) {
        updatedMetrics.correctReps += 1;
      } else {
        updatedMetrics.incorrectReps += 1;
      }
      
      // Update accuracy percentage
      updatedMetrics.accuracy = Math.round((updatedMetrics.correctReps / updatedMetrics.reps) * 100);
      
      // Update range of motion data
      const minAngle = Math.min(...state.kneeAngles);
      
      if (updatedMetrics.rangeOfMotion.min === 0 || minAngle < updatedMetrics.rangeOfMotion.min) {
        updatedMetrics.rangeOfMotion.min = minAngle;
      }
      
      updatedMetrics.rangeOfMotion.average = 
        Math.round(((updatedMetrics.rangeOfMotion.average * (updatedMetrics.reps - 1)) + 
                   (KNEE_STANDING_THRESHOLD - minAngle)) / updatedMetrics.reps);
      
      // Update form errors counts
      updatedMetrics.formErrors = Object.fromEntries(state.formErrors);
    }
    
    return {
      metrics: updatedMetrics,
      feedback: formFeedback
    };
  }
};
