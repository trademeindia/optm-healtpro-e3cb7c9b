
export interface PatientProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  blood_type?: string;
  allergies?: string[];
  emergency_contact?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id?: string;
  record_type: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  date: string;
  attachments?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface MedicalHistory {
  id: string;
  patient_id: string;
  condition: string;
  diagnosed_date?: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Medication {
  id: string;
  patient_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  prescribing_doctor?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientActivity {
  id: string;
  patient_id: string;
  activity_type: string;
  duration: number;
  calories_burned?: number;
  distance?: number;
  notes?: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface HealthMetric {
  id: string;
  patient_id: string;
  metric_type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'temperature' | 'oxygen' | 'other';
  value: number | string;
  unit: string;
  timestamp: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
