
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveExerciseSession } from '@/services/exerciseSessionService';
import { JointAngle, ExerciseSession } from './types';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PatientExerciseFormProps {
  onSuccess?: () => void;
  angles: JointAngle[];
}

const PatientExerciseForm: React.FC<PatientExerciseFormProps> = ({ onSuccess, angles }) => {
  const [patientId, setPatientId] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleSaveSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!patientId) {
      setError('Please enter a patient ID');
      return;
    }
    
    if (!exerciseType) {
      setError('Please select an exercise type');
      return;
    }
    
    if (angles.length === 0) {
      setError('No joint angles detected. Please ensure tracking is active.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const sessionData: ExerciseSession = {
        patient_id: patientId,
        exercise_type: exerciseType,
        timestamp: new Date().toISOString(),
        angles: angles,
        notes: notes || undefined
      };
      
      await saveExerciseSession(sessionData);
      
      toast.success('Exercise session saved successfully');
      setSuccess(true);
      
      // Clear form after a short delay
      setTimeout(() => {
        setPatientId('');
        setExerciseType('');
        setNotes('');
        setSuccess(false);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (error) {
      console.error('Failed to save session:', error);
      setError('Failed to save exercise session. Please try again.');
      toast.error('Failed to save exercise session');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Session Details</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 border-green-500 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Session saved successfully!</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSaveSession} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-id">Patient ID</Label>
            <Input
              id="patient-id"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
              disabled={isSaving || success}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exercise-type">Exercise Type</Label>
            <Select 
              value={exerciseType} 
              onValueChange={setExerciseType}
              disabled={isSaving || success}
            >
              <SelectTrigger id="exercise-type">
                <SelectValue placeholder="Select exercise type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shoulder_flexion">Shoulder Flexion</SelectItem>
                <SelectItem value="knee_extension">Knee Extension</SelectItem>
                <SelectItem value="hip_abduction">Hip Abduction</SelectItem>
                <SelectItem value="elbow_flexion">Elbow Flexion</SelectItem>
                <SelectItem value="squat">Squat</SelectItem>
                <SelectItem value="lunge">Lunge</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add session notes"
              rows={3}
              disabled={isSaving || success}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {angles.length} joint angles detected
            </div>
            
            <Button 
              type="submit" 
              className="w-1/2" 
              disabled={isSaving || success || !angles.length}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                'Save Exercise Session'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientExerciseForm;
