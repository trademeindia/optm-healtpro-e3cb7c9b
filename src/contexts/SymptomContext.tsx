
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the symptom type
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
  updateSymptom: (symptom: SymptomEntry) => void;
  deleteSymptom: (id: string) => void;
};

const SymptomContext = createContext<SymptomContextType | undefined>(undefined);

export const SymptomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([
    {
      id: '1',
      date: new Date('2023-06-10'),
      symptomName: 'Shoulder Pain',
      painLevel: 7,
      location: 'Right shoulder',
      notes: 'Pain increases during movement and lifting objects'
    },
    {
      id: '2',
      date: new Date('2023-06-12'),
      symptomName: 'Lower Back Pain',
      painLevel: 5,
      location: 'Lower back',
      notes: 'Dull ache that worsens after sitting for long periods'
    },
    {
      id: '3',
      date: new Date('2023-06-14'),
      symptomName: 'Headache',
      painLevel: 3,
      location: 'Temples and forehead',
      notes: 'Mild throbbing pain, reduced after medication'
    },
    {
      id: '4',
      date: new Date('2023-06-15'),
      symptomName: 'Neck Strain',
      painLevel: 4,
      location: 'Neck',
      notes: 'Mild tension in the trapezius muscle. Recommended: heat therapy and gentle stretching.'
    },
    {
      id: '5',
      date: new Date('2023-06-15'),
      symptomName: 'Hip Joint',
      painLevel: 3,
      location: 'Right hip',
      notes: 'Minor inflammation in the right hip joint. Continuing physical therapy exercises.'
    }
  ]);

  const addSymptom = (symptom: SymptomEntry) => {
    setSymptoms(prev => [symptom, ...prev]);
  };

  const updateSymptom = (updatedSymptom: SymptomEntry) => {
    setSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === updatedSymptom.id ? updatedSymptom : symptom
      )
    );
  };

  const deleteSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(symptom => symptom.id !== id));
  };

  return (
    <SymptomContext.Provider value={{ symptoms, addSymptom, updateSymptom, deleteSymptom }}>
      {children}
    </SymptomContext.Provider>
  );
};

export const useSymptomContext = () => {
  const context = useContext(SymptomContext);
  if (context === undefined) {
    throw new Error('useSymptomContext must be used within a SymptomProvider');
  }
  return context;
};
