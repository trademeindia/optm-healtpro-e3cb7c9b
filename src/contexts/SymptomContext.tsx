
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SymptomEntry {
  id: string;
  date: Date;
  symptomName: string;
  painLevel: number;
  location: string;
  notes?: string;
}

interface SymptomContextProps {
  symptoms: SymptomEntry[];
  addSymptom: (symptom: SymptomEntry) => void;
  removeSymptom: (id: string) => void;
  updateSymptom: (id: string, updatedSymptom: Partial<SymptomEntry>) => void;
}

const SymptomContext = createContext<SymptomContextProps>({
  symptoms: [],
  addSymptom: () => {},
  removeSymptom: () => {},
  updateSymptom: () => {},
});

export const useSymptoms = () => useContext(SymptomContext);

interface SymptomProviderProps {
  children: ReactNode;
}

export const SymptomProvider: React.FC<SymptomProviderProps> = ({ children }) => {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([
    {
      id: '1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      symptomName: 'Lower Back Pain',
      painLevel: 7,
      location: 'lower_back',
      notes: 'Pain worse in the morning',
    },
    {
      id: '2',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      symptomName: 'Lower Back Pain',
      painLevel: 5,
      location: 'lower_back',
      notes: 'Getting better after exercises',
    },
    {
      id: '3',
      date: new Date(), // Today
      symptomName: 'Lower Back Pain',
      painLevel: 3,
      location: 'lower_back',
      notes: 'Continued improvement',
    }
  ]);

  const addSymptom = (symptom: SymptomEntry) => {
    setSymptoms(prev => [...prev, symptom]);
  };

  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(symptom => symptom.id !== id));
  };

  const updateSymptom = (id: string, updatedSymptom: Partial<SymptomEntry>) => {
    setSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === id ? { ...symptom, ...updatedSymptom } : symptom
      )
    );
  };

  const value = {
    symptoms,
    addSymptom,
    removeSymptom,
    updateSymptom,
  };

  return (
    <SymptomContext.Provider value={value}>
      {children}
    </SymptomContext.Provider>
  );
};
