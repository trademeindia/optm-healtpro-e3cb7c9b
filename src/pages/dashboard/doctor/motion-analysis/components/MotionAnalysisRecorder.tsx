
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Video, Pause, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useMotionAnalysisDetection } from '../hooks/useMotionAnalysisDetection';
import { saveMotionRecord } from '@/utils/mock-database/motionRecords';
import DetectionMethodSelector from './DetectionMethodSelector';

interface MotionAnalysisRecorderProps {
  patientId: string;
  onSessionCreated: () => void;
}

export default function MotionAnalysisRecorder({ patientId, onSessionCreated }: MotionAnalysisRecorderProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [sessionType, setSessionType] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const {
    isDetecting,
    startRecording,
    stopRecording,
    isRecording,
    joints,
    fps,
    detectionMethod,
    switchDetectionMethod
  } = useMotionAnalysisDetection(videoRef);

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleCamera = async () => {
    if (isCameraActive) {
      // Turn off camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      
      if (isRecording) {
        stopRecording();
      }
    } else {
      // Turn on camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        toast.error('Could not access camera. Please check permissions.');
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      const recordingResult = stopRecording();
      toast.success(`Recording stopped. Captured ${recordingResult.jointAngles.length} measurements.`);
    } else {
      // Start recording
      if (!sessionType) {
        toast.error('Please enter a session type before recording');
        return;
      }
      
      startRecording();
      toast.success('Recording started');
    }
  };

  const handleSaveSession = async () => {
    if (!sessionType) {
      toast.error('Please enter a session type');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const recordingResult = isRecording ? stopRecording() : { jointAngles: [], duration: 0 };
      
      // Create a new session record
      await saveMotionRecord({
        patientId,
        doctorId: 'current-doctor-id', // In a real app, get this from authentication context
        type: sessionType,
        measurementDate: new Date().toISOString(),
        duration: recordingResult.duration,
        notes,
        jointAngles: recordingResult.jointAngles,
        status: 'completed',
        targetJoints: ['rightKnee', 'leftKnee', 'rightElbow', 'leftElbow'] // Simplified for demo
      });
      
      toast.success('Session saved successfully');
      onSessionCreated();
      
      // Reset form
      setSessionType('');
      setNotes('');
    } catch (err) {
      console.error('Error saving session:', err);
      toast.error('Failed to save session. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPoseOnCanvas = () => {
    if (!canvasRef.current || !videoRef.current || Object.keys(joints).length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    
    // Draw joints
    Object.entries(joints).forEach(([part, position]) => {
      ctx.beginPath();
      ctx.arc(position[0], position[1], 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    });
    
    // Draw connections between joints (simplified example)
    if (joints.leftShoulder && joints.leftElbow) {
      ctx.beginPath();
      ctx.moveTo(joints.leftShoulder[0], joints.leftShoulder[1]);
      ctx.lineTo(joints.leftElbow[0], joints.leftElbow[1]);
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    if (joints.rightShoulder && joints.rightElbow) {
      ctx.beginPath();
      ctx.moveTo(joints.rightShoulder[0], joints.rightShoulder[1]);
      ctx.lineTo(joints.rightElbow[0], joints.rightElbow[1]);
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Request next frame
    requestAnimationFrame(renderPoseOnCanvas);
  };
  
  // Render pose on canvas whenever joints update
  useEffect(() => {
    if (isCameraActive && Object.keys(joints).length > 0) {
      renderPoseOnCanvas();
    }
  }, [joints, isCameraActive]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Motion Recording</CardTitle>
              <CardDescription>
                Record patient movement and analyze joint angles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted mb-4 rounded-md overflow-hidden flex items-center justify-center">
                {!isCameraActive ? (
                  <div className="text-center p-8">
                    <Video className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                    <p>Camera inactive. Click the button below to start.</p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {isDetecting && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        FPS: {fps}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={toggleCamera}
                  variant={isCameraActive ? "destructive" : "default"}
                >
                  {isCameraActive ? (
                    <>
                      <X className="mr-2 h-4 w-4" /> Stop Camera
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" /> Start Camera
                    </>
                  )}
                </Button>
                
                {isCameraActive && (
                  <Button
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "default"}
                    disabled={!isCameraActive}
                  >
                    {isRecording ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" /> Stop Recording
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" /> Start Recording
                      </>
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={handleSaveSession}
                  disabled={isSaving}
                  variant="outline"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-type">Session Type</Label>
                <Input
                  id="session-type"
                  placeholder="e.g., Knee Flexion, Shoulder Rotation"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add session notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <DetectionMethodSelector
            currentMethod={detectionMethod}
            onMethodChange={switchDetectionMethod}
            disabled={isRecording}
          />
        </div>
      </div>
    </div>
  );
}
