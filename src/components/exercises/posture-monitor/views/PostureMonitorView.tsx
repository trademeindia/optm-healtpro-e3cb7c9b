
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { usePostureMonitor } from '../context/PostureMonitorProvider';
import FeedbackDisplay from '../FeedbackDisplay';
import StatsDisplay from '../StatsDisplay';
import TutorialDialog from '../TutorialDialog';
import PoseRenderer from '../PoseRenderer';
import CameraView from '../CameraView';
import ControlButtons from '../ControlButtons';
import BiomechanicalAnalysis from '../BiomechanicalAnalysis';
import { DEFAULT_POSE_CONFIG } from '../utils/poseDetectionConfig';

interface PostureMonitorViewProps {
  exerciseName: string;
}

const PostureMonitorView: React.FC<PostureMonitorViewProps> = ({ exerciseName }) => {
  const {
    // State
    cameraActive,
    videoRef,
    canvasRef,
    cameraError,
    isModelLoading,
    pose,
    analysis,
    stats,
    customFeedback,
    detectionStatus,
    analysisResult,
    isAnalyzing,
    analysisError,
    showTutorial,
    showBiomechanics,
    
    // Actions
    handleToggleCamera,
    retryCamera,
    resetSession,
    setShowTutorial,
    toggleBiomechanics,
    handleFinish
  } = usePostureMonitor();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI Squat Analyzer: {exerciseName}</CardTitle>
          <CardDescription>
            AI-powered squat analysis with real-time biomechanical feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera display and pose overlay */}
          <CameraView 
            cameraActive={cameraActive}
            isModelLoading={isModelLoading}
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraError={cameraError}
            onRetryCamera={retryCamera}
            detectionStatus={{
              isDetecting: detectionStatus?.isDetecting || false,
              fps: detectionStatus?.fps || null,
              confidence: pose?.score || null
            }}
          />
          
          {/* Render the pose skeleton on the canvas when pose is detected */}
          {pose && (
            <PoseRenderer
              pose={pose}
              canvasRef={canvasRef}
              kneeAngle={analysis.kneeAngle}
              hipAngle={analysis.hipAngle}
              currentSquatState={analysis.currentSquatState}
              config={DEFAULT_POSE_CONFIG}
            />
          )}
          
          {/* Feedback display */}
          {customFeedback?.message && (
            <FeedbackDisplay 
              feedback={customFeedback.message}
              feedbackType={customFeedback.type}
            />
          )}
          
          {/* Always show biomechanical analysis panel for enhanced feedback */}
          <BiomechanicalAnalysis 
            analysisResult={analysisResult}
            isAnalyzing={isAnalyzing}
            error={analysisError}
          />
          
          {/* Stats display */}
          <StatsDisplay 
            accuracy={stats.accuracy}
            reps={stats.reps}
            incorrectReps={stats.incorrectReps}
          />
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <ControlButtons 
              cameraActive={cameraActive}
              isModelLoading={isModelLoading}
              onToggleCamera={handleToggleCamera}
              onReset={resetSession}
              onShowTutorial={() => setShowTutorial(true)}
              onFinish={handleFinish}
            />
            
            {/* Add biomechanics toggle button - changed to be enabled by default */}
            <button
              onClick={toggleBiomechanics}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                showBiomechanics 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              disabled={isModelLoading || !cameraActive}
            >
              {showBiomechanics ? 'Hide Biomechanics' : 'Show Biomechanics'}
            </button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>Your camera feed is processed locally and biomechanical analysis provided by OpenSim technology.</span>
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

export default PostureMonitorView;
