
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';
import BodyTracker from './BodyTracker';
import PatientExerciseForm from './PatientExerciseForm';
import { JointAngle } from './types';

const BodyTrackerExercisePage: React.FC = () => {
  const [currentAngles, setCurrentAngles] = useState<JointAngle[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  
  const handleAnglesDetected = (angles: JointAngle[]) => {
    setCurrentAngles(angles);
  };
  
  const handleSaveData = () => {
    setFormVisible(true);
  };
  
  const handleFormSuccess = () => {
    setFormVisible(false);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>AI Joint Angle Analysis</CardTitle>
        <CardDescription>
          Tracks joint movement and measures angles in real-time using computer vision
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BodyTracker 
          onAnglesDetected={handleAnglesDetected}
          onSaveData={handleSaveData}
          isActive={true}
        />
        
        {formVisible && (
          <div className="mt-4">
            <PatientExerciseForm 
              angles={currentAngles} 
              onSuccess={handleFormSuccess}
            />
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          <p className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Your camera feed is processed locally and not stored or sent to any server.</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BodyTrackerExercisePage;
