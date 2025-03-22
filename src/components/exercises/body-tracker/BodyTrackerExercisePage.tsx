
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BodyTracker from './BodyTracker';
import { JointAngle } from './types';
import { toast } from 'sonner';

const BodyTrackerExercisePage: React.FC = () => {
  const [latestAngles, setLatestAngles] = useState<JointAngle[]>([]);
  const [savedSessions, setSavedSessions] = useState<any[]>([]);
  
  const handleAnglesDetected = (angles: JointAngle[]) => {
    setLatestAngles(angles);
  };
  
  const handleSaveData = (data: any) => {
    const newSession = {
      ...data,
      id: `session-${Date.now()}`,
      date: new Date().toLocaleDateString()
    };
    
    setSavedSessions(prev => [newSession, ...prev]);
    
    toast.success('Exercise session saved', {
      description: 'Your joint angle data has been saved successfully.'
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>AI Body Angle Tracker</CardTitle>
        <CardDescription>
          Track your joint angles in real-time using AI pose detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BodyTracker 
          onAnglesDetected={handleAnglesDetected}
          onSaveData={handleSaveData}
        />
        
        {savedSessions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Saved Sessions ({savedSessions.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedSessions.slice(0, 4).map((session) => (
                <div key={session.id} className="bg-muted p-2 rounded-md text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Session {session.id.split('-')[1]}</span>
                    <span className="text-xs text-muted-foreground">{session.date}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Captured {session.angles.length} joint measurements
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BodyTrackerExercisePage;
