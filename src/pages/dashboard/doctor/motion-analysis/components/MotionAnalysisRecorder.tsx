
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { JointAngle, MotionAnalysisSession } from '@/types/motion-analysis';

interface MotionAnalysisRecorderProps {
  patientId?: string;
  onSessionCreated?: () => void;
}

const MotionAnalysisRecorder: React.FC<MotionAnalysisRecorderProps> = ({ patientId, onSessionCreated }) => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("Squat");
  const [customType, setCustomType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAngles, setRecordedAngles] = useState<JointAngle[]>([]);
  const [targetJoints, setTargetJoints] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  React.useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // Mock patient data for development
        const mockPatients = [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Smith' },
          { id: '3', name: 'Michael Johnson' },
        ];
        
        setPatients(mockPatients);

        // If patientId is provided, select that patient
        if (patientId) {
          const patient = mockPatients.find((p) => p.id === patientId);
          if (patient) {
            setSelectedPatient({ id: patient.id, name: patient.name });
          }
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [user, patientId]);

  const handleSelectPatient = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setSelectedPatient({ id: patient.id, name: patient.name });
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedAngles([]);
    startTimeRef.current = Date.now();
    setRecordingDuration(0);

    timerRef.current = setInterval(() => {
      setRecordingDuration((prevDuration) => prevDuration + 1);
    }, 1000);
    
    // Simulate joint angle detection
    const simulateAngleDetection = setInterval(() => {
      const joints = ['knee', 'hip', 'ankle', 'shoulder', 'elbow', 'wrist'];
      const targetJoint = targetJoints.length > 0 
        ? targetJoints[Math.floor(Math.random() * targetJoints.length)] 
        : joints[Math.floor(Math.random() * joints.length)];
      
      const randomAngle = Math.floor(Math.random() * 180);
      
      handleAngleDetected(targetJoint, randomAngle);
    }, 1000);
    
    // Store the simulation interval for cleanup
    (window as any).simulationInterval = simulateAngleDetection;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Clear the simulation interval
    if ((window as any).simulationInterval) {
      clearInterval((window as any).simulationInterval);
    }
  };

  const handleAngleDetected = (joint: string, angle: number) => {
    if (isRecording) {
      setRecordedAngles((prevAngles) => [
        ...prevAngles,
        {
          joint: joint,
          angle: angle,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const handleToggleJoint = (joint: string) => {
    setTargetJoints((prevJoints) => {
      if (prevJoints.includes(joint)) {
        return prevJoints.filter((j) => j !== joint);
      } else {
        return [...prevJoints, joint];
      }
    });
  };

  const resetForm = () => {
    setSelectedType("Squat");
    setCustomType("");
    setNotes("");
    setIsRecording(false);
    setRecordedAngles([]);
    setTargetJoints([]);
    setRecordingDuration(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Clear the simulation interval
    if ((window as any).simulationInterval) {
      clearInterval((window as any).simulationInterval);
    }
  };

  const submitSession = async () => {
    if (!selectedPatient || !user) {
      toast({
        title: "Error",
        description: "Missing patient or doctor information",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the session record
      const session: MotionAnalysisSession = {
        id: Math.random().toString(36).substring(2, 9), // Generate a random ID
        type: selectedType,
        status: "completed",
        patientId: selectedPatient.id,
        doctorId: user.id,
        notes: notes,
        customType: selectedType === "Other" ? customType : undefined,
        jointAngles: recordedAngles,
        measurementDate: new Date().toISOString(),
        targetJoints: targetJoints,
        duration: recordingDuration
      };
      
      // In a production app, we would save to Supabase here
      console.log('Session data to be saved:', session);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Motion analysis session recorded successfully",
      });

      // Reset the form
      resetForm();
      
      // Notify parent component
      if (onSessionCreated) {
        onSessionCreated();
      }
    } catch (err) {
      console.error('Error saving motion analysis session:', err);
      toast({
        title: "Error",
        description: "Failed to save the motion analysis session",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record New Session</CardTitle>
        <CardDescription>Start a new motion analysis session for a patient</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <>
            <div className="grid gap-2">
              <Label htmlFor="patient">Patient</Label>
              <Select onValueChange={handleSelectPatient}>
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={setSelectedType} defaultValue={selectedType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Squat">Squat</SelectItem>
                  <SelectItem value="Lunge">Lunge</SelectItem>
                  <SelectItem value="Push-up">Push-up</SelectItem>
                  <SelectItem value="Plank">Plank</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedType === "Other" && (
              <div className="grid gap-2">
                <Label htmlFor="customType">Custom Type</Label>
                <Input
                  id="customType"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Session notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Target Joints</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Switch id="knee" checked={targetJoints.includes("knee")} onCheckedChange={() => handleToggleJoint("knee")} />
                  <Label htmlFor="knee">Knee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="hip" checked={targetJoints.includes("hip")} onCheckedChange={() => handleToggleJoint("hip")} />
                  <Label htmlFor="hip">Hip</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="ankle" checked={targetJoints.includes("ankle")} onCheckedChange={() => handleToggleJoint("ankle")} />
                  <Label htmlFor="ankle">Ankle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="shoulder" checked={targetJoints.includes("shoulder")} onCheckedChange={() => handleToggleJoint("shoulder")} />
                  <Label htmlFor="shoulder">Shoulder</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="elbow" checked={targetJoints.includes("elbow")} onCheckedChange={() => handleToggleJoint("elbow")} />
                  <Label htmlFor="elbow">Elbow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="wrist" checked={targetJoints.includes("wrist")} onCheckedChange={() => handleToggleJoint("wrist")} />
                  <Label htmlFor="wrist">Wrist</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Recording Duration: {recordingDuration} seconds</span>
              {isRecording ? (
                <Button variant="destructive" onClick={handleStopRecording}>
                  Stop Recording
                </Button>
              ) : (
                <Button onClick={handleStartRecording} disabled={!selectedPatient}>
                  Start Recording
                </Button>
              )}
            </div>

            <Button onClick={submitSession} disabled={isSubmitting || recordedAngles.length === 0} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Session"}
            </Button>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {!isLoading && patients.length === 0 && !error && (
              <p className="text-yellow-500 text-sm mt-2">
                No patients found. Please add patients first.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MotionAnalysisRecorder;
