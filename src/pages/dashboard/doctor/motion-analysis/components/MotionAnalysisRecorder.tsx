
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Play, Square, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveMotionRecord } from '@/utils/mock-database/motionRecords';
import { v4 as uuidv4 } from 'uuid';

interface MotionAnalysisRecorderProps {
  patientId: string;
  onSessionCreated: () => void;
}

const MotionAnalysisRecorder: React.FC<MotionAnalysisRecorderProps> = ({ 
  patientId, 
  onSessionCreated 
}) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sessionType, setSessionType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [recordedAngles, setRecordedAngles] = useState<any[]>([]);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      cameraStreamRef.current = stream;
      
      toast({
        title: "Camera Started",
        description: "You can now begin recording a motion analysis session",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };
  
  const startRecording = () => {
    if (!cameraStreamRef.current) {
      startCamera();
      return;
    }
    
    if (!sessionType) {
      toast({
        title: "Session Type Required",
        description: "Please select a type of motion analysis before recording",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Start recording video
      const mediaRecorder = new MediaRecorder(cameraStreamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      // Start recording motion data
      // In a real app, this would use pose detection to calculate joint angles
      // For demo purposes, we'll simulate recording random angle data
      const simulateMotionDetection = () => {
        setRecordedAngles(prev => [
          ...prev,
          {
            joint: ["leftKnee", "rightKnee", "leftElbow", "rightElbow"][Math.floor(Math.random() * 4)],
            angle: Math.floor(Math.random() * 180),
            timestamp: Date.now()
          }
        ]);
      };
      
      // Record sample data every second
      const motionInterval = window.setInterval(simulateMotionDetection, 1000);
      
      // Start timer
      const interval = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      setTimerInterval(interval);
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Motion analysis recording has begun",
      });
      
      // Clean up when recording stops
      mediaRecorder.onstop = () => {
        clearInterval(motionInterval);
        clearInterval(interval);
        setTimerInterval(null);
        setIsRecording(false);
      };
      
      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Unable to start recording",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: `Recorded ${recordingTime} seconds of motion data`,
      });
    }
  };
  
  const saveSession = async () => {
    if (recordedAngles.length === 0) {
      toast({
        title: "No Data Recorded",
        description: "Please record some motion data before saving",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const session = {
        id: uuidv4(),
        patientId,
        type: sessionType,
        measurementDate: new Date().toISOString(),
        duration: recordingTime,
        jointAngles: recordedAngles,
        notes: notes
      };
      
      await saveMotionRecord(session);
      
      toast({
        title: "Session Saved",
        description: "Motion analysis session has been saved successfully",
      });
      
      // Reset state
      setRecordingTime(0);
      setRecordedAngles([]);
      setNotes('');
      
      // Notify parent component
      onSessionCreated();
      
      // Stop camera
      stopCamera();
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Save Error",
        description: "There was an error saving the session",
        variant: "destructive",
      });
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Motion Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <Select value={sessionType} onValueChange={setSessionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gait Analysis">Gait Analysis</SelectItem>
              <SelectItem value="Squat Assessment">Squat Assessment</SelectItem>
              <SelectItem value="Shoulder Mobility">Shoulder Mobility</SelectItem>
              <SelectItem value="Knee Flexion">Knee Flexion</SelectItem>
              <SelectItem value="Hip Mobility">Hip Mobility</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
          
          {!cameraStreamRef.current && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80">
              <Camera className="h-10 w-10 mb-2 text-muted-foreground" />
              <Button onClick={startCamera}>
                Start Camera
              </Button>
            </div>
          )}
          
          {isRecording && (
            <div className="absolute top-2 right-2 bg-destructive text-white px-2 py-1 rounded-md flex items-center">
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-white"></span>
              {formatTime(recordingTime)}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!isRecording ? (
            <Button onClick={startRecording} disabled={isRecording}>
              <Play className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopRecording}>
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={saveSession} 
            disabled={recordedAngles.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Session
          </Button>
        </div>
        
        <div>
          <Textarea
            placeholder="Session notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        {recordedAngles.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Recorded {recordedAngles.length} measurements
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MotionAnalysisRecorder;
