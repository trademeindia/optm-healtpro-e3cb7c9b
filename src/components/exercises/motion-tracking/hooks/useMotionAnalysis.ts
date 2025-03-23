
import { useState } from 'react';
import { 
  BodyAngles, 
  FeedbackMessage, 
  FeedbackType, 
  MotionState 
} from '@/lib/human/types';

export const useMotionAnalysis = () => {
  const [result, setResult] = useState<any | null>(null);
  
  const [angles, setAngles] = useState<BodyAngles>({
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  });
  
  const [biomarkers, setBiomarkers] = useState<Record<string, any>>({});
  const [currentMotionState, setCurrentMotionState] = useState(MotionState.STANDING);
  const [prevMotionState, setPrevMotionState] = useState(MotionState.STANDING);
  
  const [feedback, setFeedback] = useState<FeedbackMessage>({
    message: null,
    type: FeedbackType.INFO
  });
  
  return {
    result,
    setResult,
    angles,
    setAngles,
    biomarkers,
    setBiomarkers,
    currentMotionState,
    setCurrentMotionState,
    prevMotionState,
    setPrevMotionState,
    feedback,
    setFeedback
  };
};
