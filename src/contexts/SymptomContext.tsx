
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the symptom type to match what's used in the components
export type SymptomEntry = {
  id: string;
  date: Date;
  symptomName: string;
  painLevel: number;
  location: string;
  notes: string;
};

type SymptomContextType = {
  symptoms: SymptomEntry[];
  addSymptom: (symptom: SymptomEntry) => void;
};

const SymptomContext = createContext<SymptomContextType | undefined>(undefined);

export const SymptomProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([
    {
      id: '1',
      date: new Date('2023-06-10'),
      symptomName: 'Shoulder Pain',
      painLevel: 7,
      location: 'rightShoulder',
      notes: 'Pain increases during movement and lifting objects'
    },
    {
      id: '2',
      date: new Date('2023-06-12'),
      symptomName: 'Lower Back Pain',
      painLevel: 5,
      location: 'lowerBack',
      notes: 'Dull ache that worsens after sitting for long periods'
    },
    {
      id: '3',
      date: new Date('2023-06-14'),
      symptomName: 'Headache',
      painLevel: 3,
      location: 'head',
      notes: 'Mild throbbing pain, reduced after medication'
    }
  ]);

  const addSymptom = (symptom: SymptomEntry) => {
    setSymptoms(prev => [symptom, ...prev]);
  };

  return (
    <SymptomContext.Provider value={{ symptoms, addSymptom }}>
      {children}
    </SymptomContext.Provider>
  );
};

export const useSymptoms = () => {
  const context = useContext(SymptomContext);
  if (context === undefined) {
    throw new Error('useSymptoms must be used within a SymptomProvider');
  }
  return context;
};
