
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock data
const mockPatient = {
  name: "Sarah Johnson",
  age: 42,
  gender: "Female",
  biomarkers: [
    {
      id: "bm1",
      name: "Blood Pressure",
      current: 120,
      target: 120,
      unit: "mmHg",
      history: [115, 118, 125, 120, 119]
    },
    {
      id: "bm2",
      name: "Heart Rate",
      current: 72,
      target: 75,
      unit: "bpm",
      history: [70, 75, 68, 72, 73]
    }
  ],
  symptoms: [
    { id: "s1", date: new Date("2023-05-10"), name: "Back Pain", severity: 7 },
    { id: "s2", date: new Date("2023-05-15"), name: "Back Pain", severity: 5 },
    { id: "s3", date: new Date("2023-05-20"), name: "Back Pain", severity: 3 }
  ],
  anatomicalMappings: [
    {
      id: "map1",
      region: "lower_back",
      issues: ["Disc degeneration", "Muscle strain"],
      connectedBiomarkers: ["bm1"]
    }
  ],
  reports: [
    {
      id: "r1",
      date: new Date("2023-05-01"),
      title: "Initial Assessment",
      doctor: "Dr. James Wilson",
      summary: "Patient presents with lower back pain..."
    }
  ],
  analyses: [
    {
      id: "a1",
      date: new Date("2023-05-05"),
      title: "Pain Analysis",
      content: "Analysis shows correlation between..."
    }
  ]
};

interface MedicalDataContextType {
  patient: typeof mockPatient;
  isLoading: boolean;
}

const MedicalDataContext = createContext<MedicalDataContextType>({
  patient: mockPatient,
  isLoading: false
});

export const useMedicalData = () => useContext(MedicalDataContext);

interface MedicalDataProviderProps {
  children: ReactNode;
}

export const MedicalDataProvider: React.FC<MedicalDataProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    patient: mockPatient,
    isLoading
  };

  return (
    <MedicalDataContext.Provider value={value}>
      {children}
    </MedicalDataContext.Provider>
  );
};
