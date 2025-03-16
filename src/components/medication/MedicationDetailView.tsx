
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  LineChart,
  Pill
} from 'lucide-react';
import { MedicationWithSummary, MedicationDose } from '@/types/medicationData';

interface MedicationDetailViewProps {
  medication: MedicationWithSummary;
  onTakeDose?: (medicationId: string, doseId: string) => void;
  onMissDose?: (medicationId: string, doseId: string) => void;
}

const MedicationDetailView: React.FC<MedicationDetailViewProps> = ({
  medication,
  onTakeDose,
  onMissDose
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Group doses by date
  const groupDosesByDate = () => {
    const grouped: { [date: string]: MedicationDose[] } = {};
    
    medication.doses.forEach(dose => {
      const date = new Date(dose.timestamp);
      const dateString = date.toISOString().split('T')[0];
      
      if (!grouped[dateString]) {
        grouped[dateString] = [];
      }
      
      grouped[dateString].push(dose);
    });
    
    return grouped;
  };
  
  const dosesByDate = groupDosesByDate();
  const dates = Object.keys(dosesByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
  // Get medication status card color based on adherence rate
  const getStatusColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
    if (rate >= 50) return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
    return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
  };
  
  // Get dose status icon
  const getDoseStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Pill className="h-5 w-5 mr-2 text-primary" />
          {medication.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {medication.description}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Adherence Card */}
          <div className={`p-4 rounded-lg border ${getStatusColor(medication.summary.adherenceRate)}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">Adherence Rate</h3>
                <p className="text-2xl font-bold">{Math.round(medication.summary.adherenceRate)}%</p>
              </div>
              <LineChart className="h-5 w-5 text-primary" />
            </div>
            <Progress value={medication.summary.adherenceRate} className="h-2 mt-2" />
          </div>
          
          {/* Doses Card */}
          <div className="p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Doses Taken</h3>
                <p className="text-2xl font-bold">
                  {medication.summary.dosesTaken} <span className="text-sm text-muted-foreground font-normal">of {medication.summary.dosesScheduled}</span>
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <span className="text-green-500 font-medium">{medication.summary.dosesTaken}</span>
                <p className="text-xs text-muted-foreground">Taken</p>
              </div>
              <div>
                <span className="text-red-500 font-medium">{medication.summary.dosesMissed}</span>
                <p className="text-xs text-muted-foreground">Missed</p>
              </div>
              <div>
                <span className="text-amber-500 font-medium">
                  {medication.summary.dosesScheduled - medication.summary.dosesTaken - medication.summary.dosesMissed}
                </span>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          
          {/* Schedule Card */}
          <div className="p-4 rounded-lg border">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-medium">Schedule</h3>
                <p className="text-muted-foreground text-sm">
                  {medication.frequency}x daily
                </p>
              </div>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-medium">Started:</span> {new Date(medication.startDate).toLocaleDateString()}
              </p>
              {medication.endDate && (
                <p className="text-sm">
                  <span className="font-medium">Ends:</span> {new Date(medication.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Dose History */}
        <div className="mt-6">
          <h3 className="font-medium mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Dose History
          </h3>
          
          <div className="space-y-4">
            {dates.map(date => (
              <div key={date} className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 font-medium text-sm">
                  {new Date(date).toLocaleDateString(undefined, { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="divide-y">
                  {dosesByDate[date].map(dose => {
                    const isPast = new Date(dose.timestamp).getTime() < new Date().getTime();
                    const isToday = new Date(dose.timestamp).toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={dose.id} className="px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          {getDoseStatusIcon(dose.status)}
                          <div className="ml-3">
                            <p className="font-medium">{formatDate(dose.timestamp)}</p>
                            <p className="text-xs text-muted-foreground">
                              {dose.status === 'taken' ? 'Taken' : dose.status === 'missed' ? 'Missed' : 'Scheduled'}
                            </p>
                          </div>
                        </div>
                        
                        {dose.status === 'scheduled' && isPast && isToday && onTakeDose && onMissDose && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => onTakeDose(medication.id, dose.id)}
                              className="text-xs bg-primary text-white rounded-md px-2 py-1 hover:bg-primary/90"
                            >
                              Take Now
                            </button>
                            <button 
                              onClick={() => onMissDose(medication.id, dose.id)}
                              className="text-xs bg-destructive text-white rounded-md px-2 py-1 hover:bg-destructive/90"
                            >
                              Skip
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationDetailView;
