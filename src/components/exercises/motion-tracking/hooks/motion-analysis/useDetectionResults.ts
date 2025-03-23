
import { useState, useCallback } from 'react';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

export const useDetectionResults = () => {
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

  const updateResults = useCallback((
    newResult: any | null,
    newAngles: BodyAngles,
    newBiomarkers: Record<string, any>
  ) => {
    setResult(newResult);
    setAngles(newAngles);
    setBiomarkers(newBiomarkers);
  }, []);

  const resetResults = useCallback(() => {
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
  }, []);

  return {
    result,
    angles,
    biomarkers,
    updateResults,
    resetResults
  };
};
