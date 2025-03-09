
import React from 'react';
import { CheckCircle2, Clock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; 
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TherapySession {
  id: string;
  patientName: string;
  patientId: number;
  therapyType: string;
  progress: number;
  sessionsCompleted: number;
  totalSessions: number;
  nextSession: string;
}

interface TherapySchedulesProps {
  therapySessions: TherapySession[];
  className?: string;
  onViewPatient?: (patientId: number) => void;
}

const TherapySchedules: React.FC<TherapySchedulesProps> = ({
  therapySessions,
  className,
  onViewPatient,
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl">Therapy Schedules</CardTitle>
        <CardDescription>
          Ongoing treatment plans and therapy progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {therapySessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No active therapy sessions</p>
          ) : (
            therapySessions.map((session) => (
              <div key={session.id} className="border border-gray-100 dark:border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{session.patientName}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => onViewPatient && onViewPatient(session.patientId)}
                  >
                    View Patient
                  </Button>
                </div>
                
                <p className="text-sm font-medium mb-1">{session.therapyType}</p>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                  <span className="flex items-center">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {session.sessionsCompleted} of {session.totalSessions} completed
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    Next: {session.nextSession}
                  </span>
                </div>
                
                <Progress value={session.progress} className="h-2" />
                <p className="text-xs text-right mt-1 text-muted-foreground">
                  {session.progress}% complete
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapySchedules;
