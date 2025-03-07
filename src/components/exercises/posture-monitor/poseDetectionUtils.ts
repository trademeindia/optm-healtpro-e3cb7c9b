
import * as posenet from '@tensorflow-models/posenet';
import { SquatState, FeedbackType } from './types';
import { SquatEvaluation, FeedbackResult, PoseDetectionConfig } from './poseDetectionTypes';

// Default configuration for pose detection
export const DEFAULT_POSE_CONFIG: PoseDetectionConfig = {
  minPoseConfidence: 0.2, // Lower threshold to detect poses more easily
  minPartConfidence: 0.5, // Confidence threshold for individual body parts
  inputResolution: {
    width: 640,
    height: 480
  },
  scoreThreshold: 0.6 // Threshold for considering a keypoint as valid
};

// Calculate angle between three points (in degrees)
export const calculateAngle = (a: posenet.Keypoint, b: posenet.Keypoint, c: posenet.Keypoint): number => {
  const radians = Math.atan2(c.position.y - b.position.y, c.position.x - b.position.x) -
                 Math.atan2(a.position.y - b.position.y, a.position.x - b.position.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return angle;
};

// Determine squat state based on knee angle
export const determineSquatState = (kneeAngle: number): SquatState => {
  if (kneeAngle > 160) {
    // Standing position (legs almost straight)
    return SquatState.STANDING;
  } else if (kneeAngle < 100) {
    // Bottom squat position (knees bent significantly)
    return SquatState.BOTTOM_SQUAT;
  } else {
    // Mid-squat position
    return SquatState.MID_SQUAT;
  }
};

// Generate feedback based on squat state and angles
export const generateFeedback = (
  currentSquatState: SquatState,
  kneeAngle: number | null,
  hipAngle: number | null
): FeedbackResult => {
  if (currentSquatState === SquatState.STANDING) {
    return {
      feedback: "Start your squat by bending your knees.",
      feedbackType: FeedbackType.INFO
    };
  } else if (currentSquatState === SquatState.MID_SQUAT) {
    if (hipAngle && hipAngle < 70) {
      return {
        feedback: "You're leaning too far forward.",
        feedbackType: FeedbackType.WARNING
      };
    } else if (hipAngle && hipAngle > 150) {
      return {
        feedback: "Bend forward slightly at the hips.",
        feedbackType: FeedbackType.WARNING
      };
    } else {
      return {
        feedback: "Good! Continue lowering into your squat.",
        feedbackType: FeedbackType.SUCCESS
      };
    }
  } else if (currentSquatState === SquatState.BOTTOM_SQUAT) {
    if (kneeAngle && kneeAngle < 70) {
      return {
        feedback: "Squat is too deep. Rise up slightly.",
        feedbackType: FeedbackType.WARNING
      };
    } else {
      return {
        feedback: "Great depth! Now push through your heels to rise up.",
        feedbackType: FeedbackType.SUCCESS
      };
    }
  }
  
  // Default feedback
  return {
    feedback: "Maintain good posture during your exercise.",
    feedbackType: FeedbackType.INFO
  };
};

// Evaluate rep quality based on form
export const evaluateRepQuality = (
  kneeAngle: number,
  hipAngle: number
): SquatEvaluation => {
  if (kneeAngle < 110 && hipAngle > 80 && hipAngle < 140) {
    // Good form - knees bent properly and hip angle in good range
    return {
      isGoodForm: true,
      feedback: "Great form! Keep going!",
      feedbackType: FeedbackType.SUCCESS
    };
  } else {
    // Bad form - determine specific feedback
    if (kneeAngle > 120) {
      return {
        isGoodForm: false,
        feedback: "Squat deeper! Bend your knees more.",
        feedbackType: FeedbackType.WARNING
      };
    } else if (hipAngle < 70) {
      return {
        isGoodForm: false,
        feedback: "Leaning too far forward. Keep your back straighter.",
        feedbackType: FeedbackType.WARNING
      };
    } else if (hipAngle > 150) {
      return {
        isGoodForm: false,
        feedback: "Bend forward a bit more at the hips.",
        feedbackType: FeedbackType.WARNING
      };
    } else {
      return {
        isGoodForm: false,
        feedback: "Check your form. Focus on knee and hip positioning.",
        feedbackType: FeedbackType.WARNING
      };
    }
  }
};

// Analyze squat form from pose keypoints
export const analyzeSquatForm = (pose: posenet.Pose, currentSquatState: SquatState, prevSquatState: SquatState) => {
  const keypoints = pose.keypoints;
  
  // Get necessary keypoints for squat analysis
  const leftHip = keypoints.find(kp => kp.part === 'leftHip');
  const rightHip = keypoints.find(kp => kp.part === 'rightHip');
  const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
  const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
  const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
  const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
  const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
  const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
  
  // If we don't have all the keypoints, we can't analyze the squat
  if (!leftHip || !rightHip || !leftKnee || !rightKnee || 
      !leftAnkle || !rightAnkle || !leftShoulder || !rightShoulder) {
    return {
      feedback: {
        message: "Can't detect all body parts. Please make sure your full body is visible.",
        type: FeedbackType.WARNING
      },
      kneeAngle: null,
      hipAngle: null,
      newSquatState: currentSquatState,
      repComplete: false,
      evaluation: null
    };
  }
  
  // Calculate the knee angle (between hip, knee, and ankle)
  // We'll use the average of left and right sides for better accuracy
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
  const kneeAngle = Math.round(avgKneeAngle);
  
  // Calculate the hip angle (between shoulder, hip, and knee)
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
  const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  const avgHipAngle = (leftHipAngle + rightHipAngle) / 2;
  const hipAngle = Math.round(avgHipAngle);
  
  // Determine squat state based on knee angle
  const newSquatState = determineSquatState(avgKneeAngle);
  
  // Check if a rep was completed
  const repComplete = (prevSquatState === SquatState.BOTTOM_SQUAT && newSquatState === SquatState.MID_SQUAT);
  
  // Generate feedback 
  let feedback;
  let evaluation = null;
  
  if (repComplete) {
    evaluation = evaluateRepQuality(avgKneeAngle, avgHipAngle);
    feedback = {
      message: evaluation.feedback,
      type: evaluation.feedbackType
    };
  } else {
    const feedbackResult = generateFeedback(newSquatState, kneeAngle, hipAngle);
    feedback = {
      message: feedbackResult.feedback,
      type: feedbackResult.feedbackType
    };
  }
  
  return {
    kneeAngle,
    hipAngle,
    newSquatState,
    repComplete,
    evaluation,
    feedback
  };
};
