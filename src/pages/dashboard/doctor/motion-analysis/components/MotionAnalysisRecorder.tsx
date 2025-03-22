
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Camera, 
  Square, 
  Save, 
  Trash2, 
  RefreshCw,
  Play,
  LineChart,
  RotateCcw
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import MotionAnalysisAngleView from './MotionAnalysisAngleView';
import { useHumanDetection } from '../hooks/useHumanDetection';

// Types for motion analysis data
export interface JointAngle {
  jointName: string;
  angle: number;
  timestamp: number;
}

export interface MotionAnalysisSession {
  id?: string;
  patientId: string;
  doctorId: string;
  notes: string;
  type: 'range-of-motion' | 'gait-analysis' | 'posture-assessment' | 'custom';
  customType?: string;
  jointAngles: JointAngle[];
  measurementDate: string;
  targetJoints: string[];
  duration: number;
  status: 'draft' | 'completed';
}

interface MotionAnalysisRecorderProps {
  patientId: string;
  patientName: string;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

const DEFAULT_ANALYSIS_TYPES = [
  { id: 'range-of-motion', label: 'Range of Motion' },
  { id: 'gait-analysis', label: 'Gait Analysis' },
  { id: 'posture-assessment', label: 'Posture Assessment' },
  { id: 'custom', label: 'Custom Measurement' }
];

const DEFAULT_JOINTS = [
  { id: 'left-knee', label: 'Left Knee' },
  { id: 'right-knee', label: 'Right Knee' },
  { id: 'left-elbow', label: 'Left Elbow' },
  { id: 'right-elbow', label: 'Right Elbow' },
  { id: 'left-shoulder', label: 'Left Shoulder' },
  { id: 'right-shoulder', label: 'Right Shoulder' },
  { id: 'left-hip', label: 'Left Hip' },
  { id: 'right-hip', label: 'Right Hip' },
  { id: 'left-ankle', label: 'Left Ankle' },
  { id: 'right-ankle', label: 'Right Ankle' }
];

const MotionAnalysisRecorder: React.FC<MotionAnalysisRecorderProps> = ({
  patientId,
  patientName,
  isRecording,
  setIsRecording
}) => {
  // Video and canvas references
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Session state
  const [sessionData, setSessionData] = useState<MotionAnalysisSession>({
    patientId: patientId,
    doctorId: '', // Will be filled from auth context
    notes: '',
    type: 'range-of-motion',
    jointAngles: [],
    measurementDate: new Date().toISOString(),
    targetJoints: ['left-knee', 'right-knee'],
    duration: 0,
    status: 'draft'
  });
  
  const [customType, setCustomType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [selectedViewTab, setSelectedViewTab] = useState('camera');
  const [cameraPermission, setCameraPermission] = useState<PermissionState | null>(null);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Human.js detection hook
  const { 
    startDetection,
    stopDetection,
    detectedAngles,
    detectionStatus,
    resetDetection,
    cameraStream,
    setCameraStream
  } = useHumanDetection({
    videoRef,
    canvasRef,
    targetJoints: sessionData.targetJoints
  });
  
  // Initialize with user ID once available
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSessionData(prev => ({
          ...prev,
          doctorId: user.id
        }));
      }
    };
    
