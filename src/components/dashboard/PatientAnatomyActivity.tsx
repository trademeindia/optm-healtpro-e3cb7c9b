
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSymptoms } from '@/contexts/SymptomContext';
import { getBodyRegions } from '@/components/anatomy-map/data/bodyRegions';
import { format } from 'date-fns';

interface PatientAnatomyActivityProps {
  patientId?: number;
}

const PatientAnatomyActivity: React.FC<PatientAnatomyActivityProps> = ({ patientId }) => {
  const { symptoms, currentPatientId } = useSymptoms();
  const bodyRegions = getBodyRegions();
  
  // Use patientId from props or currentPatientId from context
  const activePatientId = patientId || currentPatientId;
  
  // Filter symptoms for this patient and sort by most recent
  const patientSymptoms = symptoms
    .filter(s => s.patientId === activePatientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get region name
  const getRegionName = (locationId: string) => {
    const region = bodyRegions.find(r => r.id === locationId);
    return region ? region.name : 'Unknown';
  };
  
  if (!activePatientId) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Select a patient to view their anatomical data</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Patient Anatomical Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="symptoms">
          <TabsList className="mb-4">
            <TabsTrigger value="symptoms">Symptom Reports</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="symptoms">
            {patientSymptoms.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Date</th>
                      <th className="text-left py-2 font-medium">Location</th>
                      <th className="text-left py-2 font-medium">Pain Level</th>
                      <th className="text-left py-2 font-medium">Symptom</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientSymptoms.map((symptom) => (
                      <tr key={symptom.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-2">{format(new Date(symptom.date), 'MMM d, yyyy')}</td>
                        <td className="py-2">{getRegionName(symptom.location)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            symptom.painLevel >= 7 ? 'bg-red-100 text-red-800' :
                            symptom.painLevel >= 4 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {symptom.painLevel}/10
                          </span>
                        </td>
                        <td className="py-2">{symptom.symptomName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No symptom records found for this patient</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="text-center py-10 text-muted-foreground">
              <p>Real-time anatomical activity will appear here</p>
              <p className="text-xs mt-1">Patient activity is synchronized automatically</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PatientAnatomyActivity;
