
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MotionAnalysisSession } from '@/types/motion-analysis';
import { Video, StopCircle, Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MotionAnalysisRecorderProps {
  patientId: string;
  onSessionCreated: () => void;
}

// Define the type for joint angle data
interface JointAngle {
  joint: string;
  angle: number;
  timestamp: number;
}

const MotionAnalysisRecorder: React.FC<MotionAnalysisRecorderProps> = ({ patientId, onSessionCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [analysisType, setAnalysisType] = useState('gait');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    toast.info('Recording started');
    
    // In a real application, this would start capturing motion data
    // For this demo, we'll just increment the duration counter
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    // Store the timer ID in a ref so we can clear it later
    (window as any).motionTimerId = timer;
  };
  
  const stopRecording = () => {
    if ((window as any).motionTimerId) {
      clearInterval((window as any).motionTimerId);
    }
    
    setIsRecording(false);
    toast.info('Recording stopped');
  };
  
  const saveSession = async () => {
    if (duration === 0) {
      toast.error('No data recorded. Please record a session first.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real application, this would save the motion data to a database
      // For this demo, we'll just create a mock session object
      const session: MotionAnalysisSession = {
        id: `session-${Date.now()}`,
        patientId,
        type: analysisType,
        measurementDate: new Date().toISOString(),
        duration,
        notes,
        jointAngles: generateMockJointAngles(),
        status: 'completed'
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Session saved successfully');
      onSessionCreated();
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    } finally {
      setIsSaving(false);
    }
  };
  
  const generateMockJointAngles = (): JointAngle[] => {
    // Generate some mock joint angle data
    return [
      { joint: 'knee', angle: Math.random() * 30 + 80, timestamp: Date.now() },
      { joint: 'hip', angle: Math.random() * 20 + 100, timestamp: Date.now() },
      { joint: 'ankle', angle: Math.random() * 15 + 85, timestamp: Date.now() }
    ];
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Motion Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="analysis-type">Analysis Type</Label>
          <Select 
            value={analysisType} 
            onValueChange={setAnalysisType}
            disabled={isRecording}
          >
            <SelectTrigger id="analysis-type">
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gait">Gait Analysis</SelectItem>
              <SelectItem value="posture">Posture Assessment</SelectItem>
              <SelectItem value="range">Range of Motion</SelectItem>
              <SelectItem value="balance">Balance Assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between bg-muted p-4 rounded-md">
          <div>
            <p className="font-medium">Duration</p>
            <p className="text-2xl">{duration} seconds</p>
          </div>
          
          <div>
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button 
                onClick={stopRecording}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <StopCircle className="h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Session Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about this session..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            disabled={isRecording}
          />
        </div>
        
        <Button
          onClick={saveSession}
          disabled={isRecording || isSaving || duration === 0}
          className="w-full mt-4"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving Session...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MotionAnalysisRecorder;
