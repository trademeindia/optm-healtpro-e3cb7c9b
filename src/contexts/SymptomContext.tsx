
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SymptomRecord } from '@/types/medicalData';

interface SymptomContextType {
  symptoms: SymptomRecord[];
  isLoading: boolean;
  addSymptom: (symptom: Omit<SymptomRecord, 'id'>) => void;
  updateSymptom: (id: string, symptom: Partial<SymptomRecord>) => void;
  deleteSymptom: (id: string) => void;
}

const SymptomContext = createContext<SymptomContextType>({
  symptoms: [],
  isLoading: false,
  addSymptom: () => {},
  updateSymptom: () => {},
  deleteSymptom: () => {}
});

export const useSymptoms = () => useContext(SymptomContext);

interface SymptomProviderProps {
  children: ReactNode;
}

export const SymptomProvider: React.FC<SymptomProviderProps> = ({ children }) => {
  const [symptoms, setSymptoms] = useState<SymptomRecord[]>([
    { 
      id: "s1", 
      symptomName: "Back Pain", 
      severity: 7, 
      timestamp: new Date("2023-05-10").toISOString(),
      relatedBiomarkers: ["bm1"]
    },
    { 
      id: "s2", 
      symptomName: "Back Pain", 
      severity: 5, 
      timestamp: new Date("2023-05-15").toISOString(),
      relatedBiomarkers: ["bm1"]
    },
    { 
      id: "s3", 
      symptomName: "Back Pain", 
      severity: 3, 
      timestamp: new Date("2023-05-20").toISOString(),
      relatedBiomarkers: ["bm1"]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addSymptom = (symptom: Omit<SymptomRecord, 'id'>) => {
    setIsLoading(true);
    try {
      const newSymptom: SymptomRecord = {
        ...symptom,
        id: `symptom-${Date.now()}`
      };
      setSymptoms(prev => [...prev, newSymptom]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSymptom = (id: string, symptom: Partial<SymptomRecord>) => {
    setIsLoading(true);
    try {
      setSymptoms(prev => prev.map(s => 
        s.id === id ? { ...s, ...symptom } : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSymptom = (id: string) => {
    setIsLoading(true);
    try {
      setSymptoms(prev => prev.filter(s => s.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SymptomContext.Provider value={{
      symptoms,
      isLoading,
      addSymptom,
      updateSymptom,
      deleteSymptom
    }}>
      {children}
    </SymptomContext.Provider>
  );
};
