
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, CameraOff, Check, Info, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PostureMonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

// Enum for squat states
enum SquatState {
  STANDING = 'standing',
  MID_SQUAT = 'midSquat',
  BOTTOM_SQUAT = 'bottomSquat',
}

// Enum for feedback types
enum FeedbackType {
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

const PostureMonitor: React.FC<PostureMonitorProps> = ({
  exerciseId,
  exerciseName,
  onFinish,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.INFO);
  const [accuracy, setAccuracy] = useState(0);
  const [reps, setReps] = useState(0);
  const [incorrectReps, setIncorrectReps] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // PoseNet related states
  const [model, setModel] = useState<posenet.PoseNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [currentSquatState, setCurrentSquatState] = useState<SquatState>(SquatState.STANDING);
  const [kneeAngle, setKneeAngle] = useState<number | null>(null);
  const [hipAngle, setHipAngle] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestAnimationRef = useRef<number | null>(null);
  
  // Load PoseNet model
  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true);
      try {
        // Make sure TensorFlow.js is ready
        await tf.ready();
        
        // Load PoseNet model
        const loadedModel = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75
        });
        
        setModel(loadedModel);
        setFeedback("PoseNet model loaded successfully. You can start exercising now.");
        setFeedbackType(FeedbackType.SUCCESS);
      } catch (error) {
        console.error('Error loading PoseNet model:', error);
        setFeedback("Failed to load pose estimation model. Please try refreshing the page.");
        setFeedbackType(FeedbackType.WARNING);
      } finally {
        setIsModelLoading(false);
      }
    };
    
    loadModel();
    
    // Cleanup
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, []);
  
  // Calculate angle between three points
  const calculateAngle = (a: posenet.Keypoint, b: posenet.Keypoint, c: posenet.Keypoint): number => {
    const radians = Math.atan2(c.position.y - b.position.y, c.position.x - b.position.x) -
                   Math.atan2(a.position.y - b.position.y, a.position.x - b.position.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    
    if (angle > 180.0) {
      angle = 360.0 - angle;
    }
    
    return angle;
  };
  
  // Analyze squat form
  const analyzeSquatForm = (pose: posenet.Pose) => {
    const keypoints = pose.keypoints;
    
    // Get necessary keypoints for squat analysis
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
    const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
    
    // If we don't have all the keypoints, we can't analyze the squat
    if (!leftHip || !rightHip || !leftKnee || !rightKnee || 
        !leftAnkle || !rightAnkle || !leftShoulder || !rightShoulder) {
      setFeedback("Can't detect all body parts. Please make sure your full body is visible.");
      setFeedbackType(FeedbackType.WARNING);
      return;
    }
    
    // Calculate the knee angle (between hip, knee, and ankle)
    // We'll use the average of left and right sides for better accuracy
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    setKneeAngle(Math.round(avgKneeAngle));
    
    // Calculate the hip angle (between shoulder, hip, and knee)
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const avgHipAngle = (leftHipAngle + rightHipAngle) / 2;
    setHipAngle(Math.round(avgHipAngle));
    
    // Determine squat state based on knee angle
    const prevSquatState = currentSquatState;
    
    if (avgKneeAngle > 160) {
      // Standing position (legs almost straight)
      setCurrentSquatState(SquatState.STANDING);
    } else if (avgKneeAngle < 100) {
      // Bottom squat position (knees bent significantly)
      setCurrentSquatState(SquatState.BOTTOM_SQUAT);
    } else {
      // Mid-squat position
      setCurrentSquatState(SquatState.MID_SQUAT);
    }
    
    // Count reps
    if (prevSquatState === SquatState.BOTTOM_SQUAT && currentSquatState === SquatState.MID_SQUAT) {
      // Coming up from bottom squat
      
      // Determine if this was a good squat or not
      if (avgKneeAngle < 110 && avgHipAngle > 80 && avgHipAngle < 140) {
        // Good form - knees bent properly and hip angle in good range
        setReps(prev => prev + 1);
        setFeedback("Great form! Keep going!");
        setFeedbackType(FeedbackType.SUCCESS);
        setAccuracy(prev => Math.min(prev + 2, 100));
      } else {
        // Bad form
        setIncorrectReps(prev => prev + 1);
        setAccuracy(prev => Math.max(prev - 5, 50));
        
        if (avgKneeAngle > 120) {
          setFeedback("Squat deeper! Bend your knees more.");
          setFeedbackType(FeedbackType.WARNING);
        } else if (avgHipAngle < 70) {
          setFeedback("Leaning too far forward. Keep your back straighter.");
          setFeedbackType(FeedbackType.WARNING);
        } else if (avgHipAngle > 150) {
          setFeedback("Bend forward a bit more at the hips.");
          setFeedbackType(FeedbackType.WARNING);
        }
      }
    } else {
      // Provide real-time feedback during the squat
      if (currentSquatState === SquatState.STANDING) {
        setFeedback("Start your squat by bending your knees.");
        setFeedbackType(FeedbackType.INFO);
      } else if (currentSquatState === SquatState.MID_SQUAT) {
        if (avgHipAngle < 70) {
          setFeedback("You're leaning too far forward.");
          setFeedbackType(FeedbackType.WARNING);
        } else if (avgHipAngle > 150) {
          setFeedback("Bend forward slightly at the hips.");
          setFeedbackType(FeedbackType.WARNING);
        } else {
          setFeedback("Good! Continue lowering into your squat.");
          setFeedbackType(FeedbackType.SUCCESS);
        }
      } else if (currentSquatState === SquatState.BOTTOM_SQUAT) {
        if (avgKneeAngle < 70) {
          setFeedback("Squat is too deep. Rise up slightly.");
          setFeedbackType(FeedbackType.WARNING);
        } else {
          setFeedback("Great depth! Now push through your heels to rise up.");
          setFeedbackType(FeedbackType.SUCCESS);
        }
      }
    }
  };
  
  // Draw pose keypoints and skeleton on canvas
  const drawPose = useCallback((pose: posenet.Pose) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw keypoints
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'aqua';
        ctx.fill();
      }
    });
    
    // Define connections for drawing skeleton
    const adjacentKeyPoints = [
      ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'],
      ['rightEye', 'rightEar'], ['nose', 'leftShoulder'],
      ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['leftShoulder', 'leftHip'], ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'], ['nose', 'rightShoulder'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['rightShoulder', 'rightHip'], ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
    ];
    
    // Draw skeleton
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;
    
    adjacentKeyPoints.forEach(([partA, partB]) => {
      const keyPointA = pose.keypoints.find(kp => kp.part === partA);
      const keyPointB = pose.keypoints.find(kp => kp.part === partB);
      
      if (keyPointA && keyPointB && keyPointA.score > 0.5 && keyPointB.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(keyPointA.position.x, keyPointA.position.y);
        ctx.lineTo(keyPointB.position.x, keyPointB.position.y);
        ctx.stroke();
      }
    });
    
    // Draw angles if available
    if (kneeAngle) {
      const leftKnee = pose.keypoints.find(kp => kp.part === 'leftKnee');
      if (leftKnee && leftKnee.score > 0.5) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Knee: ${kneeAngle}°`, leftKnee.position.x + 10, leftKnee.position.y);
      }
    }
    
    if (hipAngle) {
      const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
      if (leftHip && leftHip.score > 0.5) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Hip: ${hipAngle}°`, leftHip.position.x + 10, leftHip.position.y);
      }
    }
    
    // Draw squat state
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`State: ${currentSquatState}`, 10, 30);
  }, [currentSquatState, kneeAngle, hipAngle]);
  
  // Detect pose in video stream
  const detectPose = useCallback(async () => {
    if (!model || !videoRef.current || !cameraActive) return;
    
    try {
      // Estimate pose
      const pose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: false
      });
      
      // Only proceed if we have a pose with sufficient confidence
      if (pose.score > 0.3) {
        // Draw the pose
        drawPose(pose);
        
        // Analyze squat form
        analyzeSquatForm(pose);
      } else {
        setFeedback("Can't detect your pose clearly. Ensure good lighting and that your full body is visible.");
        setFeedbackType(FeedbackType.WARNING);
      }
    } catch (error) {
      console.error('Error estimating pose:', error);
    }
    
    // Continue the detection loop
    requestAnimationRef.current = requestAnimationFrame(detectPose);
  }, [model, cameraActive, drawPose]);
  
  // Start pose detection when camera is active
  useEffect(() => {
    if (cameraActive && model && videoRef.current) {
      // Ensure video is playing before starting detection
      const checkVideoReady = () => {
        if (videoRef.current?.readyState === 4) {
          // Video is ready - start detection
          requestAnimationRef.current = requestAnimationFrame(detectPose);
        } else {
          // Check again in a moment
          setTimeout(checkVideoReady, 100);
        }
      };
      
      checkVideoReady();
    }
    
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
        requestAnimationRef.current = null;
      }
    };
  }, [cameraActive, model, detectPose]);
  
  const toggleCamera = async () => {
    if (cameraActive) {
      // Turn off camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      setCameraActive(false);
      
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
        requestAnimationRef.current = null;
      }
      
      return;
    }
    
    try {
      // Request camera permission and turn on camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      if (canvasRef.current) {
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
      }
      
      setCameraActive(true);
      setPermission('granted');
      setFeedback("Starting pose analysis... Stand in a clear space where your full body is visible.");
      setFeedbackType(FeedbackType.INFO);
      setAccuracy(75); // Starting value
      setReps(0);
      setIncorrectReps(0);
      setCurrentSquatState(SquatState.STANDING);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermission('denied');
      setFeedback("Camera access denied. Please check your browser permissions.");
      setFeedbackType(FeedbackType.WARNING);
    }
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, []);
  
  const handleFinish = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    
    if (requestAnimationRef.current) {
      cancelAnimationFrame(requestAnimationRef.current);
      requestAnimationRef.current = null;
    }
    
    onFinish();
  };
  
  const handleResetSession = () => {
    setReps(0);
    setIncorrectReps(0);
    setCurrentSquatState(SquatState.STANDING);
    setFeedback("Session reset. Ready to start squatting!");
    setFeedbackType(FeedbackType.INFO);
    setAccuracy(75);
  };
  
  const getFeedbackColor = () => {
    switch (feedbackType) {
      case FeedbackType.SUCCESS: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case FeedbackType.WARNING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };
  
  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case FeedbackType.SUCCESS: return <Check className="h-4 w-4" />;
      case FeedbackType.WARNING: return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  if (!exerciseId || !exerciseName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posture Monitor</CardTitle>
          <CardDescription>
            Select an exercise to start posture analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="text-center text-muted-foreground">
            <Info className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
            <p>Please select an exercise from the library to begin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI Squat Analyzer: {exerciseName}</CardTitle>
          <CardDescription>
            AI-powered squat analysis with real-time feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover absolute inset-0"
                />
                <canvas 
                  ref={canvasRef}
                  className="w-full h-full absolute inset-0 z-10"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center p-4">
                  <Camera className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
                  <p className="text-sm">Camera is currently inactive</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Enable camera access to receive real-time squat analysis
                  </p>
                  {isModelLoading && (
                    <p className="mt-2 text-sm text-primary">Loading AI model, please wait...</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {feedback && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${getFeedbackColor()}`}>
              {getFeedbackIcon()}
              <span>{feedback}</span>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Form Accuracy</p>
              <Progress value={accuracy} className="h-2" />
              <p className="text-xs text-right mt-1 text-muted-foreground">{accuracy}%</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Good Reps</p>
              <div className="text-2xl font-bold text-green-600">{reps}</div>
              <p className="text-xs text-muted-foreground">Correct form</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Incorrect Reps</p>
              <div className="text-2xl font-bold text-amber-600">{incorrectReps}</div>
              <p className="text-xs text-muted-foreground">Needs improvement</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button 
              onClick={toggleCamera} 
              variant={cameraActive ? "destructive" : "default"}
              className="gap-2 flex-1"
              disabled={isModelLoading}
            >
              {cameraActive ? (
                <>
                  <CameraOff className="h-4 w-4" />
                  <span>Stop Camera</span>
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  <span>{isModelLoading ? "Loading AI..." : "Start Camera"}</span>
                </>
              )}
            </Button>
            
            <Button onClick={handleResetSession} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            
            <Button onClick={() => setShowTutorial(true)} variant="outline" className="gap-2">
              <Info className="h-4 w-4" />
              <span>How To</span>
            </Button>
            
            <Button onClick={handleFinish} variant="outline" className="gap-2 flex-1">
              <Check className="h-4 w-4" />
              <span>Finish Session</span>
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
      
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How to Use the Squat Analyzer</DialogTitle>
            <DialogDescription>
              Follow these steps for accurate squat form analysis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm">1</span>
                Position Your Camera
              </h3>
              <p className="text-sm text-muted-foreground">
                Place your device so the camera can see your full body from a side view. Make sure you have enough space to perform a squat.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm">2</span>
                Proper Squat Form
              </h3>
              <p className="text-sm text-muted-foreground">
                • Stand with feet shoulder-width apart<br />
                • Keep your back straight<br />
                • Lower your hips as if sitting in a chair<br />
                • Knees should track over your toes<br />
                • Aim to get your thighs parallel to the ground<br />
                • Push through your heels to stand back up
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm">3</span>
                Understanding Feedback
              </h3>
              <p className="text-sm text-muted-foreground">
                The AI will analyze your knee and hip angles to provide real-time feedback on your form. Green messages indicate good form, while yellow messages suggest areas for improvement.
              </p>
            </div>
            
            <Button onClick={() => setShowTutorial(false)} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostureMonitor;
