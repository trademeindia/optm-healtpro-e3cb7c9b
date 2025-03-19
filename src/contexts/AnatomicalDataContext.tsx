import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthIssue, MuscleFlexion } from '@/components/patient-dashboard/anatomical-map/types';
import { useAnatomicalMap } from '@/components/patient-dashboard/anatomical-map/hooks/useAnatomicalMap';
import { SymptomEntry, useSymptoms } from '@/contexts/SymptomContext';

type AnatomicalDataContextType = {
  healthIssues: HealthIssue[];
  muscleFlexionData: MuscleFlexion[];
  selectedIssue: HealthIssue | null;
  setSelectedIssue: (issue: HealthIssue | null) => void;
  handleIssueClick: (issue: HealthIssue) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  isLoaded: boolean;
  syncWithSymptoms: () => void;
};

const AnatomicalDataContext = createContext<AnatomicalDataContextType | undefined>(undefined);

export const AnatomicalDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { 
    healthIssues: initialHealthIssues, 
    muscleFlexionData,
    selectedIssue: initialSelectedIssue,
    handleIssueClick: initialHandleIssueClick,
    zoom: initialZoom,
    isLoaded: initialIsLoaded
  } = useAnatomicalMap();

  const { symptoms, addSymptom } = useSymptoms();
  
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(initialHealthIssues);
  const [selectedIssue, setSelectedIssue] = useState<HealthIssue | null>(initialSelectedIssue);
  const [zoom, setZoom] = useState(initialZoom);
  const [isLoaded, setIsLoaded] = useState(initialIsLoaded);

  // Keep health issues in sync with the data from useAnatomicalMap
  useEffect(() => {
    setHealthIssues(initialHealthIssues);
    setIsLoaded(initialIsLoaded);
  }, [initialHealthIssues, initialIsLoaded]);

  // Handle issue click
  const handleIssueClick = (issue: HealthIssue) => {
    setSelectedIssue(prev => prev?.id === issue.id ? null : issue);
    initialHandleIssueClick(issue);
  };

  // Convert health issues to symptoms for syncing with the symptom context
  const syncWithSymptoms = () => {
    healthIssues.forEach(issue => {
      // Check if symptom already exists
      const existingSymptom = symptoms.find(s => 
        s.symptomName === issue.name && 
        s.location === `anatomical-${issue.id}`
      );
      
      if (!existingSymptom) {
        const newSymptom: SymptomEntry = {
          id: `anatomical-${issue.id}`,
          date: new Date(),
          symptomName: issue.name,
          painLevel: issue.severity === 'high' ? 8 : issue.severity === 'medium' ? 5 : 3,
          location: `anatomical-${issue.id}`,
          notes: issue.description || '',
        };
        
        addSymptom(newSymptom);
      }
    });
  };

  return (
    <AnatomicalDataContext.Provider 
      value={{
        healthIssues,
        muscleFlexionData,
        selectedIssue,
        setSelectedIssue,
        handleIssueClick,
        zoom,
        setZoom,
        isLoaded,
        syncWithSymptoms
      }}
    >
      {children}
    </AnatomicalDataContext.Provider>
  );
};

export const useAnatomicalData = () => {
  const context = useContext(AnatomicalDataContext);
  if (context === undefined) {
    throw new Error('useAnatomicalData must be used within an AnatomicalDataProvider');
  }
  return context;
};
