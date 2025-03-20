import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Activity, 
  Ruler, 
  MoveHorizontal, 
  ImageIcon, 
  Save,
  Plus,
  Trash,
  RefreshCw
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  OptmPatientData,
  TreatmentStage,
  MusculoskeletalBiomarkers,
  AnatomicalMeasurements,
  MobilityMeasurements,
  ImagingData,
  BIOMARKER_REFERENCE_RANGES
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
      const sectionData = prev[section] || {};
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };
  
  const handleBiomarkerChange = (marker: keyof MusculoskeletalBiomarkers, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    setPatientData(prev => ({
      ...prev,
      biomarkers: {
        ...prev.biomarkers,
        [marker]: numValue
      }
    }));
  };
  
  const handleAnatomicalCtmChange = (value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    setPatientData(prev => ({
      ...prev,
      anatomicalMeasurements: {
        ...prev.anatomicalMeasurements,
        ctm: numValue
      }
    }));
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
            
            <TabsContent value="patient-info" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input 
                    id="patientId" 
                    value={patientData.patientId || ''} 
                    onChange={(e) => setPatientData({ ...patientData, patientId: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={patientData.name || ''} 
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number"
                    value={patientData.age || ''} 
                    onChange={(e) => setPatientData({ ...patientData, age: parseInt(e.target.value) || undefined })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={patientData.gender}
                    onValueChange={(value: 'male' | 'female' | 'other') => 
                      setPatientData({ ...patientData, gender: value })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="treatmentStage">Treatment Stage</Label>
                  <Select
                    value={patientData.treatmentStage}
                    onValueChange={(value: TreatmentStage) => 
                      setPatientData({ ...patientData, treatmentStage: value })
                    }
                  >
                    <SelectTrigger id="treatmentStage">
                      <SelectValue placeholder="Select treatment stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">Initial</SelectItem>
                      <SelectItem value="early">Early</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="biomarkers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 mb-2">
                  <h3 className="text-lg font-medium">Inflammatory Markers</h3>
                  <p className="text-sm text-muted-foreground">Enter current biomarker values</p>
                </div>
                
                {['crp', 'il6', 'tnfAlpha', 'mda'].map((marker) => {
                  const biomarker = marker as keyof MusculoskeletalBiomarkers;
                  const range = BIOMARKER_REFERENCE_RANGES[biomarker];
                  
                  return (
                    <div key={marker} className="space-y-2">
                      <Label htmlFor={marker}>
                        {biomarker} {range ? `(${range.unit})` : ''}
                      </Label>
                      <Input 
                        id={marker} 
                        type="number"
                        step="0.01"
                        value={patientData.biomarkers?.[biomarker] ?? ''} 
                        onChange={(e) => handleBiomarkerChange(biomarker, e.target.value)}
                        placeholder={range ? `Normal: ${range.min} - ${range.max}` : ''}
                      />
                    </div>
                  );
                })}
                
                <div className="md:col-span-2 mt-2 mb-2">
                  <Separator />
                  <h3 className="text-lg font-medium mt-4">Tissue Repair Markers</h3>
                </div>
                
                {['vegf', 'tgfBeta'].map((marker) => {
                  const biomarker = marker as keyof MusculoskeletalBiomarkers;
                  const range = BIOMARKER_REFERENCE_RANGES[biomarker];
                  
                  return (
                    <div key={marker} className="space-y-2">
                      <Label htmlFor={marker}>
                        {biomarker} {range ? `(${range.unit})` : ''}
                      </Label>
                      <Input 
                        id={marker} 
                        type="number"
                        step="0.01"
                        value={patientData.biomarkers?.[biomarker] ?? ''} 
                        onChange={(e) => handleBiomarkerChange(biomarker, e.target.value)}
                        placeholder={range ? `Normal: ${range.min} - ${range.max}` : ''}
                      />
                    </div>
                  );
                })}
                
                <div className="md:col-span-2 mt-2 mb-2">
                  <Separator />
                  <h3 className="text-lg font-medium mt-4">Cartilage Degradation Markers</h3>
                </div>
                
                {['comp', 'mmp9', 'mmp13'].map((marker) => {
                  const biomarker = marker as keyof MusculoskeletalBiomarkers;
                  const range = BIOMARKER_REFERENCE_RANGES[biomarker];
                  
                  return (
                    <div key={marker} className="space-y-2">
                      <Label htmlFor={marker}>
                        {biomarker} {range ? `(${range.unit})` : ''}
                      </Label>
                      <Input 
                        id={marker} 
                        type="number"
                        step="0.01"
                        value={patientData.biomarkers?.[biomarker] ?? ''} 
                        onChange={(e) => handleBiomarkerChange(biomarker, e.target.value)}
                        placeholder={range ? `Normal: ${range.min} - ${range.max}` : ''}
                      />
                    </div>
                  );
                })}
                
                <div className="md:col-span-2 mt-2 mb-2">
                  <Separator />
                  <h3 className="text-lg font-medium mt-4">Additional Markers</h3>
                </div>
                
                {['ckMm', 'bdnf', 'substanceP', 'dDimer', 'fourHyp', 'aldolase', 'calciumPhosphorusRatio'].map((marker) => {
                  const biomarker = marker as keyof MusculoskeletalBiomarkers;
                  const range = BIOMARKER_REFERENCE_RANGES[biomarker];
                  
                  return (
                    <div key={marker} className="space-y-2">
                      <Label htmlFor={marker}>
                        {biomarker} {range ? `(${range.unit})` : ''}
                      </Label>
                      <Input 
                        id={marker} 
                        type="number"
                        step="0.01"
                        value={patientData.biomarkers?.[biomarker] ?? ''} 
                        onChange={(e) => handleBiomarkerChange(biomarker, e.target.value)}
                        placeholder={range ? `Normal: ${range.min} - ${range.max}` : ''}
                      />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="anatomical" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Cervical Translational Measurement (CTM)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ctm">CTM Value (mm)</Label>
                    <Input 
                      id="ctm"
                      type="number"
                      step="0.1"
                      value={patientData.anatomicalMeasurements?.ctm ?? ''} 
                      onChange={(e) => handleAnatomicalCtmChange(e.target.value)}
                      placeholder="Enter CTM value in mm"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Cervical Circumference Measurements (CCM)</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addCircumferenceMeasurement('ccm')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Measurement
                    </Button>
                  </div>
                  
                  {(patientData.anatomicalMeasurements?.ccm || []).map((measurement, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border-b pb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`ccm-value-${index}`}>Value</Label>
                        <div className="flex gap-2">
                          <Input 
                            id={`ccm-value-${index}`}
                            type="number"
                            step="0.1"
                            value={measurement.value} 
                            onChange={(e) => handleCircumferenceChange('ccm', index, 'value', e.target.value)}
                            placeholder="Value"
                          />
                          <Select
                            value={measurement.unit}
                            onValueChange={(value: 'cm' | 'mm') => 
                              handleCircumferenceChange('ccm', index, 'unit', value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="mm">mm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-1">
                        <Label htmlFor={`ccm-location-${index}`}>Location</Label>
                        <Input 
                          id={`ccm-location-${index}`}
                          value={measurement.location} 
                          onChange={(e) => handleCircumferenceChange('ccm', index, 'location', e.target.value)}
                          placeholder="e.g., C3-C4"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removeCircumferenceMeasurement('ccm', index)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Circumference Arm Posterior (CAP)</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addCircumferenceMeasurement('cap')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Measurement
                    </Button>
                  </div>
                  
                  {(patientData.anatomicalMeasurements?.cap || []).map((measurement, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 border-b pb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`cap-value-${index}`}>Value</Label>
                        <div className="flex gap-2">
                          <Input 
                            id={`cap-value-${index}`}
                            type="number"
                            step="0.1"
                            value={measurement.value} 
                            onChange={(e) => handleCircumferenceChange('cap', index, 'value', e.target.value)}
                            placeholder="Value"
                          />
                          <Select
                            value={measurement.unit}
                            onValueChange={(value: 'cm' | 'mm') => 
                              handleCircumferenceChange('cap', index, 'unit', value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="mm">mm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`cap-side-${index}`}>Side</Label>
                        <Select
                          value={measurement.side}
                          onValueChange={(value: 'left' | 'right' | 'bilateral') => 
                            handleCircumferenceChange('cap', index, 'side', value)
                          }
                        >
                          <SelectTrigger id={`cap-side-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="bilateral">Bilateral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`cap-location-${index}`}>Location</Label>
                        <Input 
                          id={`cap-location-${index}`}
                          value={measurement.location} 
                          onChange={(e) => handleCircumferenceChange('cap', index, 'location', e.target.value)}
                          placeholder="e.g., Mid-arm"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removeCircumferenceMeasurement('cap', index)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Circumference Brachial Posterior (CBP)</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addCircumferenceMeasurement('cbp')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Measurement
                    </Button>
                  </div>
                  
                  {(patientData.anatomicalMeasurements?.cbp || []).map((measurement, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 border-b pb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`cbp-value-${index}`}>Value</Label>
                        <div className="flex gap-2">
                          <Input 
                            id={`cbp-value-${index}`}
                            type="number"
                            step="0.1"
                            value={measurement.value} 
                            onChange={(e) => handleCircumferenceChange('cbp', index, 'value', e.target.value)}
                            placeholder="Value"
                          />
                          <Select
                            value={measurement.unit}
                            onValueChange={(value: 'cm' | 'mm') => 
                              handleCircumferenceChange('cbp', index, 'unit', value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="mm">mm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`cbp-side-${index}`}>Side</Label>
                        <Select
                          value={measurement.side}
                          onValueChange={(value: 'left' | 'right' | 'bilateral') => 
                            handleCircumferenceChange('cbp', index, 'side', value)
                          }
                        >
                          <SelectTrigger id={`cbp-side-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="bilateral">Bilateral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`cbp-location-${index}`}>Location</Label>
                        <Input 
                          id={`cbp-location-${index}`}
                          value={measurement.location} 
                          onChange={(e) => handleCircumferenceChange('cbp', index, 'location', e.target.value)}
                          placeholder="e.g., Upper brachial"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removeCircumferenceMeasurement('cbp', index)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mobility" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Knee Measurements</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="knee-flexion-value">Knee Flexion (degrees)</Label>
                      <Input 
                        id="knee-flexion-value"
                        type="number"
                        step="0.1"
                        value={patientData.mobilityMeasurements?.kneeFlexion?.value ?? ''} 
                        onChange={(e) => handleMobilityChange('kneeFlexion', 'value', e.target.value)}
                        placeholder="Normal: 135-150°"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="knee-flexion-side">Side</Label>
                      <Select
                        value={patientData.mobilityMeasurements?.kneeFlexion?.side}
                        onValueChange={(value: 'left' | 'right' | 'bilateral') => 
                          handleMobilityChange('kneeFlexion', 'side', value)
                        }
                      >
                        <SelectTrigger id="knee-flexion-side">
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="bilateral">Bilateral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="knee-flexion-unit">Unit</Label>
                      <Input 
                        id="knee-flexion-unit"
                        value="degrees"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="knee-extension-value">Knee Extension (degrees)</Label>
                      <Input 
                        id="knee-extension-value"
                        type="number"
                        step="0.1"
                        value={patientData.mobilityMeasurements?.kneeExtension?.value ?? ''} 
                        onChange={(e) => handleMobilityChange('kneeExtension', 'value', e.target.value)}
                        placeholder="Normal: 0° (neutral)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="knee-extension-side">Side</Label>
                      <Select
                        value={patientData.mobilityMeasurements?.kneeExtension?.side}
                        onValueChange={(value: 'left' | 'right' | 'bilateral') => 
                          handleMobilityChange('kneeExtension', 'side', value)
                        }
                      >
                        <SelectTrigger id="knee-extension-side">
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="bilateral">Bilateral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="knee-extension-unit">Unit</Label>
                      <Input 
                        id="knee-extension-unit"
                        value="degrees"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Pelvic Measurements</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pelvic-tilt-value">Pelvic Tilt Angle (degrees)</Label>
                      <Input 
                        id="pelvic-tilt-value"
                        type="number"
                        step="0.1"
                        value={patientData.mobilityMeasurements?.pelvicTilt?.value ?? ''} 
                        onChange={(e) => handleMobilityChange('pelvicTilt', 'value', e.target.value)}
                        placeholder="Normal: 4-7°"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pelvic-tilt-unit">Unit</Label>
                      <Input 
                        id="pelvic-tilt-unit"
                        value="degrees"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Measurements</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="cervical-rotation-value">Cervical Rotation (degrees)</Label>
                      <Input 
                        id="cervical-rotation-value"
                        type="number"
                        step="0.1"
                        value={patientData.mobilityMeasurements?.cervicalRotation?.value ?? ''} 
                        onChange={(e) => handleMobilityChange('cervicalRotation', 'value', e.target.value)}
                        placeholder="Normal: 70-90°"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cervical-rotation-direction">Direction</Label>
                      <Select
                        value={patientData.mobilityMeasurements?.cervicalRotation?.direction}
                        onValueChange={(value: 'left' | 'right') => 
                          handleMobilityChange('cervicalRotation', 'direction', value)
                        }
                      >
                        <SelectTrigger id="cervical-rotation-direction">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cervical-rotation-unit">Unit</Label>
                      <Input 
                        id="cervical-rotation-unit"
                        value="degrees"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shoulder-flexion-value">Shoulder Flexion (degrees)</Label>
                      <Input 
                        id="shoulder-flexion-value"
                        type="number"
                        step="0.1"
                        value={patientData.mobilityMeasurements?.shoulderFlexion?.value ?? ''} 
                        onChange={(e) => handleMobilityChange('shoulderFlexion', 'value', e.target.value)}
                        placeholder="Normal: 150-180°"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="shoulder-flexion-side">Side</Label>
                      <Select
                        value={patientData.mobilityMeasurements?.shoulderFlexion?.side}
                        onValueChange={(value: 'left' | 'right' | 'bilateral') => 
                          handleMobilityChange('shoulderFlexion', 'side', value)
                        }
                      >
                        <SelectTrigger id="shoulder-flexion-side">
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="bilateral">Bilateral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="shoulder-flexion-unit">Unit</Label>
                      <Input 
                        id="shoulder-flexion-unit"
                        value="degrees"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="imaging" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Imaging Data</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addImage}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
              
              {(patientData.imaging || []).length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No imaging data added</p>
                  <p className="text-sm text-muted-foreground">Click "Add Image" to upload diagnostic images</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(patientData.imaging || []).map((image) => (
                    <div key={image.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{image.type} - {image.bodyPart || 'Untitled'}</h4>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`image-type-${image.id}`}>Image Type</Label>
                          <Select
                            value={image.type}
                            onValueChange={(value: 'x-ray' | 'mri' | 'ct' | 'ultrasound') => 
                              updateImage(image.id, 'type', value)
                            }
                          >
                            <SelectTrigger id={`image-type-${image.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="x-ray">X-Ray</SelectItem>
                              <SelectItem value="mri">MRI</SelectItem>
                              <SelectItem value="ct">CT Scan</SelectItem>
                              <SelectItem value="ultrasound">Ultrasound</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`image-body-part-${image.id}`}>Body Part</Label>
                          <Input 
                            id={`image-body-part-${image.id}`}
                            value={image.bodyPart} 
                            onChange={(e) => updateImage(image.id, 'bodyPart', e.target.value)}
                            placeholder="e.g., Knee, Shoulder, Spine"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`image-date-${image.id}`}>Date</Label>
                          <Input 
                            id={`image-date-${image.id}`}
                            type="date"
                            value={image.date.split('T')[0]} 
                            onChange={(e) => updateImage(image.id, 'date', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`image-stage-${image.id}`}>Treatment Stage</Label>
                          <Select
                            value={image.stage}
                            onValueChange={(value: 'pre-treatment' | 'post-treatment' | 'follow-up') => 
                              updateImage(image.id, 'stage', value)
                            }
                          >
                            <SelectTrigger id={`image-stage-${image.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pre-treatment">Pre-Treatment</SelectItem>
                              <SelectItem value="post-treatment">Post-Treatment</SelectItem>
                              <SelectItem value="follow-up">Follow-up</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`image-url-${image.id}`}>Image URL</Label>
                          <Input 
                            id={`image-url-${image.id}`}
                            value={image.imageUrl} 
                            onChange={(e) => updateImage(image.id, 'imageUrl', e.target.value)}
                            placeholder="Enter image URL or upload path"
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`image-notes-${image.id}`}>Notes</Label>
                          <Textarea 
                            id={`image-notes-${image.id}`}
                            value={image.notes || ''} 
                            onChange={(e) => updateImage(image.id, 'notes', e.target.value)}
                            placeholder="Enter notes about imaging findings"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveTab(prevTab => {
              const tabs = ['patient-info', 'biomarkers', 'anatomical', 'mobility', 'imaging'];
              const currentIndex = tabs.indexOf(prevTab);
              return currentIndex > 0 ? tabs[currentIndex - 1] : prevTab;
            })}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab(prevTab => {
                const tabs = ['patient-info', 'biomarkers', 'anatomical', 'mobility', 'imaging'];
                const currentIndex = tabs.indexOf(prevTab);
                return currentIndex < tabs.length - 1 ? tabs[currentIndex + 1] : prevTab;
              })}
            >
              Next
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Data
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default OptmDataInputForm;
