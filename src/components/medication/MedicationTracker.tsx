
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pill, Clock, Check, X } from 'lucide-react';
import { useMedicationData } from '@/hooks/useMedicationData';
import { MedicationWithSummary, MedicationDose } from '@/types/medicationData';
import MedicationImprovementChart from './MedicationImprovementChart';

interface MedicationTrackerProps {
  patientId?: string;
  className?: string;
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ patientId, className }) => {
  const { medications, improvementData, isLoading, recordDoseTaken, recordDoseMissed } = useMedicationData(patientId);
  const [activeTab, setActiveTab] = useState('today');
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Filter doses for today
  const getTodayDoses = () => {
    const doses: { medication: MedicationWithSummary, dose: MedicationDose }[] = [];
    
    medications.forEach(medication => {
      medication.doses.forEach(dose => {
        const doseDate = new Date(dose.timestamp);
        doseDate.setHours(0, 0, 0, 0);
        
        if (doseDate.getTime() === today.getTime()) {
          doses.push({ medication, dose });
        }
      });
    });
    
    // Sort by time
    return doses.sort((a, b) => 
      new Date(a.dose.timestamp).getTime() - new Date(b.dose.timestamp).getTime()
    );
  };
  
  // Get upcoming doses (scheduled or within the next 24 hours)
  const getUpcomingDoses = () => {
    const doses: { medication: MedicationWithSummary, dose: MedicationDose }[] = [];
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    medications.forEach(medication => {
      medication.doses.forEach(dose => {
        const doseDate = new Date(dose.timestamp);
        
        if (
          dose.status === 'scheduled' && 
          doseDate.getTime() > now.getTime() && 
          doseDate.getTime() < tomorrow.getTime()
        ) {
          doses.push({ medication, dose });
        }
      });
    });
    
    // Sort by time
    return doses.sort((a, b) => 
      new Date(a.dose.timestamp).getTime() - new Date(b.dose.timestamp).getTime()
    );
  };
  
  // Handle recording a dose as taken
  const handleTakeDose = (medicationId: string, doseId: string) => {
    recordDoseTaken(medicationId, doseId);
  };
  
  // Handle marking a dose as missed
  const handleMissDose = (medicationId: string, doseId: string) => {
    recordDoseMissed(medicationId, doseId);
  };
  
  // Render individual medication dose card
  const renderDoseCard = (medication: MedicationWithSummary, dose: MedicationDose) => {
    const isPast = new Date(dose.timestamp).getTime() < new Date().getTime();
    
    return (
      <div 
        key={dose.id}
        className={`p-4 border rounded-lg mb-3 ${
          dose.status === 'taken' 
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
            : dose.status === 'missed'
            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            : 'bg-card border-border'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium">{medication.name}</h4>
              <p className="text-xs text-muted-foreground">{medication.description}</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(dose.timestamp)}
          </div>
        </div>
        
        {dose.status === 'scheduled' && (
          <div className="mt-3 flex gap-2">
            <Button 
              size="sm" 
              className="w-full flex items-center" 
              onClick={() => handleTakeDose(medication.id, dose.id)}
            >
              <Check className="h-4 w-4 mr-1" /> Take Now
            </Button>
            {isPast && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center text-destructive hover:text-destructive" 
                onClick={() => handleMissDose(medication.id, dose.id)}
              >
                <X className="h-4 w-4 mr-1" /> Skip
              </Button>
            )}
          </div>
        )}
        
        {dose.status === 'taken' && (
          <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
            <Check className="h-4 w-4 mr-1" /> Taken at {
              new Intl.DateTimeFormat('en-US', { 
                hour: 'numeric',
                minute: 'numeric'
              }).format(new Date(dose.timestamp))
            }
          </div>
        )}
        
        {dose.status === 'missed' && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center">
            <X className="h-4 w-4 mr-1" /> Missed
          </div>
        )}
      </div>
    );
  };
  
  const todayDoses = getTodayDoses();
  const upcomingDoses = getUpcomingDoses();
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="h-5 w-5 mr-2" />
          Medication Tracker
        </CardTitle>
        <CardDescription>
          Track your medication consumption and view progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-0">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Today's Medications</h3>
              <p className="text-xs text-muted-foreground mb-4">
                {todayDoses.length} doses scheduled for today
              </p>
              
              {todayDoses.length > 0 ? (
                <div className="space-y-2">
                  {todayDoses.map(({ medication, dose }) => renderDoseCard(medication, dose))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No medications scheduled for today</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Upcoming Medications</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Your next {upcomingDoses.length} doses
              </p>
              
              {upcomingDoses.length > 0 ? (
                <div className="space-y-2">
                  {upcomingDoses.map(({ medication, dose }) => renderDoseCard(medication, dose))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming medications in the next 24 hours</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Your Progress</h3>
                <p className="text-xs text-muted-foreground">
                  Health improvement based on medication adherence
                </p>
              </div>
              
              <MedicationImprovementChart improvementData={improvementData} />
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Adherence</p>
                  <p className="text-lg font-semibold">
                    {improvementData.length > 0 
                      ? Math.round(improvementData[improvementData.length - 1].adherenceRate) 
                      : 0}%
                  </p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Health Score</p>
                  <p className="text-lg font-semibold">
                    {improvementData.length > 0 
                      ? Math.round(improvementData[improvementData.length - 1].healthScore) 
                      : 0}
                  </p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Pain Level</p>
                  <p className="text-lg font-semibold">
                    {improvementData.length > 0 && improvementData[improvementData.length - 1].symptoms.pain
                      ? Math.round(improvementData[improvementData.length - 1].symptoms.pain) 
                      : 0}/10
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
