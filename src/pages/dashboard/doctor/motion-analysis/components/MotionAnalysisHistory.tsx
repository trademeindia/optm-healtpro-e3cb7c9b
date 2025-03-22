
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSymlink, FileText, Calendar, Clock } from 'lucide-react';
import { getMotionRecords } from '@/utils/mock-database/motionRecords';
import { MotionAnalysisSession } from '@/types/motion-analysis';

interface MotionAnalysisHistoryProps {
  patientId: string;
  onSelectSession: (session: MotionAnalysisSession) => void;
}

const MotionAnalysisHistory: React.FC<MotionAnalysisHistoryProps> = ({
  patientId,
  onSelectSession
}) => {
  const [sessions, setSessions] = useState<MotionAnalysisSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await getMotionRecords(patientId);
        setSessions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching motion analysis sessions:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [patientId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
            <span className="ml-2">Loading sessions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            {error}
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session History</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No motion analysis sessions found for this patient.</p>
            <p className="text-sm mt-1">Record a new session to see it here.</p>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Sessions</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onSelectSession(session)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{session.type}</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(session.measurementDate)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {session.duration} seconds
                      <span className="mx-2">•</span>
                      {session.jointAngles.length} measurements
                    </div>
                    
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      <FileSymlink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="recent">
              {sessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer mb-3"
                  onClick={() => onSelectSession(session)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{session.type}</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(session.measurementDate)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {session.duration} seconds
                      <span className="mx-2">•</span>
                      {session.jointAngles.length} measurements
                    </div>
                    
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      <FileSymlink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default MotionAnalysisHistory;
