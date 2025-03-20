
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('doctors')
          .select('id, name, specialty, avatar_url');
        
        if (error) throw new Error(error.message);
        
        // Transform the data to match the Doctor interface
        const formattedDoctors: Doctor[] = data.map(doctor => ({
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          avatarUrl: doctor.avatar_url
        }));
        
        setDoctors(formattedDoctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch doctors'));
        
        // Use demo data if there's an error
        setDoctors([
          { id: 'doc-1', name: 'Dr. John Smith', specialty: 'Cardiology' },
          { id: 'doc-2', name: 'Dr. Sarah Johnson', specialty: 'Neurology' },
          { id: 'doc-3', name: 'Dr. Michael Chen', specialty: 'Orthopedics' },
          { id: 'doc-4', name: 'Dr. Emily Wilson', specialty: 'Pediatrics' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, isLoading, error };
}
