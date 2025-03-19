
import React from 'react';
import TreatmentPlan from '@/components/dashboard/TreatmentPlan';
import UpcomingAppointmentsCard from '../UpcomingAppointmentsCard';
import HealthSyncButton from '../HealthSyncButton';
import { DashboardMainContentProps } from './types';
import AnatomicalViewer from '@/components/patient/AnatomicalViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MiddleColumn: React.FC<DashboardMainContentProps> = ({
  treatmentTasks,
  upcomingAppointments,
  handleConfirmAppointment,
  handleRescheduleAppointment,
  hasConnectedApps,
  onSyncData
}) => {
  return (
    <div className="lg:col-span-5 space-y-4">
      {/* Health sync button */}
      <HealthSyncButton 
        hasConnectedApps={hasConnectedApps}
        onSyncData={onSyncData}
      />
      
      {/* 3D anatomical model */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Anatomical Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-muted/30">
            <AnatomicalViewer 
              mappings={[
                { 
                  bodyPart: "Rotator Cuff", 
                  coordinates: { x: 0.25, y: 0.15 }, 
                  affectedBiomarkers: ["Inflammation"], 
                  severity: 7,
                  notes: "Rotator Cuff Tear"
                },
                {
                  bodyPart: "Knee",
                  coordinates: { x: 0.5, y: 0.7 },
                  affectedBiomarkers: ["Inflammation", "Cartilage Health"],
                  severity: 5,
                  notes: "Patellar Tendinitis"
                },
                {
                  bodyPart: "Lower Back",
                  coordinates: { x: 0.5, y: 0.4 },
                  affectedBiomarkers: ["Inflammation", "Muscle Tension"],
                  severity: 4,
                  notes: "Lumbar Strain"
                }
              ]} 
              biomarkers={[]}
            />
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>Showing affected areas based on your recent health data and reported symptoms.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Treatment plan */}
      <TreatmentPlan
        title="Today's Treatment Plan"
        date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        tasks={treatmentTasks}
        progress={treatmentTasks.filter(task => task.completed).length / treatmentTasks.length * 100}
      />
      
      {/* Upcoming appointments */}
      <UpcomingAppointmentsCard 
        upcomingAppointments={upcomingAppointments}
        onConfirmAppointment={handleConfirmAppointment}
        onRescheduleAppointment={handleRescheduleAppointment}
      />
    </div>
  );
};

export default MiddleColumn;
