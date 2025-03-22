
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Video, Play, Pause, Square, Save, Camera, AlertTriangle } from 'lucide-react';
import { useHumanDetection } from '../hooks/useHumanDetection';
import MotionAnalysisAngleView from './MotionAnalysisAngleView';
import { JointAngle } from '@/types/motion-analysis';
import { useToast } from '@/components/ui/use-toast';

interface MotionAnalysisRecorderProps {
  patientId: string;
  onSessionCreated?: () => void;
}

export default function MotionAnalysisRecorder({ patientId, onSessionCreated }: MotionAnalysisRecorderProps) {
  const [activeTab, setActiveTab] = useState('setup');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedJointAngles, setRecordedJointAngles] = useState<JointAngle[]>([]);
  const [sessionType, setSessionType] = useState('Squat');
  const [customType, setCustomType] = useState('');
  const [notes, setNotes] = useState('');
  const [targetJoints, setTargetJoints] = useState<string[]>(['knee', 'hip']);
  const [completed, setCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const { toast } = useToast();
  
  const {
    isDetecting,
    startDetection,
    stopDetection,
    joints,
    jointAngles,
    fps,
  } = useHumanDetection(videoRef);
  
  // Access webcam
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        toast({
          title: "Camera Access Error",
          description: "Unable to access your camera. Please check permissions.",
          variant: "destructive"
        });
      }
    }
    
    setupCamera();
    
    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);
  
  // Start/stop recording
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      stopDetection();
      setActiveTab('review');
    } else {
      // Start recording
      setIsRecording(true);
      setRecordedJointAngles([]);
      setRecordingTime(0);
      startTimeRef.current = Date.now();
      
      startDetection();
      
      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);
        
        // Add the current joint angles to our recorded data
        if (jointAngles.length > 0) {
          setRecordedJointAngles(prev => [...prev, ...jointAngles]);
        }
      }, 1000);
    }
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const handleSaveSession = async () => {
    const finalType = sessionType === 'Custom' ? customType : sessionType;
    
    try {
      // In a real app, this would save to your backend
      const sessionData = {
        type: finalType,
        status: 'completed',
        patientId: patientId,
        doctorId: 'mock-doctor-id', // This would come from your auth context
        notes: notes,
        jointAngles: recordedJointAngles,
        measurementDate: new Date().toISOString(),
        targetJoints: targetJoints,
        duration: recordingTime,
      };
      
      // Simulating API call
      console.log('Saving session data:', sessionData);
      
      // Simulate success
      setTimeout(() => {
        setCompleted(true);
        toast({
          description: "Motion analysis session saved successfully!",
        });
        
        if (onSessionCreated) {
          onSessionCreated();
        }
      }, 1000);
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error Saving Session",
        description: "There was a problem saving your session. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Motion Analysis</CardTitle>
        <CardDescription>Analyze patient movements in real-time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="setup" disabled={isRecording}>Setup</TabsTrigger>
            <TabsTrigger value="record" disabled={isRecording && activeTab !== 'record'}>Record</TabsTrigger>
            <TabsTrigger value="review" disabled={recordedJointAngles.length === 0}>Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Setup your recording session</AlertTitle>
                <AlertDescription>
                  Configure the parameters for this motion analysis session.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="session-type">Session Type</Label>
                  <Select 
                    value={sessionType} 
                    onValueChange={setSessionType}
                  >
                    <SelectTrigger id="session-type">
                      <SelectValue placeholder="Select type of motion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Squat">Squat</SelectItem>
                      <SelectItem value="Lunge">Lunge</SelectItem>
                      <SelectItem value="Arm Raise">Arm Raise</SelectItem>
                      <SelectItem value="Knee Bend">Knee Bend</SelectItem>
                      <SelectItem value="Walking">Walking</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {sessionType === 'Custom' && (
                  <div>
                    <Label htmlFor="custom-type">Custom Type Name</Label>
                    <Input 
                      id="custom-type" 
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      placeholder="Enter custom movement type"
                    />
                  </div>
                )}
                
                <div>
                  <Label className="mb-2 block">Target Joints</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="joint-knee" 
                        checked={targetJoints.includes('knee')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetJoints(prev => [...prev, 'knee']);
                          } else {
                            setTargetJoints(prev => prev.filter(j => j !== 'knee'));
                          }
                        }}
                      />
                      <Label htmlFor="joint-knee">Knee</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="joint-hip" 
                        checked={targetJoints.includes('hip')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetJoints(prev => [...prev, 'hip']);
                          } else {
                            setTargetJoints(prev => prev.filter(j => j !== 'hip'));
                          }
                        }}
                      />
                      <Label htmlFor="joint-hip">Hip</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="joint-ankle" 
                        checked={targetJoints.includes('ankle')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetJoints(prev => [...prev, 'ankle']);
                          } else {
                            setTargetJoints(prev => prev.filter(j => j !== 'ankle'));
                          }
                        }}
                      />
                      <Label htmlFor="joint-ankle">Ankle</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="joint-shoulder" 
                        checked={targetJoints.includes('shoulder')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetJoints(prev => [...prev, 'shoulder']);
                          } else {
                            setTargetJoints(prev => prev.filter(j => j !== 'shoulder'));
                          }
                        }}
                      />
                      <Label htmlFor="joint-shoulder">Shoulder</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="joint-elbow" 
                        checked={targetJoints.includes('elbow')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetJoints(prev => [...prev, 'elbow']);
                          } else {
                            setTargetJoints(prev => prev.filter(j => j !== 'elbow'));
                          }
                        }}
                      />
                      <Label htmlFor="joint-elbow">Elbow</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any relevant notes about this recording session"
                    rows={4}
                  />
                </div>
              </div>
              
              <Button onClick={() => setActiveTab('record')} className="w-full">
                <Camera className="mr-2 h-4 w-4" /> Continue to Recording
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="record">
            <div className="space-y-4">
              <Alert variant={isRecording ? "default" : "destructive"}>
                {isRecording ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {isRecording ? 'Recording in Progress' : 'Ready to Record'}
                </AlertTitle>
                <AlertDescription>
                  {isRecording 
                    ? `Recording time: ${formatTime(recordingTime)}` 
                    : 'Position the patient in the camera frame and press Start Recording'}
                </AlertDescription>
              </Alert>
              
              <div className="relative">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  muted
                  className="w-full border rounded-md bg-black"
                  style={{ height: '480px', objectFit: 'contain' }}
                />
                
                {isDetecting && (
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    FPS: {fps}
                  </div>
                )}
                
                {isRecording && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                    REC {formatTime(recordingTime)}
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handleToggleRecording}
                  variant={isRecording ? "destructive" : "default"}
                  className="w-40"
                >
                  {isRecording ? (
                    <>
                      <Square className="mr-2 h-4 w-4" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Start Recording
                    </>
                  )}
                </Button>
              </div>
              
              {recordedJointAngles.length > 0 && !isRecording && (
                <Button 
                  onClick={() => setActiveTab('review')} 
                  variant="outline" 
                  className="w-full"
                >
                  Review Recorded Data
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="review">
            {recordedJointAngles.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recording Summary</CardTitle>
                      <CardDescription>
                        {sessionType === 'Custom' ? customType : sessionType} motion analysis ({formatTime(recordingTime)})
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MotionAnalysisAngleView 
                        jointAngles={recordedJointAngles}
                        targetJoints={targetJoints}
                        duration={recordingTime}
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Label htmlFor="review-notes">Session Notes</Label>
                  <Textarea 
                    id="review-notes" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any findings or observations"
                    rows={4}
                  />
                </div>
                
                {completed ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Session Saved</AlertTitle>
                    <AlertDescription>
                      This motion analysis session has been saved successfully.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button onClick={handleSaveSession} className="w-full">
                    <Save className="mr-2 h-4 w-4" /> Save Session
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center p-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">No Recording Data</h3>
                <p className="text-muted-foreground mt-2">
                  Return to the recording tab to capture motion analysis data.
                </p>
                <Button 
                  onClick={() => setActiveTab('record')} 
                  variant="outline" 
                  className="mt-4"
                >
                  Go to Recording
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
