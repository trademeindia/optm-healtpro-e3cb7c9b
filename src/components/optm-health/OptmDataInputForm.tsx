
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Save,
  RefreshCw
} from 'lucide-react';
import TabContent from './form/TabContent';
import { useOptmFormState } from './hooks/useOptmFormState';
import { OptmPatientData } from '@/types/optm-health';

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
  const {
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
  } = useOptmFormState(initialData);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = prepareDataForSubmission();
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
          <TabContent 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            patientData={patientData}
            onPatientInfoChange={handlePatientInfoChange}
            onBiomarkerChange={handleBiomarkerChange}
            onAnatomicalCtmChange={handleAnatomicalCtmChange}
            onCircumferenceChange={handleCircumferenceChange}
            onAddCircumference={addCircumferenceMeasurement}
            onRemoveCircumference={removeCircumferenceMeasurement}
            onMobilityChange={handleMobilityChange}
            onAddImage={addImage}
            onRemoveImage={removeImage}
            onUpdateImage={updateImage}
          />
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
