
import React from 'react';
import MotionTracker from '@/components/exercises/motion-tracking';

export default function MotionAnalysisPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Motion Analysis</h1>
      <p className="text-muted-foreground">
        This exercise uses AI to track your movements and provide real-time feedback on your form.
        Position yourself in front of the camera so your full body is visible.
      </p>
      
      <MotionTracker
        exerciseId="motion-analysis"
        exerciseName="Motion Analysis"
      />
    </div>
  );
}
