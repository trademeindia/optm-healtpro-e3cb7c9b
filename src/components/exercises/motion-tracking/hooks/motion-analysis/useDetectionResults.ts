
import { useState } from 'react';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

export function useDetectionResults() {
  const [result, setResult] = useState<any>(null);
  const [angles, setAngles] = useState<BodyAngles>({
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  });
  const [biomarkers, setBiomarkers] = useState<Record<string, any>>({});

  const updateResults = (
    newResult: any, 
    newAngles: BodyAngles, 
    newBiomarkers: Record<string, any>
  ) => {
    setResult(newResult);
    setAngles(newAngles);
    setBiomarkers(newBiomarkers);
  };

  const resetResults = () => {
    setResult(null);
    setAngles({
      kneeAngle: null,
      hipAngle: null,
      shoulderAngle: null,
      elbowAngle: null,
      ankleAngle: null,
      neckAngle: null
    });
    setBiomarkers({});
  };

  return {
    result,
    angles,
    biomarkers,
    updateResults,
    resetResults
  };
}
