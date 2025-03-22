
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

interface PatientExerciseFormProps {
  onSuccess?: () => void;
  angles: JointAngle[];
}

const PatientExerciseForm: React.FC<PatientExerciseFormProps> = ({ onSuccess, angles }) => {
  const [patientId, setPatientId] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const handleSaveSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!patientId) {
      toast.error('Please enter a patient ID');
      return;
    }
    
    if (!exerciseType) {
      toast.error('Please select an exercise type');
      return;
    }
    
    if (angles.length === 0) {
      toast.error('No joint angles detected. Please ensure tracking is active.');
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
      
      // Clear form
      setPatientId('');
      setExerciseType('');
      setNotes('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to save session:', error);
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
        <form onSubmit={handleSaveSession} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-id">Patient ID</Label>
            <Input
              id="patient-id"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exercise-type">Exercise Type</Label>
            <Select 
              value={exerciseType} 
              onValueChange={setExerciseType}
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
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSaving || !angles.length}
          >
            {isSaving ? 'Saving...' : 'Save Exercise Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientExerciseForm;
