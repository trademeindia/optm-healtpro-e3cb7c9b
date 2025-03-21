
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Server, TestTube, CheckCircle2, AlertTriangle } from 'lucide-react';

interface OpenSimSettings {
  apiUrl: string;
  apiKey: string;
  enableLiveAnalysis: boolean;
  simulationMode: boolean;
}

const OpenSimSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<OpenSimSettings>({
    apiUrl: import.meta.env.VITE_OPENSIM_API_URL || 'http://localhost:3001/api/opensim',
    apiKey: import.meta.env.VITE_OPENSIM_API_KEY || '',
    enableLiveAnalysis: true,
    simulationMode: true
  });
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: keyof OpenSimSettings) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const saveSettings = () => {
    // In a real app, these would be saved to a database or similar
    localStorage.setItem('opensim_settings', JSON.stringify(settings));
    
    // Update environment variables (this is just for display - actual env vars can't be modified at runtime)
    if (import.meta.env) {
      import.meta.env.VITE_OPENSIM_API_URL = settings.apiUrl;
      import.meta.env.VITE_OPENSIM_API_KEY = settings.apiKey;
    }
    
    toast.success('OpenSim settings saved successfully');
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Simulate an API call
      if (settings.simulationMode) {
        // Simulate success in simulation mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTestResult({
          success: true,
          message: 'Connection successful (Simulation Mode)'
        });
      } else {
        // In a real app, this would be an actual API call to OpenSim
        const response = await fetch(`${settings.apiUrl}/test-connection`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${settings.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setTestResult({
            success: true,
            message: 'Connection to OpenSim API successful'
          });
        } else {
          setTestResult({
            success: false,
            message: `Failed to connect: ${response.statusText}`
          });
        }
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">OpenSim API Configuration</h2>
        <div className="flex items-center gap-2">
          <Button onClick={testConnection} disabled={isTesting} variant="outline">
            <TestTube className="mr-2 h-4 w-4" />
            Test Connection
          </Button>
          <Button onClick={saveSettings}>
            <Server className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
      
      {testResult && (
        <Card className={testResult.success ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-red-500 bg-red-50 dark:bg-red-900/10"}>
          <CardContent className="pt-6 flex items-center gap-3">
            {testResult.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <p>{testResult.message}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Configure the connection to the OpenSim API server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API URL</Label>
              <Input 
                id="apiUrl" 
                name="apiUrl" 
                value={settings.apiUrl} 
                onChange={handleInputChange} 
                placeholder="https://api.opensim.example.com" 
              />
              <p className="text-xs text-muted-foreground">
                The base URL of the OpenSim API server
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input 
                id="apiKey" 
                name="apiKey" 
                value={settings.apiKey} 
                onChange={handleInputChange} 
                type="password" 
                placeholder="sk_opensim_xxxxx" 
              />
              <p className="text-xs text-muted-foreground">
                Your OpenSim API authentication key
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Settings</CardTitle>
            <CardDescription>
              Configure how the OpenSim integration behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableLiveAnalysis">Enable Live Analysis</Label>
                <p className="text-xs text-muted-foreground">
                  Perform biomechanical analysis during patient exercises
                </p>
              </div>
              <Switch 
                id="enableLiveAnalysis" 
                checked={settings.enableLiveAnalysis}
                onCheckedChange={() => handleToggleChange('enableLiveAnalysis')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="simulationMode">Simulation Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Use simulated responses when no API is available
                </p>
              </div>
              <Switch 
                id="simulationMode" 
                checked={settings.simulationMode}
                onCheckedChange={() => handleToggleChange('simulationMode')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>About OpenSim Integration</CardTitle>
          <CardDescription>
            What this feature provides for your practice
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p>
            OpenSim integration allows you to provide advanced biomechanical analysis to your patients, including:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Real-time joint force and angle monitoring</li>
            <li>Muscle activation pattern analysis</li>
            <li>Form assessment with specific recommendations</li>
            <li>Energy expenditure calculations</li>
            <li>Export to peer-reviewed biomechanical models</li>
          </ul>
          <p>
            Note: For production use, you will need to purchase an OpenSim API license and configure your own server.
            The simulation mode is provided for development and demonstration purposes only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenSimSettingsTab;
