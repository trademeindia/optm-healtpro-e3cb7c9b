
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Pill, Info } from 'lucide-react';
import MedicationTracker from '@/components/medication/MedicationTracker';
import MedicationDetailView from '@/components/medication/MedicationDetailView';
import { useMedicationData } from '@/hooks/useMedicationData';
import { useAuth } from '@/contexts/AuthContext';

interface MedicationTabProps {
  patientId?: string;
}

const MedicationTab: React.FC<MedicationTabProps> = ({ patientId }) => {
  const { user } = useAuth();
  const { 
    medications, 
    improvementData, 
    isLoading, 
    recordDoseTaken, 
    recordDoseMissed 
  } = useMedicationData(patientId);
  
  const [activeMedication, setActiveMedication] = React.useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const selectedMedication = medications.find(med => med.id === activeMedication);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Medication tracker */}
        <div className="w-full md:w-1/3">
          <MedicationTracker 
            patientId={patientId || user?.id} 
            className="h-full" 
          />
        </div>
        
        {/* Right column - Selected medication or overview */}
        <div className="w-full md:w-2/3">
          {selectedMedication ? (
            <MedicationDetailView 
              medication={selectedMedication}
              onTakeDose={recordDoseTaken}
              onMissDose={recordDoseMissed}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="h-5 w-5 mr-2" />
                  My Medications
                </CardTitle>
                <CardDescription>
                  Track your prescribed medications and view their effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Doctor's Prescription</AlertTitle>
                  <AlertDescription>
                    Your doctor has prescribed the following medications to be taken 3 times daily:
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>PH3-BHT - Take with water</li>
                      <li>PH3-JP - Take after meals</li>
                      <li>Foot Batch Crystal - Dissolve in warm water</li>
                      <li>Mornblooso - Take on empty stomach</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {medications.map(medication => (
                    <Card 
                      key={medication.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setActiveMedication(medication.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{medication.name}</h3>
                          <span className={`text-xs rounded-full px-2 py-0.5 ${
                            medication.summary.adherenceRate >= 80 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : medication.summary.adherenceRate >= 50
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {Math.round(medication.summary.adherenceRate)}% Adherence
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {medication.description}
                        </p>
                        
                        <div className="flex justify-between text-sm">
                          <span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {medication.summary.dosesTaken}
                            </span> taken
                          </span>
                          <span>
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              {medication.summary.dosesMissed}
                            </span> missed
                          </span>
                          <span>
                            <span className="text-primary font-medium">
                              {medication.frequency}x
                            </span> daily
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationTab;
