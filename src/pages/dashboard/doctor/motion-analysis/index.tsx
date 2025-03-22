
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MotionAnalysisRecorder from './components/MotionAnalysisRecorder';
import MotionAnalysisHistory from './components/MotionAnalysisHistory';
import PatientSelector from './components/PatientSelector';
import { MotionAnalysisSession } from '@/types/motion-analysis';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MotionAnalysisPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<MotionAnalysisSession | null>(null);
  const [activeTab, setActiveTab] = useState('record');

  const handlePatientSelected = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSelectedSession(null);
  };

  const handleSessionSelected = (session: MotionAnalysisSession) => {
    setSelectedSession(session);
    setActiveTab('view');
  };

  const handleSessionCreated = () => {
    setActiveTab('history');
  };

  const handleBackToList = () => {
    setSelectedSession(null);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Motion Analysis</h1>
      
      <PatientSelector onSelect={handlePatientSelected} />
      
      {selectedPatientId && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="record">Record New Session</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
            {selectedSession && (
              <TabsTrigger value="view">View Session</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="record">
            <MotionAnalysisRecorder 
              patientId={selectedPatientId} 
              onSessionCreated={handleSessionCreated}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <MotionAnalysisHistory 
              patientId={selectedPatientId}
              onSelectSession={handleSessionSelected}
            />
          </TabsContent>
          
          <TabsContent value="view">
            {selectedSession && (
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBackToList}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Button>
                
                <div className="border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    {selectedSession.type} Analysis
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{new Date(selectedSession.measurementDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p>{selectedSession.duration} seconds</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="whitespace-pre-line">{selectedSession.notes || "No notes"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Joint Angles</p>
                    {selectedSession.jointAngles.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="text-left py-2">Joint</th>
                              <th className="text-left py-2">Angle (°)</th>
                              <th className="text-left py-2">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSession.jointAngles.map((angle, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-2">{angle.joint}</td>
                                <td className="py-2">{angle.angle.toFixed(1)}°</td>
                                <td className="py-2">
                                  {new Date(angle.timestamp).toLocaleTimeString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No joint angles recorded</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