    getUserData();
  }, []);
  
  // Update patient ID when it changes
  useEffect(() => {
    setSessionData(prev => ({
      ...prev,
      patientId
    }));
  }, [patientId]);
  
  // Timer for recording duration
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording) {
      const startTime = Date.now();
      interval = window.setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setSessionDuration(0);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);
  
  // Update joint angles when they're detected
  useEffect(() => {
    if (isRecording && detectedAngles.length > 0) {
      setSessionData(prev => ({
        ...prev,
        jointAngles: [...prev.jointAngles, ...detectedAngles]
      }));
    }
  }, [detectedAngles, isRecording]);
  
  // Handle starting camera
  const handleStartCamera = async () => {
    try {
      setCameraError(null);
      
      // Check permission
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(permissionStatus.state);
        
        permissionStatus.onchange = () => {
          setCameraPermission(permissionStatus.state);
        };
      } catch (error) {
        console.log('Permission API not supported, proceeding with camera request');
      }
      
      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setIsCameraActive(true);
        
        // Start Human.js detection once camera is active
        startDetection();
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      
      let errorMessage = 'Failed to access camera';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'Camera permission denied. Please allow camera access to use this feature.';
          setCameraPermission('denied');
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera and try again.';
        } else if (error.message) {
          errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      setCameraError(errorMessage);
      toast.error('Camera Error', {
        description: errorMessage
      });
    }
  };
  
  // Handle stopping camera
  const handleStopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    stopDetection();
    
    // If recording, make sure to stop
    if (isRecording) {
      setIsRecording(false);
    }
  }, [cameraStream, isRecording, setIsRecording, stopDetection]);
  
  // Handle start recording
  const handleStartRecording = () => {
    if (!isCameraActive) {
      toast.error('Camera not active', {
        description: 'Please start the camera before recording'
      });
      return;
    }
    
    setIsRecording(true);
    setSessionData(prev => ({
      ...prev,
      jointAngles: [],
      measurementDate: new Date().toISOString(),
      duration: 0
    }));
    
    toast.info('Recording started', {
      description: 'Capturing motion data...'
    });
  };
  
  // Handle stop recording
  const handleStopRecording = () => {
    setIsRecording(false);
    setSessionData(prev => ({
      ...prev,
      duration: sessionDuration
    }));
    
    toast.success('Recording complete', {
      description: `Captured ${sessionData.jointAngles.length} measurements over ${sessionDuration} seconds`
    });
  };
  
  // Handle saving session data
  const handleSaveSession = async () => {
    try {
      setIsSaving(true);
      
      // Prepare data for saving
      const dataToSave = {
        ...sessionData,
        type: sessionData.type === 'custom' ? customType : sessionData.type,
        status: 'completed'
      };
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('motion_analysis_sessions')
        .insert(dataToSave)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Session Saved', {
        description: 'Motion analysis data has been saved successfully'
      });
      
      // Reset session
      setSessionData({
        patientId: patientId,
        doctorId: sessionData.doctorId,
        notes: '',
        type: 'range-of-motion',
        jointAngles: [],
        measurementDate: new Date().toISOString(),
        targetJoints: ['left-knee', 'right-knee'],
        duration: 0,
        status: 'draft'
      });
      
      setSessionDuration(0);
      setCustomType('');
      
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Save Failed', {
        description: error instanceof Error ? error.message : 'Failed to save motion analysis data'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle discarding current session
  const handleDiscardSession = () => {
    // If recording, stop first
    if (isRecording) {
      handleStopRecording();
    }
    
    // Reset session data
    setSessionData({
      patientId: patientId,
      doctorId: sessionData.doctorId,
      notes: '',
      type: 'range-of-motion',
      jointAngles: [],
      measurementDate: new Date().toISOString(),
      targetJoints: ['left-knee', 'right-knee'],
      duration: 0,
      status: 'draft'
    });
    
    setSessionDuration(0);
    setCustomType('');
    
    toast.info('Session Discarded', {
      description: 'Motion analysis data has been cleared'
    });
  };
  
  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle joint selection
  const handleJointSelection = (jointId: string) => {
    setSessionData(prev => {
      const currentJoints = [...prev.targetJoints];
      
      if (currentJoints.includes(jointId)) {
        return {
          ...prev,
          targetJoints: currentJoints.filter(j => j !== jointId)
        };
      } else {
        return {
          ...prev,
          targetJoints: [...currentJoints, jointId]
        };
      }
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4">
              <Tabs value={selectedViewTab} onValueChange={setSelectedViewTab} className="space-y-4">
                <TabsList className="w-full max-w-xs mx-auto">
                  <TabsTrigger value="camera" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>Camera View</span>
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    <span>Angle Analysis</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="camera" className="relative">
                  <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                    {/* Camera feed */}
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay canvas for visualizations */}
                    <canvas 
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    />
                    
                    {/* Recording indicator */}
                    {isRecording && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span>Recording {formatTime(sessionDuration)}</span>
                      </div>
                    )}
                    
                    {/* Camera not active overlay */}
                    {!isCameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
                        <Camera className="h-12 w-12 mb-2" />
                        <h3 className="text-lg font-medium mb-2">Camera not active</h3>
                        <p className="text-sm text-gray-300 mb-4">Start the camera to begin motion analysis</p>
                        <Button onClick={handleStartCamera} className="bg-primary">
                          Start Camera
                        </Button>
                        
                        {cameraError && (
                          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md max-w-md text-center">
                            <p className="text-sm text-red-300">{cameraError}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Detection status indicator */}
                    {isCameraActive && detectionStatus && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                        {detectionStatus.isDetecting ? (
                          <span className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            AI Detection Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                            Initializing AI...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Camera controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                    <div className="flex items-center gap-2">
                      {!isCameraActive ? (
                        <Button onClick={handleStartCamera} className="gap-2">
                          <Camera className="h-4 w-4" />
                          <span>Start Camera</span>
                        </Button>
                      ) : (
                        <Button onClick={handleStopCamera} variant="destructive" className="gap-2">
                          <Square className="h-4 w-4" />
                          <span>Stop Camera</span>
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={resetDetection}
                        disabled={!isCameraActive}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reset Detection</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isRecording ? (
                        <Button 
                          onClick={handleStartRecording} 
                          disabled={!isCameraActive}
                          className="gap-2 bg-red-600 hover:bg-red-700"
                        >
                          <Play className="h-4 w-4" />
                          <span>Start Recording</span>
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleStopRecording}
                          variant="destructive"
                          className="gap-2"
                        >
                          <Square className="h-4 w-4" />
                          <span>Stop Recording</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis">
                  <MotionAnalysisAngleView 
                    jointAngles={sessionData.jointAngles}
                    targetJoints={sessionData.targetJoints}
                    duration={sessionDuration}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Session data and recording controls */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label htmlFor="analysisType">Analysis Type</Label>
                  <RadioGroup 
                    id="analysisType" 
                    value={sessionData.type}
                    onValueChange={(value) => setSessionData(prev => ({
                      ...prev,
                      type: value as any
                    }))}
                    className="space-y-2"
                  >
                    {DEFAULT_ANALYSIS_TYPES.map(type => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={type.id} 
                          id={`type-${type.id}`}
                        />
                        <Label htmlFor={`type-${type.id}`}>{type.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {sessionData.type === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="customType">Custom Analysis Type</Label>
                      <Input
                        id="customType"
                        placeholder="Enter custom analysis type..."
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Session Notes</Label>
                    <textarea
                      id="notes"
                      placeholder="Add notes about this motion analysis session..."
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      value={sessionData.notes}
                      onChange={(e) => setSessionData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Target Joints</Label>
                      <span className="text-xs text-muted-foreground">
                        Selected: {sessionData.targetJoints.length}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {DEFAULT_JOINTS.map(joint => (
                        <div key={joint.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`joint-${joint.id}`}
                            checked={sessionData.targetJoints.includes(joint.id)}
                            onChange={() => handleJointSelection(joint.id)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`joint-${joint.id}`} className="text-sm">
                            {joint.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Session Information</Label>
                      {sessionData.jointAngles.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {sessionData.jointAngles.length} measurements recorded
                        </span>
                      )}
                    </div>
                    
                    <div className="rounded-md border p-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Patient:</span>
                        <span className="font-medium">{patientName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{formatTime(sessionDuration)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Measurements:</span>
                        <span className="font-medium">{sessionData.jointAngles.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Session actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-6 pt-4 border-t">
                <Button 
                  variant="destructive" 
                  onClick={handleDiscardSession}
                  disabled={sessionData.jointAngles.length === 0 || isSaving}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Discard Session</span>
                </Button>
                
                <Button 
                  onClick={handleSaveSession}
                  disabled={
                    sessionData.jointAngles.length === 0 || 
                    isSaving || 
                    isRecording || 
                    (sessionData.type === 'custom' && !customType)
                  }
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Session'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Current Joint Angles</h3>
              {detectedAngles.length > 0 ? (
                <div className="space-y-3">
                  {Array.from(
                    new Set(detectedAngles.map(angle => angle.jointName))
                  ).map(jointName => {
                    // Get the most recent angle for this joint
                    const latestAngle = [...detectedAngles]
                      .filter(a => a.jointName === jointName)
                      .sort((a, b) => b.timestamp - a.timestamp)[0];
                    
                    return (
                      <div key={jointName} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{jointName}</Label>
                          <span className="text-sm font-medium">
                            {Math.round(latestAngle.angle)}°
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${Math.min(100, (latestAngle.angle / 180) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : isCameraActive ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Waiting for joint detection...</p>
                  <p className="text-xs mt-2">
                    Position the patient in view of the camera
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No joint angles detected</p>
                  <p className="text-xs mt-2">
                    Start the camera to begin detection
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Instructions</h3>
              
              <div className="space-y-2 text-sm">
                <p className="font-medium">Getting Started:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Select a patient to analyze</li>
                  <li>Start the camera and ensure the patient is in view</li>
                  <li>Select the joints you want to track</li>
                  <li>Start recording when ready</li>
                  <li>Guide the patient through the required movements</li>
                  <li>Stop recording when finished</li>
                  <li>Add notes and save the session</li>
                </ol>
                
                <p className="font-medium mt-4">Tips for accurate measurements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ensure good lighting in the room</li>
                  <li>Position the camera to clearly see the joints</li>
                  <li>Ask the patient to wear suitable clothing</li>
                  <li>Guide the patient to move slowly during measurements</li>
                  <li>Verify proper joint detection before recording</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MotionAnalysisRecorder;
