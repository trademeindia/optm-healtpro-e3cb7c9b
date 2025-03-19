
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SymptomProgressChart from '@/components/dashboard/SymptomProgressChart';
import SymptomTracker from '@/components/dashboard/SymptomTracker';
import MessageYourDoctor from '../MessageYourDoctor';
import MedicalDocuments from '../MedicalDocuments';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RightColumn: React.FC = () => {
  return (
    <div className="lg:col-span-4 space-y-4">
      {/* AI Health Insights */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            AI Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30">
            <AlertTitle className="font-medium">Blood Pressure Alert</AlertTitle>
            <AlertDescription className="text-sm mt-1">
              Your blood pressure has been consistently elevated. Consider reviewing your medication or consulting your doctor.
            </AlertDescription>
            <Button variant="link" className="text-yellow-600 dark:text-yellow-400 px-0 h-auto mt-1">
              View blood pressure history
            </Button>
          </Alert>
          
          <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30">
            <AlertTitle className="font-medium">Wellness Check-up</AlertTitle>
            <AlertDescription className="text-sm mt-1">
              Annual wellness check-up is due in the next 30 days.
            </AlertDescription>
            <Button variant="link" className="text-blue-600 dark:text-blue-400 px-0 h-auto mt-1">
              Schedule appointment
            </Button>
          </Alert>
        </CardContent>
      </Card>
      
      {/* Symptom Progress */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Symptom Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <SymptomProgressChart className="w-full" />
        </CardContent>
      </Card>
      
      {/* Symptom Tracker */}
      <SymptomTracker />
      
      {/* Message Your Doctor */}
      <MessageYourDoctor />
      
      {/* Medical Documents */}
      <MedicalDocuments />
    </div>
  );
};

export default RightColumn;
