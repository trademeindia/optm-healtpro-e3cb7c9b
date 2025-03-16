
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MedicalReport, MedicalAnalysis, Biomarker, SymptomRecord, AnatomicalMapping } from '@/types/medicalData';

// Convert mock data to match the expected types
const mockPatient = {
  id: "patient-1",
  name: "Sarah Johnson",
  biomarkers: [
    {
      id: "bm1",
      name: "Blood Pressure",
      category: "Cardiovascular",
      description: "Measures the pressure of blood against the walls of arteries",
      latestValue: {
        value: 120,
        unit: "mmHg",
        normalRange: "90-120",
        status: "normal" as const,
        timestamp: new Date().toISOString()
      },
      historicalValues: [
        { value: 115, unit: "mmHg", normalRange: "90-120", status: "normal" as const, timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { value: 118, unit: "mmHg", normalRange: "90-120", status: "normal" as const, timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() }
      ],
      relatedSymptoms: ["Headache", "Dizziness"],
      affectedBodyParts: ["Heart", "Blood vessels"]
    },
    {
      id: "bm2",
      name: "Heart Rate",
      category: "Cardiovascular",
      description: "Number of heartbeats per minute",
      latestValue: {
        value: 72,
        unit: "bpm",
        normalRange: "60-100",
        status: "normal" as const,
        timestamp: new Date().toISOString()
      },
      historicalValues: [
        { value: 70, unit: "bpm", normalRange: "60-100", status: "normal" as const, timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { value: 75, unit: "bpm", normalRange: "60-100", status: "normal" as const, timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() }
      ],
      relatedSymptoms: ["Fatigue", "Shortness of breath"],
      affectedBodyParts: ["Heart"]
    }
  ],
  symptoms: [
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
  ],
  anatomicalMappings: [
    {
      bodyPart: "lower_back",
      coordinates: { x: 50, y: 60 },
      affectedBiomarkers: ["bm1"],
      severity: 7,
      notes: "Disc degeneration, Muscle strain"
    }
  ],
  reports: [
    {
      id: "r1",
      patientId: "patient-1",
      timestamp: new Date("2023-05-01").toISOString(),
      reportType: "assessment",
      content: "Patient presents with lower back pain...",
      source: "upload",
      analyzed: true,
      analysisId: "a1"
    }
  ],
  analyses: [
    {
      id: "a1",
      reportId: "r1",
      timestamp: new Date("2023-05-05").toISOString(),
      summary: "Analysis shows correlation between...",
      keyFindings: ["Finding 1", "Finding 2"],
      recommendations: ["Recommendation 1", "Recommendation 2"],
      extractedBiomarkers: []
    }
  ]
};

// Mock last analysis
const mockLastAnalysis: MedicalAnalysis = {
  id: "a1",
  reportId: "r1",
  timestamp: new Date("2023-05-05").toISOString(),
  summary: "Analysis shows correlation between...",
  keyFindings: ["Finding 1", "Finding 2"],
  recommendations: ["Recommendation 1", "Recommendation 2"],
  extractedBiomarkers: []
};

interface MedicalDataContextType {
  patient: typeof mockPatient;
  isLoading: boolean;
  processMedicalReport: (report: MedicalReport) => Promise<MedicalAnalysis | null>;
  lastAnalysis: MedicalAnalysis | null;
}

const MedicalDataContext = createContext<MedicalDataContextType>({
  patient: mockPatient,
  isLoading: false,
  processMedicalReport: async () => null,
  lastAnalysis: null
});

export const useMedicalData = () => useContext(MedicalDataContext);

interface MedicalDataProviderProps {
  children: ReactNode;
}

export const MedicalDataProvider: React.FC<MedicalDataProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<MedicalAnalysis | null>(mockLastAnalysis);

  // Add the missing processMedicalReport method
  const processMedicalReport = async (report: MedicalReport): Promise<MedicalAnalysis | null> => {
    setIsLoading(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock analysis result
      const analysis: MedicalAnalysis = {
        id: `analysis-${Date.now()}`,
        reportId: report.id,
        timestamp: new Date().toISOString(),
        summary: `AI analysis of ${report.reportType} report`,
        keyFindings: [
          "Normal biomarker values detected",
          "No significant health concerns identified"
        ],
        recommendations: [
          "Maintain current health regimen",
          "Follow up with healthcare provider in 6 months"
        ],
        extractedBiomarkers: [
          {
            name: "Cholesterol",
            value: "180",
            unit: "mg/dL",
            normalRange: "125-200",
            status: "normal"
          },
          {
            name: "Blood Pressure",
            value: "120/80",
            unit: "mmHg",
            normalRange: "90-120/60-80",
            status: "normal"
          }
        ]
      };
      
      setLastAnalysis(analysis);
      return analysis;
    } catch (error) {
      console.error("Error processing medical report:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    patient: mockPatient,
    isLoading,
    processMedicalReport,
    lastAnalysis
  };

  return (
    <MedicalDataContext.Provider value={value}>
      {children}
    </MedicalDataContext.Provider>
  );
};
