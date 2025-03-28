
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/contexts/auth/types';
import { saveUserData } from './storage/dataStorageService';
import { getPatientProfile } from './patient/patientService';
import { dataStorageService } from './storage/dataStorageService';
import { patientService } from './patient/patientService';

// Create a DataSyncService for better typings
export const dataSyncService = {
  getDataFromTable: async <T extends Record<string, any>>(table: string, id: string): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error getting data from ${table}:`, error);
        return null;
      }
      
      return data as unknown as T;
    } catch (error) {
      console.error(`Error in getDataFromTable for table ${table}:`, error);
      return null;
    }
  },

  getDataByUserFromTable: async <T extends Record<string, any>>(table: string, userId: string): Promise<T[] | null> => {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error(`Error getting data from ${table} for user ${userId}:`, error);
        return null;
      }
      
      return data as unknown as T[];
    } catch (error) {
      console.error(`Error in getDataByUserFromTable for table ${table}:`, error);
      return null;
    }
  },

  deleteDataFromTable: async (table: string, id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting data from ${table}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in deleteDataFromTable for table ${table}:`, error);
      return false;
    }
  },

  getPatientData: async (patientId: string) => {
    return await patientService.getPatientProfile(patientId);
  },

  processMedicalReport: async (report: any, patient: any) => {
    // Mock implementation for processing medical reports
    console.log(`Processing medical report for patient ${patient.id}`);
    
    // In a real implementation, we would send this to an API for analysis
    const mockAnalysis = {
      id: `analysis-${Date.now()}`,
      patientId: patient.id,
      timestamp: new Date().toISOString(),
      findings: [
        { name: 'Glucose', value: '95 mg/dL', status: 'normal' },
        { name: 'Cholesterol', value: '180 mg/dL', status: 'normal' }
      ]
    };
    
    return { analysis: mockAnalysis };
  }
};

export const syncUserProfile = async (user: User): Promise<boolean> => {
  try {
    // Get existing patient profile
    const existingProfile = await patientService.getPatientProfile(user.id);
    
    if (!existingProfile) {
      // Create a new profile
      const newProfile = {
        user_id: user.id,
        first_name: user.name ? user.name.split(' ')[0] : '',
        last_name: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: user.email
      };
      
      await dataStorageService.saveData('profiles', newProfile);
    } else {
      // Update existing profile
      const updates = {
        id: existingProfile.id,
        email: user.email,
        name: user.name
      };
      
      await dataStorageService.saveData('profiles', updates);
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing user profile:', error);
    return false;
  }
};

// Export the DataSyncService type
export type DataSyncService = typeof dataSyncService;
// Export the service instance
export { dataSyncService as DataSyncService };
