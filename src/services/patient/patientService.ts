import { supabase } from '@/integrations/supabase/client';
import { PatientProfile, MedicalRecord } from '@/types/patient';

// Fetch patient profile
export const getPatientProfile = async (patientId?: string): Promise<PatientProfile | null> => {
  try {
    let userId = patientId;
    
    // If no patient ID provided, use the current user
    if (!userId) {
      const { data } = await supabase.auth.getSession();
      userId = data.session?.user?.id;
      
      if (!userId) {
        console.error('No patient ID provided and no user is authenticated');
        return null;
      }
    }
    
    // Get patient profile
    const { data: profile, error } = await supabase
      .from('patient_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching patient profile:', error);
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Error in getPatientProfile:', error);
    return null;
  }
};

// Update patient profile
export const updatePatientProfile = async (
  patientId: string,
  updates: Partial<PatientProfile>
): Promise<PatientProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('patient_profiles')
      .update(updates)
      .eq('user_id', patientId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating patient profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updatePatientProfile:', error);
    return null;
  }
};

// Create patient profile
export const createPatientProfile = async (
  patientId: string,
  profileData: Omit<PatientProfile, 'id' | 'created_at' | 'updated_at'>
): Promise<PatientProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('patient_profiles')
      .insert([
        {
          ...profileData,
          user_id: patientId
        }
      ])
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating patient profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createPatientProfile:', error);
    return null;
  }
};

// Fetch medical records for a patient
export const getMedicalRecords = async (patientId: string): Promise<MedicalRecord[] | null> => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching medical records:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getMedicalRecords:', error);
    return null;
  }
};

// Add a new medical record for a patient
export const addMedicalRecord = async (
  patientId: string,
  recordData: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>
): Promise<MedicalRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([
        {
          ...recordData,
          patient_id: patientId
        }
      ])
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding medical record:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addMedicalRecord:', error);
    return null;
  }
};

// Update an existing medical record
export const updateMedicalRecord = async (
  recordId: string,
  updates: Partial<MedicalRecord>
): Promise<MedicalRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .update(updates)
      .eq('id', recordId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating medical record:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateMedicalRecord:', error);
    return null;
  }
};

// Delete a medical record
export const deleteMedicalRecord = async (recordId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('medical_records')
      .delete()
      .eq('id', recordId);
    
    if (error) {
      console.error('Error deleting medical record:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMedicalRecord:', error);
    return false;
  }
};
