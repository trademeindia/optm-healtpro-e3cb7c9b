
import { useState } from 'react';
import { 
  OptmPatientData,
  MusculoskeletalBiomarkers,
  MobilityMeasurements,
  ImagingData
} from '@/types/optm-health';

export const useOptmFormState = (initialData?: Partial<OptmPatientData>) => {
  const [activeTab, setActiveTab] = useState<string>('patient-info');
  
  const [patientData, setPatientData] = useState<Partial<OptmPatientData>>({
    patientId: initialData?.patientId || '',
    name: initialData?.name || '',
    age: initialData?.age || undefined,
    gender: initialData?.gender || undefined,
    treatmentStage: initialData?.treatmentStage || undefined,
    biomarkers: initialData?.biomarkers || {},
    anatomicalMeasurements: initialData?.anatomicalMeasurements || {},
    mobilityMeasurements: initialData?.mobilityMeasurements || {},
    imaging: initialData?.imaging || [],
    lastUpdated: initialData?.lastUpdated || new Date().toISOString()
  });
  
  // Patient Info changes
  const handlePatientInfoChange = (field: string, value: any) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Biomarker changes
  const handleBiomarkerChange = (marker: keyof MusculoskeletalBiomarkers, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    setPatientData(prev => {
      // Use empty object as fallback
      const biomarkers = prev.biomarkers || {};
      
      return {
        ...prev,
        biomarkers: {
          ...biomarkers,
          [marker]: numValue
        }
      };
    });
  };
  
  // Anatomical measurement changes
  const handleAnatomicalCtmChange = (value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    setPatientData(prev => {
      // Use empty object as fallback
      const anatomicalMeasurements = prev.anatomicalMeasurements || {};
      
      return {
        ...prev,
        anatomicalMeasurements: {
          ...anatomicalMeasurements,
          ctm: numValue
        }
      };
    });
  };
  
  const handleCircumferenceChange = (type: 'ccm' | 'cap' | 'cbp', index: number, field: string, value: any) => {
    setPatientData(prev => {
      const measurements = [...(prev.anatomicalMeasurements?.[type] || [])];
      
      if (!measurements[index]) {
        measurements[index] = {} as any;
      }
      
      if (field === 'value' && typeof value === 'string') {
        measurements[index][field] = value === '' ? 0 : parseFloat(value);
      } else {
        measurements[index][field] = value;
      }
      
      return {
        ...prev,
        anatomicalMeasurements: {
          ...prev.anatomicalMeasurements,
          [type]: measurements
        }
      };
    });
  };
  
  const addCircumferenceMeasurement = (type: 'ccm' | 'cap' | 'cbp') => {
    setPatientData(prev => {
      const newMeasurement = {
        value: 0,
        unit: 'cm' as const,
        location: '',
        ...(type !== 'ccm' ? { side: 'right' as const } : {})
      };
      
      return {
        ...prev,
        anatomicalMeasurements: {
          ...prev.anatomicalMeasurements,
          [type]: [...(prev.anatomicalMeasurements?.[type] || []), newMeasurement]
        }
      };
    });
  };
  
  const removeCircumferenceMeasurement = (type: 'ccm' | 'cap' | 'cbp', index: number) => {
    setPatientData(prev => {
      const measurements = [...(prev.anatomicalMeasurements?.[type] || [])];
      measurements.splice(index, 1);
      
      return {
        ...prev,
        anatomicalMeasurements: {
          ...prev.anatomicalMeasurements,
          [type]: measurements
        }
      };
    });
  };
  
  // Mobility measurement changes
  const handleMobilityChange = (
    measurement: keyof MobilityMeasurements, 
    field: string, 
    value: any
  ) => {
    setPatientData(prev => {
      const prevMeasurements = prev.mobilityMeasurements || {};
      const currentMeasurement = prevMeasurements[measurement] || {};
      
      let newValue = value;
      if (field === 'value' && typeof value === 'string') {
        newValue = value === '' ? 0 : parseFloat(value);
      }
      
      return {
        ...prev,
        mobilityMeasurements: {
          ...prevMeasurements,
          [measurement]: {
            ...currentMeasurement,
            [field]: newValue
          }
        }
      };
    });
  };
  
  // Imaging changes
  const addImage = () => {
    const newImage: ImagingData = {
      id: `img-${Date.now()}`,
      type: 'x-ray',
      bodyPart: '',
      imageUrl: '',
      date: new Date().toISOString().split('T')[0],
      stage: 'pre-treatment',
      notes: ''
    };
    
    setPatientData(prev => ({
      ...prev,
      imaging: [...(prev.imaging || []), newImage]
    }));
  };
  
  const removeImage = (id: string) => {
    setPatientData(prev => ({
      ...prev,
      imaging: (prev.imaging || []).filter(img => img.id !== id)
    }));
  };
  
  const updateImage = (id: string, field: keyof ImagingData, value: any) => {
    setPatientData(prev => ({
      ...prev,
      imaging: (prev.imaging || []).map(img => 
        img.id === id ? { ...img, [field]: value } : img
      )
    }));
  };
  
  const prepareDataForSubmission = (): OptmPatientData => {
    return {
      ...patientData,
      lastUpdated: new Date().toISOString()
    } as OptmPatientData;
  };
  
  return {
    activeTab,
    setActiveTab,
    patientData,
    handlePatientInfoChange,
    handleBiomarkerChange,
    handleAnatomicalCtmChange,
    handleCircumferenceChange,
    addCircumferenceMeasurement,
    removeCircumferenceMeasurement,
    handleMobilityChange,
    addImage,
    removeImage,
    updateImage,
    prepareDataForSubmission
  };
};
