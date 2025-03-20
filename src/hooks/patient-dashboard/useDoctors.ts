
import { useState, useEffect } from 'react';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

// This would typically fetch data from an API in a real application
export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 'dr1',
      name: 'Emily Johnson',
      specialty: 'Orthopedic Surgeon',
      avatarUrl: ''
    },
    {
      id: 'dr2',
      name: 'Michael Chen',
      specialty: 'Physical Therapist',
      avatarUrl: ''
    },
    {
      id: 'dr3',
      name: 'Sarah Williams',
      specialty: 'Neurologist',
      avatarUrl: ''
    },
    {
      id: 'dr4',
      name: 'Robert Garcia',
      specialty: 'Cardiologist',
      avatarUrl: ''
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // Data is already set in the state above
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching doctors'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return {
    doctors,
    isLoading,
    error
  };
};
