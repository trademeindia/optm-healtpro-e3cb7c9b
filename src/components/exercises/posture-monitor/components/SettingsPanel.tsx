
import React from 'react';
import { Settings } from 'lucide-react';
import PerformanceSettings from '../PerformanceSettings';
import { PoseDetectionConfig } from '../poseDetectionTypes';

interface SettingsPanelProps {
  currentConfig: PoseDetectionConfig;
  onConfigChange: (newConfig: Partial<PoseDetectionConfig>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  currentConfig,
  onConfigChange,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <>
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        title="Performance Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
      
      {showSettings && (
        <PerformanceSettings 
          currentConfig={currentConfig}
          onConfigChange={onConfigChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default SettingsPanel;
