
import React, { useEffect, useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Patient {
  id: string;
  name: string;
  email?: string;
}

interface PatientSelectorProps {
  onSelect: (patientId: string) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ onSelect }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Mock data for development
        const mockPatients = [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          { id: '3', name: 'Michael Johnson', email: 'michael@example.com' },
        ];
        
        setPatients(mockPatients);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSelectPatient = (patientId: string) => {
    onSelect(patientId);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Select Patient</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <>
            <Select onValueChange={handleSelectPatient}>
              <SelectTrigger>
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

export default PatientSelector;
