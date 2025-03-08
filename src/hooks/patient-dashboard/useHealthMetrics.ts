
import React from 'react';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { Heart, Activity, Thermometer, Wind } from 'lucide-react';

// Helper functions for health metrics
export const getHeartRate = (fitnessData: FitnessData) => {
  if (fitnessData.heartRate) {
    return {
      title: 'Heart Rate',
      value: fitnessData.heartRate.value,
      unit: fitnessData.heartRate.unit,
      status: 'normal' as const,
      change: fitnessData.heartRate.change || 0,
      source: fitnessData.heartRate.source,
      lastUpdated: new Date(fitnessData.heartRate.timestamp).toLocaleTimeString(),
      icon: React.createElement(Heart, { size: 16 })
    };
  }
  return { 
    title: 'Heart Rate', 
    value: 72, 
    unit: 'bpm', 
    status: 'normal' as const, 
    change: -3,
    icon: React.createElement(Heart, { size: 16 })
  };
};

export const getBloodPressure = (fitnessData: FitnessData) => {
  if (fitnessData.bloodPressure) {
    return {
      title: 'Blood Pressure',
      value: fitnessData.bloodPressure.value,
      unit: fitnessData.bloodPressure.unit,
      status: 'normal' as const,
      change: 0,
      source: fitnessData.bloodPressure.source,
      lastUpdated: new Date(fitnessData.bloodPressure.timestamp).toLocaleTimeString(),
      icon: React.createElement(Activity, { size: 16 })
    };
  }
  return { 
    title: 'Blood Pressure', 
    value: '120/80', 
    unit: 'mmHg', 
    status: 'normal' as const, 
    change: 0,
    icon: React.createElement(Activity, { size: 16 })
  };
};

export const getTemperature = (fitnessData: FitnessData) => {
  if (fitnessData.temperature) {
    return {
      title: 'Temperature',
      value: fitnessData.temperature.value,
      unit: fitnessData.temperature.unit,
      status: 'normal' as const,
      change: fitnessData.temperature.change || 0.2,
      source: fitnessData.temperature.source,
      lastUpdated: new Date(fitnessData.temperature.timestamp).toLocaleTimeString(),
      icon: React.createElement(Thermometer, { size: 16 })
    };
  }
  return { 
    title: 'Temperature', 
    value: 98.6, 
    unit: '°F', 
    status: 'normal' as const, 
    change: 0.2,
    icon: React.createElement(Thermometer, { size: 16 })
  };
};

export const getOxygen = (fitnessData: FitnessData) => {
  if (fitnessData.oxygenSaturation) {
    return {
      title: 'Oxygen',
      value: fitnessData.oxygenSaturation.value,
      unit: fitnessData.oxygenSaturation.unit,
      status: 'normal' as const,
      change: fitnessData.oxygenSaturation.change || 1,
      source: fitnessData.oxygenSaturation.source,
      lastUpdated: new Date(fitnessData.oxygenSaturation.timestamp).toLocaleTimeString(),
      icon: React.createElement(Wind, { size: 16 })
    };
  }
  return { 
    title: 'Oxygen', 
    value: 98, 
    unit: '%', 
    status: 'normal' as const, 
    change: 1,
    icon: React.createElement(Wind, { size: 16 })
  };
};
