
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { human } from '@/lib/human';

const StandaloneMotionTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading Human.js model...');
        
        // Load the model directly
        await human.load();
        console.log('Human.js model loaded successfully');
        setModelLoaded(true);
        toast.success("AI model loaded successfully");
      } catch (err) {
        console.error('Error loading Human.js model:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load detection model';
        setError(errorMessage);
        toast.error('Failed to load motion detection model. Please refresh and try again.');
      }
    };
    
    loadModel();
    
    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      // Also stop camera on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      // Store stream reference for cleanup
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log("Setting video source");
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return;
          
          if (videoRef.current.readyState >= 2) {
            resolve();
          } else {
            videoRef.current.onloadeddata = () => resolve();
          }
        });
        
        console.log("Video ready, dimensions:", videoRef.current.videoWidth, "x", videoRef.current.videoHeight);
        
        // Size canvas to match video
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth || 640;
          canvasRef.current.height = videoRef.current.videoHeight || 480;
        }
        
        // Explicitly start playing
        try {
          await videoRef.current.play();
          console.log("Video playback started");
          setCameraStarted(true);
          toast.success("Camera started successfully");
          
          // Auto-start detection if model is loaded
          if (modelLoaded) {
            setTimeout(() => {
              startDetection();
            }, 500);
          }
        } catch (playError) {
          console.error("Error playing video:", playError);
          throw new Error("Failed to start camera playback. Please check your browser settings.");
        }
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Detection loop
  const detectFrame = React.useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isDetecting || !modelLoaded) {
      requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }
    
    try {
      // Check if video is playing and has dimensions
      if (videoRef.current.paused || videoRef.current.ended) {
        console.log("Video is paused or ended, restarting playback");
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.error("Error restarting playback:", playError);
        }
      }
      
      if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
        console.log("Video dimensions not available yet");
        requestRef.current = requestAnimationFrame(detectFrame);
        return;
      }
      
      // Perform detection
      const result = await human.detect(videoRef.current);
      console.log("Detection result:", result.body?.length > 0 ? "Body detected" : "No body detected");
      
      // Draw results on canvas
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Clear previous frame
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Draw detection results
        await human.draw.all(canvasRef.current, result);
      }
      
      // Continue detection loop
      requestRef.current = requestAnimationFrame(detectFrame);
    } catch (err) {
      console.error('Error in detection:', err);
      const errorMessage = err instanceof Error ? err.message : 'Detection error';
      setError(errorMessage);
      setIsDetecting(false);
    }
  }, [isDetecting, modelLoaded]);

  // Start detection
  const startDetection = () => {
    if (!cameraStarted) {
      toast.error("Please start the camera first");
      return;
    }
    
    if (!modelLoaded) {
      toast.error("AI model is still loading");
      return;
    }
    
    if (!isDetecting) {
      setIsDetecting(true);
      
      // Make sure canvas dimensions match video
      if (videoRef.current && canvasRef.current) {
        const vw = videoRef.current.videoWidth || 640;
        const vh = videoRef.current.videoHeight || 480;
        console.log(`Setting canvas dimensions to ${vw}x${vh}`);
        canvasRef.current.width = vw;
        canvasRef.current.height = vh;
      }
      
      // Start detection loop
      requestRef.current = requestAnimationFrame(detectFrame);
      toast.success("Motion tracking started");
    }
  };

  // Stop detection
  const stopDetection = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      setIsDetecting(false);
      toast.info("Motion tracking stopped");
    }
  };

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Motion Tracking Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This is a standalone version of the motion tracking feature for testing purposes.
        </p>
        
        <div className="model-status flex items-center gap-2 mb-4">
          <div className={`h-2.5 w-2.5 rounded-full ${modelLoaded ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
          <span className="text-sm">
            {modelLoaded ? 'AI Model Ready' : 'Loading AI Model...'}
          </span>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-gray-900 w-full h-96 md:h-[500px]">
            {!cameraStarted ? (
              <div className="flex flex-col items-center justify-center h-full text-white">
                <p className="mb-4 text-center max-w-md px-4">
                  Position yourself so your full body is visible to the camera for motion tracking.
                </p>
                <Button 
                  onClick={startCamera} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!modelLoaded}
                >
                  Start Camera
                </Button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  className="absolute inset-0 w-full h-full object-contain z-10 transform mirror-mode"
                  playsInline 
                  muted
                  autoPlay
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute inset-0 w-full h-full z-20 transform mirror-mode"
                />
                
                {isDetecting && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs p-1.5 rounded">
                    Tracking active
                  </div>
                )}
              </>
            )}
          </div>
          
          {cameraStarted && (
            <div className="bg-slate-100 dark:bg-slate-800 p-4 flex space-x-4 justify-center">
              <Button 
                onClick={startDetection} 
                disabled={isDetecting || !modelLoaded} 
                variant="default"
              >
                Start Tracking
              </Button>
              <Button 
                onClick={stopDetection} 
                disabled={!isDetecting} 
                variant="outline"
              >
                Stop Tracking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Troubleshooting Tips:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Make sure you have good lighting in your environment</li>
          <li>Position your camera so your full body is visible</li>
          <li>Stand at least 6 feet away from the camera</li>
          <li>Allow camera permissions when prompted</li>
          <li>Try refreshing the page if the model fails to load</li>
        </ul>
      </div>
    </div>
  );
};

export default StandaloneMotionTracker;
