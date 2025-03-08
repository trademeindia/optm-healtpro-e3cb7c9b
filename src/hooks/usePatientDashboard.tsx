
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';

export const usePatientDashboard = () => {
  const { toast } = useToast();
  const { 
    providers, 
    fitnessData, 
    refreshProviderData 
  } = useFitnessIntegration();

  // Mock data for activity tracking
  const activityData = [
    { day: 'Mon', value: 8500 },
    { day: 'Tue', value: 9200 },
    { day: 'Wed', value: 7800 },
    { day: 'Thu', value: 8100 },
    { day: 'Fri', value: 10200 },
    { day: 'Sat', value: 6500 },
    { day: 'Sun', value: 7300 }
  ];

  // Mock data for treatment tasks
  const treatmentTasks = [
    {
      id: '1',
      title: 'Heat therapy - 15 minutes',
      time: '08:00 AM',
      completed: true
    },
    {
      id: '2',
      title: 'Stretching exercises - Series A',
      time: '11:30 AM',
      completed: true
    },
    {
      id: '3',
      title: 'Apply anti-inflammatory cream',
      time: '02:00 PM',
      completed: false
    },
    {
      id: '4',
      title: 'Resistance band exercises',
      time: '05:00 PM',
      completed: false
    }
  ];

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: '1',
      date: 'June 20, 2023',
      time: '10:30 AM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Follow-up'
    },
    {
      id: '2',
      date: 'July 5, 2023',
      time: '02:00 PM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Physical Therapy'
    }
  ];

  // Function to handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    toast({
      title: "Appointment Confirmed",
      description: "Your appointment has been confirmed.",
    });
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: "Your request to reschedule has been sent.",
    });
  };

  // Function to handle sync of all health data
  const handleSyncAllData = async () => {
    const connectedProviders = providers.filter(p => p.isConnected);
    if (connectedProviders.length === 0) {
      toast({
        title: "No connected apps",
        description: "Please connect a health app to sync data.",
      });
      return;
    }

    toast({
      title: "Syncing data",
      description: "Syncing data from all connected health apps...",
    });

    // Sync data from all connected providers
    for (const provider of connectedProviders) {
      await refreshProviderData(provider.id);
    }

    toast({
      title: "Sync complete",
      description: "Your health data has been updated.",
    });
  };

  // Helper functions for health metrics
  const getHeartRate = () => {
    if (fitnessData.heartRate) {
      return {
        value: fitnessData.heartRate.value,
        unit: fitnessData.heartRate.unit,
        change: fitnessData.heartRate.change || 0,
        source: fitnessData.heartRate.source,
        lastSync: new Date(fitnessData.heartRate.timestamp).toLocaleTimeString()
      };
    }
    return { value: 72, unit: 'bpm', change: -3 };
  };

  const getBloodPressure = () => {
    if (fitnessData.bloodPressure) {
      return {
        value: fitnessData.bloodPressure.value,
        unit: fitnessData.bloodPressure.unit,
        change: 0,
        source: fitnessData.bloodPressure.source,
        lastSync: new Date(fitnessData.bloodPressure.timestamp).toLocaleTimeString()
      };
    }
    return { value: '120/80', unit: 'mmHg', change: 0 };
  };

  const getTemperature = () => {
    if (fitnessData.temperature) {
      return {
        value: fitnessData.temperature.value,
        unit: fitnessData.temperature.unit,
        change: fitnessData.temperature.change || 0.2,
        source: fitnessData.temperature.source,
        lastSync: new Date(fitnessData.temperature.timestamp).toLocaleTimeString()
      };
    }
    return { value: 98.6, unit: '°F', change: 0.2 };
  };

  const getOxygen = () => {
    if (fitnessData.oxygenSaturation) {
      return {
        value: fitnessData.oxygenSaturation.value,
        unit: fitnessData.oxygenSaturation.unit,
        change: fitnessData.oxygenSaturation.change || 1,
        source: fitnessData.oxygenSaturation.source,
        lastSync: new Date(fitnessData.oxygenSaturation.timestamp).toLocaleTimeString()
      };
    }
    return { value: 98, unit: '%', change: 1 };
  };

  const getSteps = () => {
    return fitnessData.steps ? {
      data: activityData,
      currentValue: Number(fitnessData.steps.value),
      source: fitnessData.steps.source,
      lastSync: new Date(fitnessData.steps.timestamp).toLocaleTimeString()
    } : { data: activityData, currentValue: 8152 };
  };

  // Get processed health metrics
  const healthMetrics = {
    heartRate: getHeartRate(),
    bloodPressure: getBloodPressure(),
    temperature: getTemperature(),
    oxygen: getOxygen()
  };
  
  const steps = getSteps();
  const hasConnectedApps = providers.some(p => p.isConnected);

  return {
    activityData: steps,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    hasConnectedApps,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData
  };
};

export default usePatientDashboard;
