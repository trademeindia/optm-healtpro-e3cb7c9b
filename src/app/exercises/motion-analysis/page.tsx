
import React from 'react';
import MotionTracker from '@/components/exercises/motion-tracking';
import '@/styles/motion-tracker.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MotionAnalysisPage() {
  return (
    <div className="container mx-auto py-4 sm:py-6 px-4 max-w-7xl">
      <div className="mb-6">
        <Link href="/exercises">
          <Button variant="ghost" size="sm" className="mb-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exercises
          </Button>
        </Link>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Motion Analysis
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
            This exercise uses AI to track your movements and provide real-time feedback on your form.
            Position yourself in front of the camera and follow the instructions.
          </p>
        </div>
      </div>
      
      <MotionTracker
        exerciseId="basic-squat"
        exerciseName="Basic Squat Technique"
      />
    </div>
  );
}
