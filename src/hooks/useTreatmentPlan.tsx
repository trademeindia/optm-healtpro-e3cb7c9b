
import { useState } from 'react';

interface TreatmentTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export const useTreatmentPlan = () => {
  // Mock data for treatment tasks
  const [treatmentTasks] = useState<TreatmentTask[]>([
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
  ]);

  const calculateProgress = (): number => {
    const completedCount = treatmentTasks.filter(task => task.completed).length;
    return Math.round((completedCount / treatmentTasks.length) * 100);
  };

  return {
    treatmentTasks,
    progress: calculateProgress()
  };
};
