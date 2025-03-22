
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as Human from '@vladmandic/human';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Save, RefreshCw, Camera } from 'lucide-react';
import { calculateJointAngles } from './utils';
import AngleDisplay from './AngleDisplay';
import { BodyTrackerProps, JointAngle } from './types';

const BodyTracker: React.FC<BodyTrackerProps> = ({ 
  onAnglesDetected,
  onSaveData,
  isActive = false
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [human, setHuman] = useState<Human.Human | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [angles, setAngles] = useState<JointAngle[]>([]);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [detectionFps, setDetectionFps] = useState<number>(0);
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  
  // Initialize Human.js
  useEffect(() => {
    const initHuman = async () => {
      try {
        console.log('Initializing Human.js...');
        const humanConfig: Human.Config = {
          // Use a CDN path for the models
          modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
          filter: { enabled: true, equalization: false },
          face: { enabled: false },
          body: { 
            enabled: true,
            modelPath: 'blazepose-heavy.json',
            minConfidence: 0.5,
            skipFrames: 0, // Don't skip frames for more accurate tracking
          },
          hand: { enabled: false },
          object: { enabled: false },
          gesture: { enabled: true },
        };

        const humanInstance = new Human.Human(humanConfig);
        console.log('Loading Human.js models...');
        await humanInstance.load();
        console.log('Human.js models loaded successfully');
        setHuman(humanInstance);
      } catch (error) {
        console.error('Error initializing Human.js:', error);
      }
    };

    initHuman();
    
    return () => {
      // Cleanup animation frame
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      setIsTracking(false);
    };
  }, []);

  // Effect to handle camera activation based on isActive prop
  useEffect(() => {
    if (isActive && !cameraActive) {
      setCameraActive(true);
    }
  }, [isActive, cameraActive]);
  
  // Tracking function
  const detect = useCallback(async (timestamp: number) => {
    if (!human || !webcamRef.current?.video || !canvasRef.current || !isTracking) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }
    
    const video = webcamRef.current.video;
    if (video.readyState !== 4) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }

    // Calculate FPS
    const elapsed = timestamp - lastFrameTime.current;
    if (elapsed > 0) {
      setDetectionFps(Math.round(1000 / elapsed));
    }
    lastFrameTime.current = timestamp;

    try {
      // Perform detection
      const result = await human.detect(video);
      
      // Clear canvas and draw video frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw body pose points and connections
      human.draw.all(canvas, result);
      
      // Calculate angles between joints
      if (result.body && result.body.length > 0) {
        const keypoints = result.body[0].keypoints;
        const calculatedAngles = calculateJointAngles(keypoints);
        
        setAngles(calculatedAngles);
        
        if (onAnglesDetected) {
          onAnglesDetected(calculatedAngles);
        }
      }
    } catch (error) {
      console.error('Error during detection:', error);
    }
    
    // Continue detection loop if still tracking
    if (isTracking) {
      requestRef.current = requestAnimationFrame(detect);
    }
  }, [human, isTracking, onAnglesDetected]);

  const startTracking = () => {
    setIsTracking(true);
    requestRef.current = requestAnimationFrame(detect);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  const toggleCamera = () => {
    if (cameraActive) {
      setCameraActive(false);
      stopTracking();
    } else {
      setCameraActive(true);
    }
  };

  const saveToSupabase = () => {
    if (!angles.length) return;
    
    // Prepare data for saving
    const sessionData = {
      timestamp: new Date().toISOString(),
      angles: angles,
    };
    
    if (onSaveData) {
      onSaveData(sessionData);
    }
  };

  // Effect to handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        if (video) {
          canvasRef.current.width = video.clientWidth;
          canvasRef.current.height = video.clientHeight;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          {cameraActive ? (
            <>
              <Webcam
                ref={webcamRef}
                mirrored={true}
                className="w-full h-full object-cover"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user"
                }}
              />
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                width={640}
                height={480}
              />
              
              {/* FPS counter */}
              {isTracking && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {detectionFps} FPS
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Camera is inactive</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={toggleCamera}
                >
                  Enable Camera
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            onClick={toggleCamera}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Camera className="h-4 w-4" />
            <span>{cameraActive ? 'Disable Camera' : 'Enable Camera'}</span>
          </Button>
          
          {cameraActive && (
            <>
              {!isTracking ? (
                <Button 
                  onClick={startTracking}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={!human || !cameraActive}
                >
                  <Play className="h-4 w-4" />
                  <span>Start Tracking</span>
                </Button>
              ) : (
                <Button 
                  onClick={stopTracking}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause Tracking</span>
                </Button>
              )}
              
              <Button 
                onClick={saveToSupabase}
                variant="default"
                size="sm"
                className="flex items-center gap-1"
                disabled={!angles.length}
              >
                <Save className="h-4 w-4" />
                <span>Save Data</span>
              </Button>
              
              <Button 
                onClick={() => setAngles([])}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </>
          )}
        </div>
        
        {cameraActive && (
          <div className="mt-4">
            <AngleDisplay angles={angles} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BodyTracker;
