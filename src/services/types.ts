
import { PatientProfile } from "@/types/patient";

// Export types that are used by various services
export interface DataStorageService {
  saveData: <T extends Record<string, any>>(table: string, data: T) => Promise<T | null>;
  getData: <T extends Record<string, any>>(table: string, id: string) => Promise<T | null>;
  getDataByUserId: <T extends Record<string, any>>(table: string, userId: string) => Promise<T[] | null>;
  deleteData: (table: string, id: string) => Promise<boolean>;
}

export interface PatientService {
  getPatientProfile: (patientId?: string) => Promise<PatientProfile | null>;
  updatePatientProfile: (patientId: string, updates: Partial<PatientProfile>) => Promise<PatientProfile | null>;
  createPatientProfile: (patientId: string, profileData: Partial<PatientProfile>) => Promise<PatientProfile | null>;
}
