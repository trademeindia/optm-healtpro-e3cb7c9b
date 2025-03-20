
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Ruler, 
  MoveHorizontal, 
  ImageIcon, 
  Save,
  RefreshCw
} from 'lucide-react';
import PatientInfoTab from './patient-info/PatientInfoTab';
import BiomarkersTab from './biomarkers/BiomarkersTab';
import AnatomicalTab from './anatomical/AnatomicalTab';
import MobilityTab from './mobility/MobilityTab';
import ImagingTab from './imaging/ImagingTab';
import { 
  OptmPatientData,
  TreatmentStage,
  MusculoskeletalBiomarkers,
  AnatomicalMeasurements,
  MobilityMeasurements,
  ImagingData
} from '@/types/optm-health';

interface OptmDataInputFormProps {
  initialData?: Partial<OptmPatientData>;
  onSubmit: (data: OptmPatientData) => void;
  isLoading?: boolean;
}

const OptmDataInputForm: React.FC<OptmDataInputFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false
}) => {
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
  
  const handleInputChange = (section: keyof OptmPatientData, field: string, value: any) => {
    setPatientData(prev => {
      // Use type casting to ensure TypeScript knows this is an object type
      const sectionData = (prev[section] || {}) as Record<string, any>;
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };
  
  const handlePatientInfoChange = (field: string, value: any) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSubmit = {
      ...patientData,
      lastUpdated: new Date().toISOString()
    } as OptmPatientData;
    
    onSubmit(dataToSubmit);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OPTM Health Patient Data</CardTitle>
          <CardDescription>
            Enter patient data for musculoskeletal assessment
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="patient-info" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Patient Info</span>
              </TabsTrigger>
              <TabsTrigger value="biomarkers" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Biomarkers</span>
              </TabsTrigger>
              <TabsTrigger value="anatomical" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span className="hidden sm:inline">Anatomical</span>
              </TabsTrigger>
              <TabsTrigger value="mobility" className="flex items-center gap-2">
                <MoveHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Mobility</span>
              </TabsTrigger>
              <TabsTrigger value="imaging" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Imaging</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient-info">
              <PatientInfoTab
                patientId={patientData.patientId || ''}
                name={patientData.name || ''}
                age={patientData.age}
                gender={patientData.gender}
                treatmentStage={patientData.treatmentStage}
                onPatientInfoChange={handlePatientInfoChange}
              />
            </TabsContent>
            
            <TabsContent value="biomarkers">
              <BiomarkersTab
                biomarkers={patientData.biomarkers || {}}
                onBiomarkerChange={handleBiomarkerChange}
              />
            </TabsContent>
            
            <TabsContent value="anatomical">
              <AnatomicalTab
                anatomicalMeasurements={patientData.anatomicalMeasurements || {}}
                onAnatomicalCtmChange={handleAnatomicalCtmChange}
                onCircumferenceChange={handleCircumferenceChange}
                onAddCircumference={addCircumferenceMeasurement}
                onRemoveCircumference={removeCircumferenceMeasurement}
              />
            </TabsContent>
            
            <TabsContent value="mobility">
              <MobilityTab
                mobilityMeasurements={patientData.mobilityMeasurements || {}}
                onMobilityChange={handleMobilityChange}
              />
            </TabsContent>
            
            <TabsContent value="imaging">
              <ImagingTab
                imaging={patientData.imaging || []}
                onAddImage={addImage}
                onRemoveImage={removeImage}
                onUpdateImage={updateImage}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Patient Data
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default OptmDataInputForm;
