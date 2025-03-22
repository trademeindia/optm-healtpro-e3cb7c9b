
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MotionAnalysisSession } from '@/types/motion-analysis';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

// Mock data for demonstration
const MOCK_SESSIONS: MotionAnalysisSession[] = [
  {
    id: '1',
    patientId: '1',
    type: 'Gait Analysis',
    measurementDate: new Date().toISOString(),
    duration: 45,
    jointAngles: [
      { joint: 'leftKnee', angle: 120, timestamp: Date.now() - 30000 },
      { joint: 'rightKnee', angle: 115, timestamp: Date.now() - 25000 },
      { joint: 'leftElbow', angle: 95, timestamp: Date.now() - 20000 },
      { joint: 'rightElbow', angle: 90, timestamp: Date.now() - 15000 },
    ],
    notes: 'Patient showed improved range of motion'
  },
  {
    id: '2',
    patientId: '1',
    type: 'Shoulder Assessment',
    measurementDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    duration: 30,
    jointAngles: [
      { joint: 'leftShoulder', angle: 85, timestamp: Date.now() - 86400000 - 30000 },
      { joint: 'rightShoulder', angle: 80, timestamp: Date.now() - 86400000 - 25000 },
    ],
    notes: 'Limited mobility in right shoulder'
  }
];

interface MotionAnalysisHistoryProps {
  patientId: string;
  onSelectSession: (session: MotionAnalysisSession) => void;
}

const MotionAnalysisHistory: React.FC<MotionAnalysisHistoryProps> = ({ 
  patientId, 
  onSelectSession 
}) => {
  const [sessions, setSessions] = useState<MotionAnalysisSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch sessions from an API
    // For now, we'll simulate a short delay and use mock data
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter sessions by patient ID
        const patientSessions = MOCK_SESSIONS.filter(
          session => session.patientId === patientId
        );
        
        setSessions(patientSessions);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [patientId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Motion Analysis History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Measurements</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(session.measurementDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{session.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.duration} seconds
                    </div>
                  </TableCell>
                  <TableCell>{session.jointAngles.length}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSelectSession(session)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No motion analysis sessions found for this patient</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MotionAnalysisHistory;
