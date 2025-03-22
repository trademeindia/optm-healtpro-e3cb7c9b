
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Mocked patient data for now - replace with actual API call
const MOCK_PATIENTS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Robert Johnson' },
];

interface PatientSelectorProps {
  onSelect: (patientId: string) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ onSelect }) => {
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real application, fetch patients from an API
    // For now, we'll use the mocked data
    if (patients.length > 0 && !selectedPatientId) {
      handleSelectPatient(patients[0].id);
    }
  }, []);

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    onSelect(patientId);
    
    toast({
      title: "Patient Selected",
      description: `Selected patient: ${patients.find(p => p.id === patientId)?.name}`,
      duration: 3000,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Select Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          onValueChange={handleSelectPatient} 
          value={selectedPatientId || undefined}
        >
          <SelectTrigger className="w-full">
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
      </CardContent>
    </Card>
  );
};

export default PatientSelector;
