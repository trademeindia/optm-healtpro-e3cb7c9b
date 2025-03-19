
import { HealthMetric } from '@/types/health';
import { TreatmentTask } from '@/types/treatment';
import { AppointmentWithProvider } from '@/types/appointments';

/**
 * Transforms HealthMetric[] to the expected format for dashboard components
 */
export const transformHealthMetrics = (metrics: HealthMetric[]) => {
  const heartRateMetric = metrics.find(m => m.name === 'Heart Rate') || { 
    id: 'default-hr', 
    name: 'Heart Rate',
    value: 0, 
    unit: 'bpm', 
    change: 0,
    source: '',
    lastSync: ''
  };
  
  const bloodPressureMetric = metrics.find(m => m.name === 'Blood Pressure') || { 
    id: 'default-bp',
    name: 'Blood Pressure',
    value: '120/80', 
    unit: 'mmHg', 
    change: 0,
    source: '',
    lastSync: ''
  };
  
  const temperatureMetric = metrics.find(m => m.name === 'Temperature') || { 
    id: 'default-temp',
    name: 'Temperature',
    value: 98.6, 
    unit: '°F', 
    change: 0,
    source: '',
    lastSync: ''
  };
  
  const oxygenMetric = metrics.find(m => m.name === 'Oxygen Saturation') || { 
    id: 'default-o2',
    name: 'Oxygen Saturation',
    value: 98, 
    unit: '%', 
    change: 0,
    source: '',
    lastSync: ''
  };

  return {
    heartRate: {
      value: heartRateMetric.value,
      unit: heartRateMetric.unit,
      change: heartRateMetric.change || 0,
      source: heartRateMetric.source,
      lastSync: heartRateMetric.lastSync
    },
    bloodPressure: {
      value: bloodPressureMetric.value as string,
      unit: bloodPressureMetric.unit,
      change: bloodPressureMetric.change || 0,
      source: bloodPressureMetric.source,
      lastSync: bloodPressureMetric.lastSync
    },
    temperature: {
      value: temperatureMetric.value,
      unit: temperatureMetric.unit,
      change: temperatureMetric.change || 0,
      source: temperatureMetric.source,
      lastSync: temperatureMetric.lastSync
    },
    oxygen: {
      value: oxygenMetric.value,
      unit: oxygenMetric.unit,
      change: oxygenMetric.change || 0,
      source: oxygenMetric.source,
      lastSync: oxygenMetric.lastSync
    }
  };
};

/**
 * Transforms activity data to the expected format for dashboard components
 */
export const transformActivityData = (fitnessData: any) => {
  return {
    data: fitnessData.steps?.data?.map((item: any) => ({
      day: new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
      value: item.value
    })) || [],
    currentValue: fitnessData.steps?.summary?.total || 0,
    source: fitnessData.steps?.source || 'Fitness Tracker',
    lastSync: fitnessData.steps?.lastSync || new Date().toISOString()
  };
};

/**
 * Transforms TreatmentTask[] to the expected format for dashboard components
 */
export const transformTreatmentTasks = (tasks: TreatmentTask[]) => {
  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    time: task.dueTime || '12:00 PM',
    completed: task.status === 'completed'
  }));
};

/**
 * Transforms AppointmentWithProvider[] to the expected format for dashboard components
 */
export const transformAppointments = (appointments: AppointmentWithProvider[]) => {
  return appointments.map(appointment => ({
    id: appointment.id,
    date: appointment.date,
    time: appointment.time,
    doctor: appointment.provider?.name || 'Doctor',
    type: appointment.type
  }));
};
