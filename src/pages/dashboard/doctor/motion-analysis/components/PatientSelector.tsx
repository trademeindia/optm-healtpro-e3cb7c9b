
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
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

export default function PatientSelector({ onSelect }: PatientSelectorProps) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch patients from profiles table where role is 'patient'
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email')
          .eq('role', 'patient');

        if (error) throw error;

        setPatients(data || []);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

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
}
