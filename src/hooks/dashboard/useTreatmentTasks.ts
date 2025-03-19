
import { useState } from 'react';
import { TreatmentTask } from '@/types/treatment';

export const useTreatmentTasks = () => {
  // Mock treatment tasks data
  const [treatmentTasks] = useState<TreatmentTask[]>([
    {
      id: 't1',
      title: 'Take medication',
      description: 'Ibuprofen 400mg with food',
      dueDate: new Date(Date.now() + 3600000 * 4).toISOString(),
      priority: 'high',
      status: 'pending',
      type: 'medication'
    },
    {
      id: 't2',
      title: 'Physical therapy exercises',
      description: 'Complete the knee recovery routine',
      dueDate: new Date(Date.now() + 3600000 * 8).toISOString(),
      priority: 'medium',
      status: 'pending',
      type: 'exercise'
    },
    {
      id: 't3',
      title: 'MRI scan appointment',
      description: 'Check-in 15 minutes before appointment',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      priority: 'medium',
      status: 'pending',
      type: 'checkup'
    }
  ]);

  return treatmentTasks;
};
