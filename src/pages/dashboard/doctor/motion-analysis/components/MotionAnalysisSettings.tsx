
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, RefreshCw, Settings, BarChart3, Download } from 'lucide-react';
import { toast } from "sonner";

interface MotionAnalysisSettingsProps {
  patientId?: string;
  patientName?: string;
}

const MotionAnalysisSettings: React.FC<MotionAnalysisSettingsProps> = ({
  patientId,
  patientName
}) => {
  const [activeTab, setActiveTab] = useState("detection");
  const [detectionSettings, setDetectionSettings] = useState({
    confidenceThreshold: 0.6,
    smoothingFactor: 0.5,
    frameSkip: 2,
    enableAdvancedTracking: true,
    modelType: 'default'
  });
  
  const [analysisSettings, setAnalysisSettings] = useState({
    rangeOfMotionThresholds: {
      knee: { min: 0, max: 140 },
      elbow: { min: 0, max: 160 },
      shoulder: { min: 0, max: 180 },
      hip: { min: 0, max: 120 },
      ankle: { min: 0, max: 70 }
    },
    autoGenerateReports: true,
    compareToBaseline: true,
    highlightAbnormalities: true
  });
  
  const [visualizationSettings, setVisualizationSettings] = useState({
    showSkeleton: true,
    showLabels: true,
    showAngles: true,
    lineThickness: 2,
    colorScheme: 'default'
  });
  
  // Handle updating detection settings
  const handleDetectionSettingChange = (
    setting: keyof typeof detectionSettings,
    value: any
  ) => {
    setDetectionSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle updating analysis settings
  const handleAnalysisThresholdChange = (
    joint: string,
    type: 'min' | 'max',
    value: number
  ) => {
    setAnalysisSettings(prev => ({
      ...prev,
      rangeOfMotionThresholds: {
        ...prev.rangeOfMotionThresholds,
        [joint]: {
          ...prev.rangeOfMotionThresholds[joint as keyof typeof prev.rangeOfMotionThresholds],
          [type]: value
        }
      }
    }));
  };
  
  // Handle updating analysis boolean settings
  const handleAnalysisBooleanChange = (
    setting: keyof Omit<typeof analysisSettings, 'rangeOfMotionThresholds'>,
    value: boolean
  ) => {
    setAnalysisSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle updating visualization settings
  const handleVisualizationSettingChange = (
    setting: keyof typeof visualizationSettings,
    value: any
  ) => {
    setVisualizationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle saving all settings
  const handleSaveSettings = () => {
    // In a real app, we would save these to the database
    // For now, we'll just show a toast
    toast.success('Settings Saved', {
      description: 'Your motion analysis settings have been updated'
    });
  };
  
  // Handle resetting all settings to defaults
  const handleResetSettings = () => {
    setDetectionSettings({
      confidenceThreshold: 0.6,
      smoothingFactor: 0.5,
      frameSkip: 2,
      enableAdvancedTracking: true,
      modelType: 'default'
    });
    
    setAnalysisSettings({
      rangeOfMotionThresholds: {
        knee: { min: 0, max: 140 },
        elbow: { min: 0, max: 160 },
        shoulder: { min: 0, max: 180 },
        hip: { min: 0, max: 120 },
        ankle: { min: 0, max: 70 }
      },
      autoGenerateReports: true,
      compareToBaseline: true,
      highlightAbnormalities: true
    });
    
    setVisualizationSettings({
      showSkeleton: true,
      showLabels: true,
      showAngles: true,
      lineThickness: 2,
      colorScheme: 'default'
    });
    
    toast.info('Settings Reset', {
      description: 'All settings have been reset to default values'
    });
  };
  
  // Handle exporting settings as JSON
  const handleExportSettings = () => {
    const settings = {
      detection: detectionSettings,
      analysis: analysisSettings,
      visualization: visualizationSettings
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `motion-analysis-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Settings Exported', {
      description: 'Your settings have been exported as a JSON file'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Motion Analysis Configuration</h3>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Defaults
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportSettings}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Settings
          </Button>
          <Button 
            onClick={handleSaveSettings}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detection" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Detection Settings</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analysis Parameters</span>
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M12 3v4"></path>
              <path d="M18 12h-4"></path>
              <path d="M12 21v-4"></path>
              <path d="M6 12h4"></path>
              <path d="M19 5l-3 3"></path>
              <path d="M5 19l3-3"></path>
              <path d="M19 19l-3-3"></path>
              <path d="M5 5l3 3"></path>
            </svg>
            <span>Visualization</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="detection">
          <Card>
            <CardHeader>
              <CardTitle>Motion Detection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confidenceThreshold">
                      Confidence Threshold: {detectionSettings.confidenceThreshold}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {detectionSettings.confidenceThreshold < 0.4 ? 'Low' : 
                       detectionSettings.confidenceThreshold < 0.7 ? 'Medium' : 'High'}
                    </span>
                  </div>
                  <Slider 
                    id="confidenceThreshold"
                    min={0.1} 
                    max={0.9} 
                    step={0.05} 
                    value={[detectionSettings.confidenceThreshold]}
                    onValueChange={([value]) => handleDetectionSettingChange('confidenceThreshold', value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values provide more accurate detections but may miss some poses.
                    Lower values detect more poses but may include false positives.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smoothingFactor">
                      Smoothing Factor: {detectionSettings.smoothingFactor}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {detectionSettings.smoothingFactor < 0.3 ? 'Minimal' : 
                       detectionSettings.smoothingFactor < 0.7 ? 'Moderate' : 'Maximum'}
                    </span>
                  </div>
                  <Slider 
                    id="smoothingFactor"
                    min={0} 
                    max={1} 
                    step={0.1} 
                    value={[detectionSettings.smoothingFactor]}
                    onValueChange={([value]) => handleDetectionSettingChange('smoothingFactor', value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls how much smoothing is applied to reduce jitter in joint positions.
                    Higher values give smoother results but may introduce lag.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="frameSkip">
                      Frame Skip: {detectionSettings.frameSkip}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      Process 1/{detectionSettings.frameSkip} frames
                    </span>
                  </div>
                  <Slider 
                    id="frameSkip"
                    min={1} 
                    max={5} 
                    step={1} 
                    value={[detectionSettings.frameSkip]}
                    onValueChange={([value]) => handleDetectionSettingChange('frameSkip', value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    How many frames to skip between processing. Higher values improve performance
                    but reduce temporal resolution.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableAdvancedTracking"
                    checked={detectionSettings.enableAdvancedTracking}
                    onCheckedChange={(checked) => handleDetectionSettingChange('enableAdvancedTracking', checked)}
                  />
                  <Label htmlFor="enableAdvancedTracking">Enable advanced tracking</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modelType">Model Type</Label>
                  <RadioGroup 
                    id="modelType" 
                    value={detectionSettings.modelType}
                    onValueChange={(value) => handleDetectionSettingChange('modelType', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="modelType-default" />
                      <Label htmlFor="modelType-default">Default (Balanced)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fast" id="modelType-fast" />
                      <Label htmlFor="modelType-fast">Fast (Lower accuracy, better performance)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accurate" id="modelType-accurate" />
                      <Label htmlFor="modelType-accurate">Accurate (Higher accuracy, slower)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Range of Motion Thresholds</h4>
                <div className="space-y-6">
                  {Object.entries(analysisSettings.rangeOfMotionThresholds).map(([joint, { min, max }]) => (
                    <div key={joint} className="space-y-2">
                      <Label className="capitalize">{joint} Joint</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Minimum Angle</span>
                            <span className="text-sm font-medium">{min}°</span>
                          </div>
                          <Slider 
                            min={0} 
                            max={90} 
                            step={5} 
                            value={[min]}
                            onValueChange={([value]) => handleAnalysisThresholdChange(joint, 'min', value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Maximum Angle</span>
                            <span className="text-sm font-medium">{max}°</span>
                          </div>
                          <Slider 
                            min={90} 
                            max={180} 
                            step={5} 
                            value={[max]}
                            onValueChange={([value]) => handleAnalysisThresholdChange(joint, 'max', value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-4">Analysis Options</h4>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autoGenerateReports"
                    checked={analysisSettings.autoGenerateReports}
                    onCheckedChange={(checked) => handleAnalysisBooleanChange('autoGenerateReports', checked)}
                  />
                  <Label htmlFor="autoGenerateReports">
                    Auto-generate reports after each session
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="compareToBaseline"
                    checked={analysisSettings.compareToBaseline}
                    onCheckedChange={(checked) => handleAnalysisBooleanChange('compareToBaseline', checked)}
                  />
                  <Label htmlFor="compareToBaseline">
                    Compare measurements to patient baseline
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="highlightAbnormalities"
                    checked={analysisSettings.highlightAbnormalities}
                    onCheckedChange={(checked) => handleAnalysisBooleanChange('highlightAbnormalities', checked)}
                  />
                  <Label htmlFor="highlightAbnormalities">
                    Highlight abnormal measurements in reports
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Visualization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="showSkeleton"
                    checked={visualizationSettings.showSkeleton}
                    onCheckedChange={(checked) => handleVisualizationSettingChange('showSkeleton', checked)}
                  />
                  <Label htmlFor="showSkeleton">Show skeleton overlay</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="showLabels"
                    checked={visualizationSettings.showLabels}
                    onCheckedChange={(checked) => handleVisualizationSettingChange('showLabels', checked)}
                  />
                  <Label htmlFor="showLabels">Show joint labels</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="showAngles"
                    checked={visualizationSettings.showAngles}
                    onCheckedChange={(checked) => handleVisualizationSettingChange('showAngles', checked)}
                  />
                  <Label htmlFor="showAngles">Show angle measurements</Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lineThickness">
                      Line Thickness: {visualizationSettings.lineThickness}
                    </Label>
                  </div>
                  <Slider 
                    id="lineThickness"
                    min={1} 
                    max={5} 
                    step={0.5} 
                    value={[visualizationSettings.lineThickness]}
                    onValueChange={([value]) => handleVisualizationSettingChange('lineThickness', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Color Scheme</Label>
                  <RadioGroup 
                    id="colorScheme" 
                    value={visualizationSettings.colorScheme}
                    onValueChange={(value) => handleVisualizationSettingChange('colorScheme', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="colorScheme-default" />
                      <Label htmlFor="colorScheme-default">Default</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="highContrast" id="colorScheme-highContrast" />
                      <Label htmlFor="colorScheme-highContrast">High Contrast</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="anatomical" id="colorScheme-anatomical" />
                      <Label htmlFor="colorScheme-anatomical">Anatomical</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MotionAnalysisSettings;
