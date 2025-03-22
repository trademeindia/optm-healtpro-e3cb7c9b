
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Play, Pause, RotateCcw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as Human from '@vladmandic/human';
import { MotionTrackerProps, FeedbackType, TrackerStats, HumanDetectionStatus } from './types';
import FeedbackDisplay from './FeedbackDisplay';
import StatsDisplay from './StatsDisplay';
import TutorialDialog from './TutorialDialog';
import CameraView from './CameraView';
import PoseRenderer from './PoseRenderer';

const MotionTracker: React.FC<MotionTrackerProps> = ({
  exerciseId,
  exerciseName,
  onFinish,
}) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const humanRef = useRef<Human.Human | null>(null);
  const animationRef = useRef<number | null>(null);

  // State
  const [cameraActive, setCameraActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string | null, type: FeedbackType }>({
    message: "Start the camera to begin motion tracking.",
    type: FeedbackType.INFO
  });
  const [stats, setStats] = useState<TrackerStats>({
    repetitions: 0,
    accuracy: 0,
    feedback: ""
  });
  const [detectionStatus, setDetectionStatus] = useState<HumanDetectionStatus>({
    isActive: false,
    fps: null,
    confidence: null
  });
  const [lastDetection, setLastDetection] = useState<Human.Result | null>(null);

  // Initialize Human.js
  useEffect(() => {
    const initHuman = async () => {
      if (!humanRef.current) {
        setIsModelLoading(true);
        setFeedback({
          message: "Loading motion detection model...",
          type: FeedbackType.INFO
        });

        try {
          const config: Human.Config = {
            modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
            filter: { enabled: true },
            face: { enabled: false },
            body: { enabled: true, modelPath: 'blazepose.json' },
            hand: { enabled: false },
            object: { enabled: false },
            gesture: { enabled: true },
            debug: false
          };

          humanRef.current = new Human.Human(config);
          await humanRef.current.load();
          
          setFeedback({
            message: "Motion detection model loaded. Start camera to begin tracking.",
            type: FeedbackType.SUCCESS
          });
        } catch (error) {
          console.error('Failed to initialize Human.js:', error);
          setFeedback({
            message: "Failed to load motion detection model. Please try again.",
            type: FeedbackType.ERROR
          });
        } finally {
          setIsModelLoading(false);
        }
      }
    };

    initHuman();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle camera toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }

    try {
      if (!humanRef.current) {
        setFeedback({
          message: "Motion detection model not loaded. Please wait or refresh the page.",
          type: FeedbackType.ERROR
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setCameraActive(true);
            setFeedback({
              message: "Camera active. Analyzing your movements...",
              type: FeedbackType.INFO
            });
            startDetection();
          }
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setFeedback({
        message: "Failed to access camera. Please check camera permissions.",
        type: FeedbackType.ERROR
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setCameraActive(false);
    setDetectionStatus({
      isActive: false,
      fps: null,
      confidence: null
    });

    setFeedback({
      message: "Camera stopped. Start camera to begin tracking.",
      type: FeedbackType.INFO
    });
  };

  // Reset session
  const resetSession = () => {
    setStats({
      repetitions: 0,
      accuracy: 0,
      feedback: ""
    });
    
    setFeedback({
      message: "Session reset. Continue your exercise.",
      type: FeedbackType.INFO
    });
    
    toast.info("Session has been reset");
  };

  // Start human detection loop
  const startDetection = () => {
    if (!humanRef.current || !videoRef.current || !canvasRef.current) return;

    const human = humanRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Setup canvas
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    let lastTime = performance.now();
    let frameCount = 0;

    const detect = async () => {
      if (!human || !video || !canvas || !ctx || !cameraActive) return;

      try {
        // Perform detection
        const result = await human.detect(video);
        setLastDetection(result);
        
        // Calculate FPS
        const now = performance.now();
        frameCount++;
        
        if (now - lastTime >= 1000) {
          setDetectionStatus({
            isActive: true,
            fps: Math.round(frameCount * 1000 / (now - lastTime)),
            confidence: result.body[0]?.score || null
          });
          frameCount = 0;
          lastTime = now;
        }

        // Analyze movement and provide feedback
        if (result.body.length > 0) {
          analyzeMovement(result);
        }

        // Draw video frame and detection results
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw detected body keypoints
        human.draw.all(canvas, result);
        
        // Update tracking status
        if (result.body.length === 0) {
          setFeedback({
            message: "No person detected. Please make sure you're visible in the camera.",
            type: FeedbackType.WARNING
          });
        }
      } catch (error) {
        console.error('Detection error:', error);
      }

      // Continue detection loop
      if (cameraActive) {
        animationRef.current = requestAnimationFrame(detect);
      }
    };

    // Start detection loop
    animationRef.current = requestAnimationFrame(detect);
  };

  // Analyze human movement and provide feedback
  const analyzeMovement = (result: Human.Result) => {
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    // Simple posture analysis example (can be expanded based on specific exercises)
    // Check if enough keypoints are detected with good confidence
    if (body.score > 0.7) {
      // Get specific keypoints for analysis
      const nose = keypoints.find(kp => kp.part === 'nose');
      const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
      const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
      const leftHip = keypoints.find(kp => kp.part === 'leftHip');
      const rightHip = keypoints.find(kp => kp.part === 'rightHip');
      const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
      const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
      
      // Detect repetitive movements (simplified example)
      // In a real implementation, you would use more sophisticated algorithms
      // to detect specific exercises like squats, lunges, etc.
      if (leftKnee && rightKnee && leftHip && rightHip) {
        // Simple squat detection example (knees bend significantly)
        const kneeY = (leftKnee.position[1] + rightKnee.position[1]) / 2;
        const hipY = (leftHip.position[1] + rightHip.position[1]) / 2;
        
        // Calculate knee to hip distance (higher value means more bent knees)
        const kneeHipDistance = kneeY - hipY;
        
        // Static thresholds for demonstration (would need to be dynamic in practice)
        if (kneeHipDistance < 50) {  // Standing position
          if (stats.feedback === "squat-down") {
            // Count a repetition when returning to standing from squat
            setStats(prev => ({
              ...prev,
              repetitions: prev.repetitions + 1,
              accuracy: Math.min(100, prev.accuracy + 5),
              feedback: "squat-up"
            }));
            
            setFeedback({
              message: `Great job! Repetition ${stats.repetitions + 1} completed.`,
              type: FeedbackType.SUCCESS
            });
          } else if (!stats.feedback) {
            setStats(prev => ({
              ...prev,
              feedback: "squat-up"
            }));
            
            setFeedback({
              message: "Stand straight and prepare for the exercise.",
              type: FeedbackType.INFO
            });
          }
        } else if (kneeHipDistance > 100) {  // Squat position
          if (stats.feedback === "squat-up") {
            setStats(prev => ({
              ...prev,
              feedback: "squat-down"
            }));
            
            setFeedback({
              message: "Good squat form. Now rise back up slowly.",
              type: FeedbackType.INFO
            });
          }
        }
      }
      
      // Check posture alignment
      if (nose && leftShoulder && rightShoulder && leftHip && rightHip) {
        // Simple posture check: vertical alignment
        const shoulderX = (leftShoulder.position[0] + rightShoulder.position[0]) / 2;
        const hipX = (leftHip.position[0] + rightHip.position[0]) / 2;
        const noseX = nose.position[0];
        
        // Check if body is leaning too much
        const shoulderHipDiff = Math.abs(shoulderX - hipX);
        const noseShoulderDiff = Math.abs(noseX - shoulderX);
        
        if (shoulderHipDiff > 50 || noseShoulderDiff > 50) {
          setFeedback({
            message: "Keep your body aligned vertically for better form.",
            type: FeedbackType.WARNING
          });
        }
      }
    } else {
      setFeedback({
        message: "Move closer to the camera for better tracking.",
        type: FeedbackType.WARNING
      });
    }
  };

  // Handle finish button click
  const handleFinish = () => {
    stopCamera();
    onFinish();
  };

  // Display exercise selection if no exercise selected
  if (!exerciseId || !exerciseName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Selection</CardTitle>
          <CardDescription>
            Please select an exercise from the list to start motion tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No exercise selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Motion Tracker: {exerciseName}</CardTitle>
          <CardDescription>
            AI-powered motion tracking with real-time feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera display */}
          <CameraView 
            cameraActive={cameraActive}
            isModelLoading={isModelLoading}
            videoRef={videoRef}
            canvasRef={canvasRef}
            detectionStatus={detectionStatus}
          />
          
          {/* Feedback display */}
          {feedback.message && (
            <FeedbackDisplay 
              feedback={feedback.message}
              feedbackType={feedback.type}
            />
          )}
          
          {/* Stats display */}
          <StatsDisplay 
            accuracy={stats.accuracy}
            reps={stats.repetitions}
          />
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={cameraActive ? "destructive" : "default"}
              onClick={toggleCamera}
              disabled={isModelLoading}
              className="flex items-center gap-2"
            >
              {cameraActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetSession}
              disabled={isModelLoading || !cameraActive}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Session
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowTutorial(true)}
              className="flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              How to Use
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleFinish}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Finish
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>Your camera feed is processed locally and not stored or sent to any server.</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Tutorial dialog */}
      <TutorialDialog 
        open={showTutorial} 
        onOpenChange={setShowTutorial} 
      />
    </>
  );
};

export default MotionTracker;
