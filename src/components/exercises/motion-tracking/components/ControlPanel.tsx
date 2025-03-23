
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, BarChart, Clipboard, Play, Save, StopCircle } from 'lucide-react';

interface ControlPanelProps {
  controls: {
    isDetecting: boolean;
    isModelLoaded: boolean;
    onStartDetection: () => void;
    onStopDetection: () => void;
    onReset: () => void;
  };
}

const ControlPanel: React.FC<ControlPanelProps> = ({ controls }) => {
  const { 
    isDetecting, 
    isModelLoaded, 
    onStartDetection, 
    onStopDetection, 
    onReset 
  } = controls;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Exercise Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {!isDetecting ? (
            <Button 
              onClick={onStartDetection} 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!isModelLoaded}
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button 
              onClick={onStopDetection} 
              variant="destructive" 
              className="flex-1"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          
          <Button onClick={onReset} variant="outline" className="flex-1">
            Reset Session
          </Button>
          
          <Button variant="outline" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Data
          </Button>
          
          <Button variant="outline" className="flex-1">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          
          <Button variant="outline" className="col-span-2">
            <Clipboard className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
