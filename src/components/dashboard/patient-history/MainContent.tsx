
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { User, Heart, Activity, Calendar, FileText } from 'lucide-react';
import PatientProfile from '@/components/patient/PatientProfile';
import SimplifiedAnatomicalMap from '@/components/patient/SimplifiedAnatomicalMap';
import PatientBiomarkers from '@/components/dashboard/PatientBiomarkers';
import SymptomTracker from '@/components/dashboard/SymptomTracker';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';

interface MainContentProps {
  patient: any;
  selectedRegion?: string;
  onSelectRegion?: (region: string) => void;
  onAssignTests?: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  patient,
  selectedRegion,
  onSelectRegion,
  onAssignTests
}) => {
  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="summary" className="w-full">
        <div className="px-4 py-3 border-b">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Summary</span>
            </TabsTrigger>
            <TabsTrigger value="anatomical" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Anatomical</span>
            </TabsTrigger>
            <TabsTrigger value="biomarkers" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Biomarkers</span>
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Appointments</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-4">
          {/* Summary Tab */}
          <TabsContent value="summary">
            <PatientProfile patient={patient} showFullDetails={true} onAssignTests={onAssignTests} />
          </TabsContent>
          
          {/* Anatomical Tab */}
          <TabsContent value="anatomical">
            <SimplifiedAnatomicalMap 
              patientId={patient.id} 
              onRegionSelect={onSelectRegion} 
              patientBiomarkers={patient.biomarkers || []}
            />
          </TabsContent>
          
          {/* Biomarkers Tab */}
          <TabsContent value="biomarkers">
            <PatientBiomarkers biomarkers={patient.biomarkers || []} patientId={patient.id} />
          </TabsContent>
          
          {/* Symptoms Tab */}
          <TabsContent value="symptoms">
            <SymptomTracker patientId={patient.id} />
          </TabsContent>
          
          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <UpcomingAppointments patientId={patient.id} />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default MainContent;
