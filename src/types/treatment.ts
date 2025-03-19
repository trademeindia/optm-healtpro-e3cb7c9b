
export interface TreatmentTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'overdue';
  type: 'medication' | 'exercise' | 'checkup' | 'other';
  notes?: string;
}
