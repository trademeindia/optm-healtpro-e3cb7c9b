
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { SelectedPatient } from '@/pages/dashboard/doctor/motion-analysis';

interface PatientSelectorProps {
  selectedPatient: SelectedPatient | null;
  onSelectPatient: (patient: SelectedPatient | null) => void;
  className?: string;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ 
  selectedPatient, 
  onSelectPatient,
  className
}) => {
  const [patients, setPatients] = useState<SelectedPatient[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPatients() {
      try {
        // In a real app, this would fetch from the database
        // For demo purposes, we'll use mock data
        const mockPatients = [
          { id: 'patient-1', name: 'Alex Johnson', avatar: '/lovable-uploads/6c831c22-d881-442c-88a6-7800492132b4.png' },
          { id: 'patient-2', name: 'Sarah Davis', avatar: '/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png' },
          { id: 'patient-3', name: 'Miguel Rodriguez', avatar: '/lovable-uploads/a6f71747-46dd-486d-97a5-2e263119b969.png' },
          { id: 'patient-4', name: 'Emma Wilson', avatar: '/lovable-uploads/49a33513-51a5-4cbb-b210-a6308cfa91bf.png' },
        ];
        
        setPatients(mockPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPatients();
  }, []);
  
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(p => p.id === patientId) || null;
    onSelectPatient(selectedPatient);
  };
  
  return (
    <Select
      value={selectedPatient?.id}
      onValueChange={handlePatientChange}
      disabled={loading}
    >
      <SelectTrigger className={cn("w-[200px]", className)}>
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
  );
};

export default PatientSelector;
