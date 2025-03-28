
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/contexts/auth/types';
import { saveUserData } from './storage/dataStorageService';
import { getPatientProfile } from './patient/patientService';
import { DataStorageService, PatientService } from './types';

// This is just a placeholder implementation since we don't have the actual services
const dataStorageService: DataStorageService = {
  saveData: saveUserData,
  getData: async <T extends Record<string, any>>(table: string, id: string): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error getting data from ${table}:`, error);
        return null;
      }
      
      return data as T;
    } catch (error) {
      console.error(`Error in getData for table ${table}:`, error);
      return null;
    }
  },
  getDataByUserId: async <T extends Record<string, any>>(table: string, userId: string): Promise<T[] | null> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error(`Error getting data from ${table}:`, error);
        return null;
      }
      
      return data as T[];
    } catch (error) {
      console.error(`Error in getDataByUserId for table ${table}:`, error);
      return null;
    }
  },
  deleteData: async (table: string, id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting data from ${table}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in deleteData for table ${table}:`, error);
      return false;
    }
  }
};

const patientService: PatientService = {
  getPatientProfile,
  updatePatientProfile: async (patientId: string, updates: Partial<any>) => {
    // Mock implementation
    return null;
  },
  createPatientProfile: async (patientId: string, profileData: Partial<any>) => {
    // Mock implementation
    return null;
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
