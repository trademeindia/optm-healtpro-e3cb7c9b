
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MotionAnalysisSession, fromDbModel } from '@/types/motion-analysis';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';

interface MotionAnalysisHistoryProps {
  patientId?: string;
  onSelectSession?: (session: MotionAnalysisSession) => void;
}

export default function MotionAnalysisHistory({ 
  patientId, 
  onSelectSession 
}: MotionAnalysisHistoryProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MotionAnalysisSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create the base query
      let query = supabase
        .from('motion_analysis_sessions');

      // Filter by patient ID if provided, otherwise show all patient sessions for this doctor
      if (patientId) {
        query = query.eq('patient_id', patientId);
      } else if (user.role === 'doctor') {
        query = query.eq('doctor_id', user.id);
      }

      // Execute the query
      const { data, error } = await query
        .order('measurement_date', { ascending: false })
        .select();

      if (error) throw error;

      // Convert DB results to our application model
      const formattedSessions: MotionAnalysisSession[] = data 
        ? data.map(session => fromDbModel(session))
        : [];

      setSessions(formattedSessions);
    } catch (err) {
      console.error('Error fetching motion analysis sessions:', err);
      setError('Failed to load motion analysis sessions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data when patientId changes
  useEffect(() => {
    fetchSessions();
  }, [patientId, user]);

  const handleSessionClick = (session: MotionAnalysisSession) => {
    if (onSelectSession) {
      onSelectSession(session);
    }
  };

  // Placeholder for empty state
  if (!isLoading && sessions.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Motion Analysis History</CardTitle>
          <CardDescription>No recorded sessions found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              {patientId 
                ? "This patient doesn't have any motion analysis sessions yet." 
                : "You haven't recorded any motion analysis sessions yet."}
            </p>
            <Button 
              variant="outline" 
              onClick={fetchSessions} 
              className="mt-4"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Motion Analysis History</CardTitle>
        <CardDescription>
          {patientId 
            ? "Recent motion analysis sessions for this patient" 
            : "Your recent motion analysis sessions"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                className="border rounded-md p-4 hover:bg-muted cursor-pointer"
                onClick={() => handleSessionClick(session)}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{session.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {session.measurementDate 
                        ? formatDistanceToNow(new Date(session.measurementDate), { addSuffix: true }) 
                        : 'Date unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{format(new Date(session.measurementDate), 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.duration ? `${session.duration} seconds` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
