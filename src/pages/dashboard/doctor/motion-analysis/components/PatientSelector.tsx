
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Patient {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface PatientSelectorProps {
  onSelect: (patientId: string) => void;
}

// Mock patient data - in a real app this would come from your API
const mockPatients: Patient[] = [
  { id: '1', name: 'John Smith', avatarUrl: '/avatars/01.png' },
  { id: '2', name: 'Sarah Johnson', avatarUrl: '/avatars/02.png' },
  { id: '3', name: 'Michael Chen', avatarUrl: '/avatars/03.png' },
  { id: '4', name: 'Emma Rodriguez', avatarUrl: '/avatars/04.png' },
];

const PatientSelector: React.FC<PatientSelectorProps> = ({ onSelect }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    onSelect(patientId);
    
    const patient = mockPatients.find(p => p.id === patientId) || null;
    setSelectedPatient(patient);
  };

  // Auto-select first patient on mount (for demo purposes)
  useEffect(() => {
    if (mockPatients.length > 0 && !selectedPatientId) {
      handlePatientChange(mockPatients[0].id);
    }
  }, [selectedPatientId]);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Select Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          {selectedPatient && (
            <Avatar>
              <AvatarImage src={selectedPatient.avatarUrl} alt={selectedPatient.name} />
              <AvatarFallback>
                {selectedPatient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
          <Select value={selectedPatientId} onValueChange={handlePatientChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {mockPatients.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSelector;
