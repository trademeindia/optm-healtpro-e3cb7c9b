
import React, { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  PatientListHeader,
  PatientSearch,
  PatientTableHeader,
  PatientTableRow,
  PatientsTable,
  PaginationFooter
} from './patients-list';
import { PatientStatistics } from './PatientStatistics';
import { Patient } from '../types';

interface PatientsListProps {
  patients: Patient[];
  onViewPatient: (patientId: number) => void;
}

export const PatientsList: React.FC<PatientsListProps> = ({
  patients,
  onViewPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'condition'>('lastVisit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const queryClient = useQueryClient();

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.icdCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  // Sort patients based on sort criteria
  const sortedPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'lastVisit') {
        // Parse dates for comparison
        const dateA = new Date(a.lastVisit).getTime();
        const dateB = new Date(b.lastVisit).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc' 
          ? a.condition.localeCompare(b.condition) 
          : b.condition.localeCompare(a.condition);
      }
    });
  }, [filteredPatients, sortBy, sortDirection]);

  // Handle sorting changes
  const handleSort = (column: 'name' | 'lastVisit' | 'condition') => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Force refresh patient data every 60 seconds to ensure sync
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }, 60000);
    
    return () => clearInterval(interval);
  }, [queryClient]);

  // Sync notification when patient data updates
  useEffect(() => {
    const syncData = async () => {
      try {
        await queryClient.fetchQuery({ queryKey: ['patients'] });
        toast.success("Patient data synchronized", {
          description: "Latest patient information has been loaded",
          duration: 3000
        });
      } catch (error) {
        console.error("Error syncing patient data:", error);
      }
    };

    // Initial sync when component mounts
    syncData();
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <PatientStatistics patients={patients} />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <PatientListHeader />
        
        <div className="p-5">
          <PatientSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          
          <PatientsTable>
            <PatientTableHeader 
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            
            <tbody>
              {sortedPatients.length > 0 ? (
                sortedPatients.map(patient => (
                  <PatientTableRow 
                    key={patient.id}
                    patient={patient}
                    onViewPatient={onViewPatient}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No patients found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </PatientsTable>
          
          <PaginationFooter 
            totalCount={patients.length} 
            filteredCount={filteredPatients.length} 
          />
        </div>
      </div>
    </div>
  );
};
