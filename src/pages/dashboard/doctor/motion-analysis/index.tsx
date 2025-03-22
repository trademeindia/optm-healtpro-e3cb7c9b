
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Save, LineChart, Camera, FileText } from 'lucide-react';
import PatientSelector from '@/components/patient/PatientSelector';
import MotionAnalysisRecorder from './components/MotionAnalysisRecorder';
import MotionAnalysisHistory from './components/MotionAnalysisHistory';
import MotionAnalysisSettings from './components/MotionAnalysisSettings';

export type SelectedPatient = {
  id: string;
  name: string;
  avatar?: string;
};

const MotionAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("record");
  const [selectedPatient, setSelectedPatient] = useState<SelectedPatient | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handlePatientSelect = (patient: SelectedPatient | null) => {
    setSelectedPatient(patient);
    // Reset recording state when patient changes
    if (isRecording) {
      setIsRecording(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard/doctor');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Motion Analysis</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <PatientSelector 
            selectedPatient={selectedPatient} 
            onSelectPatient={handlePatientSelect}
            className="min-w-[200px]"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedPatient 
              ? `Motion Analysis for ${selectedPatient.name}`
              : "Select a patient to begin analysis"}
          </CardTitle>
          <CardDescription>
            Measure and analyze patient movements with AI-assisted motion tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="record" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>Record</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="record" className="space-y-4">
              {selectedPatient ? (
                <MotionAnalysisRecorder 
                  patientId={selectedPatient.id}
                  patientName={selectedPatient.name}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No Patient Selected</h3>
                  <p>Please select a patient to start motion analysis recording</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              {selectedPatient ? (
                <MotionAnalysisHistory patientId={selectedPatient.id} />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No Patient Selected</h3>
                  <p>Please select a patient to view their motion analysis history</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <MotionAnalysisSettings 
                patientId={selectedPatient?.id}
                patientName={selectedPatient?.name}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotionAnalysisPage;
