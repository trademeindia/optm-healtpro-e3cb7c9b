
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MonitorMain from './MonitorMain';
import SettingsPanel from './SettingsPanel';
import TutorialDialog from '../TutorialDialog';
import { PoseDetectionConfig } from '../poseDetectionTypes';
import { getOptimizedConfig } from '../utils/configUtils';

interface MonitorContainerProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

const MonitorContainer: React.FC<MonitorContainerProps> = ({
  exerciseId,
  exerciseName,
  onFinish,
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [customConfig, setCustomConfig] = useState<PoseDetectionConfig>(getOptimizedConfig());
  
  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleConfigChange = (newConfig: Partial<PoseDetectionConfig>) => {
    setCustomConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>AI Squat Analyzer: {exerciseName}</CardTitle>
            <CardDescription>
              AI-powered squat analysis with real-time feedback
            </CardDescription>
          </div>
          <SettingsPanel 
            currentConfig={customConfig}
            onConfigChange={handleConfigChange}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <MonitorMain 
            exerciseId={exerciseId}
            exerciseName={exerciseName}
            onFinish={onFinish}
            onShowTutorial={handleShowTutorial}
            customConfig={customConfig}
          />
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

export default MonitorContainer;
