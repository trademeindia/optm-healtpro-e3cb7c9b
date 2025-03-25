
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the symptom type to match what's used in the components
export type SymptomEntry = {
  id: string;
  date: Date;
  symptomName: string;
  painLevel: number;
  location: string;
  notes: string;
  patientId?: number;
};

type SymptomContextType = {
  symptoms: SymptomEntry[];
  addSymptom: (symptom: SymptomEntry) => void;
  updateSymptom: (id: string, updates: Partial<SymptomEntry>) => void;
  deleteSymptom: (id: string) => void; // Added deleteSymptom function
  loadPatientSymptoms: (patientId: number) => void;
  currentPatientId: number | null;
};

const SymptomContext = createContext<SymptomContextType | undefined>(undefined);

// Sample symptoms for different patients
const patientSymptoms: Record<number, SymptomEntry[]> = {
  1: [
    {
      id: '1',
      date: new Date('2023-06-10'),
      symptomName: 'Shoulder Pain',
      painLevel: 7,
      location: 'rightShoulder',
      notes: 'Pain increases during movement and lifting objects',
      patientId: 1
    },
    {
      id: '2',
      date: new Date('2023-06-12'),
      symptomName: 'Lower Back Pain',
      painLevel: 5,
      location: 'lowerBack',
      notes: 'Dull ache that worsens after sitting for long periods',
      patientId: 1
    },
    {
      id: '3',
      date: new Date('2023-06-14'),
      symptomName: 'Headache',
      painLevel: 3,
      location: 'head',
      notes: 'Mild throbbing pain, reduced after medication',
      patientId: 1
    }
  ],
  2: [
    {
      id: '4',
      date: new Date('2023-05-20'),
      symptomName: 'Knee Pain',
      painLevel: 6,
      location: 'leftKnee',
      notes: 'Sharp pain when walking up stairs',
      patientId: 2
    },
    {
      id: '5',
      date: new Date('2023-05-25'),
      symptomName: 'Neck Stiffness',
      painLevel: 4,
      location: 'neck',
      notes: 'Difficulty turning head to the left',
      patientId: 2
    }
  ],
  3: [
    {
      id: '6',
      date: new Date('2023-06-01'),
      symptomName: 'Abdominal Pain',
      painLevel: 8,
      location: 'abdomen',
      notes: 'Severe cramping after meals',
      patientId: 3
    },
    {
      id: '7',
      date: new Date('2023-06-02'),
      symptomName: 'Joint Pain',
      painLevel: 7,
      location: 'rightElbow',
      notes: 'Swelling and tenderness',
      patientId: 3
    },
    {
      id: '8',
      date: new Date('2023-06-03'),
      symptomName: 'Ankle Pain',
      painLevel: 5,
      location: 'rightAnkle',
      notes: 'Pain during weight-bearing activities',
      patientId: 3
    }
  ]
};

// Default symptoms for when no patient is selected
const defaultSymptoms = [
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
];

export const SymptomProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(defaultSymptoms);
  const [currentPatientId, setCurrentPatientId] = useState<number | null>(null);

  const addSymptom = (symptom: SymptomEntry) => {
    setSymptoms(prev => [symptom, ...prev]);
  };

  const updateSymptom = (id: string, updates: Partial<SymptomEntry>) => {
    setSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === id ? { ...symptom, ...updates } : symptom
      )
    );
  };

  const deleteSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(symptom => symptom.id !== id));
  };

  const loadPatientSymptoms = (patientId: number) => {
    console.log(`Loading symptoms for patient ${patientId}`);
    setCurrentPatientId(patientId);
    
    if (patientSymptoms[patientId]) {
      setSymptoms(patientSymptoms[patientId]);
    } else {
      // If no symptoms are found for this patient, set empty array
      setSymptoms([]);
    }
  };

  // Listen for changes to currentPatientId and update symptoms accordingly
  useEffect(() => {
    if (currentPatientId !== null && patientSymptoms[currentPatientId]) {
      setSymptoms(patientSymptoms[currentPatientId]);
    } else if (currentPatientId === null) {
      setSymptoms(defaultSymptoms);
    }
  }, [currentPatientId]);

  return (
    <SymptomContext.Provider value={{ symptoms, addSymptom, updateSymptom, deleteSymptom, loadPatientSymptoms, currentPatientId }}>
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
