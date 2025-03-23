
import { useState, useCallback } from 'react';
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

export const useDetectionResults = () => {
  const [result, setResult] = useState<Human.Result | null>(null);
  const [angles, setAngles] = useState<BodyAngles>({
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  });
  const [biomarkers, setBiomarkers] = useState<Record<string, any>>({});
  
  const updateDetectionResults = useCallback((
    detectionResult: Human.Result | null,
    newAngles: BodyAngles,
    newBiomarkers: Record<string, any>
  ) => {
    setResult(detectionResult);
    setAngles(newAngles);
    setBiomarkers(newBiomarkers);
  }, []);
  
  return {
    result,
    angles,
    biomarkers,
    updateDetectionResults
  };
};
