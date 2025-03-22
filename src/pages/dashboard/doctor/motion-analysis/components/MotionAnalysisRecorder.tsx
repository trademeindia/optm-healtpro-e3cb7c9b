
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VideoCamera, StopCircle, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useMotionAnalysisDetection } from '../hooks/useMotionAnalysisDetection';
import DetectionMethodSelector from './DetectionMethodSelector';
import { JointAngle } from '@/types/motion-analysis';

interface MotionAnalysisRecorderProps {
  patientId: string;
  onSessionCreated: () => void;
}

const MotionAnalysisRecorder: React.FC<MotionAnalysisRecorderProps> = ({
  patientId,
  onSessionCreated
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  
  const {
    detectionMethod,
    switchDetectionMethod,
    isDetecting,
    isRecording,
    startRecording,
    stopRecording,
    fps
  } = useMotionAnalysisDetection(videoRef);

  const handleStartRecording = () => {
    startRecording();
    toast({
      title: "Recording Started",
      description: "Motion analysis recording has begun",
    });
  };

  const handleStopRecording = async () => {
    const result = stopRecording();
    
    toast({
      title: "Recording Completed",
      description: `Recorded ${result.jointAngles.length} joint angle measurements over ${result.duration} seconds`,
    });
    
    // In a real app, you would save this data to a database
    console.log("Recording data:", result);
    
    // Notify parent that session was created
    onSessionCreated();
  };

  // For demo purposes, let's simulate some joint angles
  const simulatedJointAngles: JointAngle[] = [
    { joint: 'leftKnee', angle: 120, timestamp: Date.now() },
    { joint: 'rightKnee', angle: 115, timestamp: Date.now() },
    { joint: 'leftElbow', angle: 95, timestamp: Date.now() },
    { joint: 'rightElbow', angle: 90, timestamp: Date.now() },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Record Motion Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {!isDetecting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                    <p>Click Start Recording to begin</p>
                  </div>
                )}
                
                {fps > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {fps} FPS
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 justify-between">
                <Button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  variant="default"
                  className="flex-1"
                >
                  <VideoCamera className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
                
                <Button
                  onClick={handleStopRecording}
                  disabled={!isRecording}
                  variant="destructive"
                  className="flex-1"
                >
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
                
                <Button
                  onClick={onSessionCreated}
                  variant="outline"
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Session
                </Button>
              </div>
              
              <Textarea
                placeholder="Add notes about this motion analysis session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <DetectionMethodSelector
            currentMethod={detectionMethod}
            onMethodChange={switchDetectionMethod}
            disabled={isRecording}
          />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-md">Recent Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              {simulatedJointAngles.length > 0 ? (
                <div className="space-y-2">
                  {simulatedJointAngles.map((angle, index) => (
                    <div key={index} className="flex justify-between text-sm border-b pb-1">
                      <span>{angle.joint}:</span>
                      <span className="font-medium">{angle.angle.toFixed(1)}°</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No measurements recorded yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MotionAnalysisRecorder;
