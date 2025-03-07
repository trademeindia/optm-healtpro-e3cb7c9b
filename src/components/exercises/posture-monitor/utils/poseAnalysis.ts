
import * as posenet from '@tensorflow-models/posenet';
import { SquatState, FeedbackType } from '../types';
import { generateFeedback } from './feedbackGeneration';
import { evaluateRepQuality } from './repQualityEvaluation';
import { calculateAngle } from './angleCalculations';
import { determineSquatState } from './squatStateDetection';

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
