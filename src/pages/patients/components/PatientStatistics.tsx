
import React, { useMemo } from 'react';
import { Patient } from '../types';
import { UserRound, CalendarClock, ActivitySquare, BadgePlus } from 'lucide-react';

interface PatientStatisticsProps {
  patients: Patient[];
}

export const PatientStatistics: React.FC<PatientStatisticsProps> = ({
  patients,
}) => {
  // Calculate active treatments count
  const activeTreatmentsCount = useMemo(() => {
    return patients.filter(patient => 
      // Consider a patient as having active treatment if next visit is scheduled
      patient.nextVisit && new Date(patient.nextVisit) > new Date()
    ).length;
  }, [patients]);

  // Calculate this week's appointments
  const thisWeeksAppointments = useMemo(() => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    return patients.filter(patient => {
      if (!patient.nextVisit) return false;
      const nextVisit = new Date(patient.nextVisit);
      return nextVisit >= today && nextVisit <= endOfWeek;
    }).length;
  }, [patients]);

  // Calculate new patients (registered in the last 30 days)
  const newPatientsCount = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return patients.filter(patient => {
      const lastVisit = new Date(patient.lastVisit);
      return lastVisit >= thirtyDaysAgo;
    }).length;
  }, [patients]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Patient Statistics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Total Patients</div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <UserRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{patients.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Registered in the system
          </div>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Active Treatments</div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <ActivitySquare className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{activeTreatmentsCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Ongoing patient care
          </div>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">This Week's Appointments</div>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <CalendarClock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{thisWeeksAppointments}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Scheduled for this week
          </div>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">New Patients (Monthly)</div>
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <BadgePlus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{newPatientsCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Added in the last 30 days
          </div>
        </div>
      </div>
    </div>
  );
};
