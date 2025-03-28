
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
    
    // Get patient profile from profiles table (using the existing table)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching patient profile:', error);
      return null;
    }
    
    // Convert to PatientProfile format
    const patientProfile: PatientProfile = {
      id: profile.id,
      user_id: profile.id,
      first_name: profile.name?.split(' ')[0] || '',
      last_name: profile.name?.split(' ')[1] || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return patientProfile;
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
    // Extract name from first_name and last_name
    const name = updates.first_name && updates.last_name 
      ? `${updates.first_name} ${updates.last_name}`
      : undefined;
    
    // Update the profile in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        name: name,
        // Add other fields that match between PatientProfile and profiles table
      })
      .eq('id', patientId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating patient profile:', error);
      return null;
    }
    
    // Convert to PatientProfile format
    const patientProfile: PatientProfile = {
      id: data.id,
      user_id: data.id,
      first_name: data.name?.split(' ')[0] || '',
      last_name: data.name?.split(' ')[1] || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return patientProfile;
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
    // For now, we'll just return mock data
    // In a real implementation, you would create the profile in your database
    
    const mockProfile: PatientProfile = {
      id: patientId,
      user_id: patientId,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      date_of_birth: profileData.date_of_birth,
      gender: profileData.gender,
      blood_type: profileData.blood_type,
      allergies: profileData.allergies,
      emergency_contact: profileData.emergency_contact,
      phone_number: profileData.phone_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return mockProfile;
  } catch (error) {
    console.error('Error in createPatientProfile:', error);
    return null;
  }
};

// Fetch medical records for a patient - using mock data
export const getMedicalRecords = async (patientId: string): Promise<MedicalRecord[] | null> => {
  try {
    // Return mock data
    const mockRecords: MedicalRecord[] = [
      {
        id: '1',
        patient_id: patientId,
        doctor_id: 'doctor-123',
        record_type: 'Consultation',
        diagnosis: 'Common cold',
        treatment: 'Rest and fluids',
        notes: 'Patient should recover in a few days',
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    return mockRecords;
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
    // For now, we'll just return mock data
    // In a real implementation, you would add the record to your database
    
    const mockRecord: MedicalRecord = {
      id: Math.random().toString(36).substring(2, 15),
      patient_id: patientId,
      record_type: recordData.record_type,
      diagnosis: recordData.diagnosis,
      treatment: recordData.treatment,
      notes: recordData.notes,
      date: recordData.date,
      attachments: recordData.attachments,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return mockRecord;
  } catch (error) {
    console.error('Error in addMedicalRecord:', error);
    return null;
  }
};

// Update an existing medical record - using mock data
export const updateMedicalRecord = async (
  recordId: string,
  updates: Partial<MedicalRecord>
): Promise<MedicalRecord | null> => {
  try {
    // Return mock data
    const mockUpdatedRecord: MedicalRecord = {
      id: recordId,
      patient_id: updates.patient_id || 'patient-id',
      doctor_id: updates.doctor_id,
      record_type: updates.record_type || 'Consultation',
      diagnosis: updates.diagnosis,
      treatment: updates.treatment,
      notes: updates.notes,
      date: updates.date || new Date().toISOString().split('T')[0],
      attachments: updates.attachments,
      updated_at: new Date().toISOString()
    };
    
    return mockUpdatedRecord;
  } catch (error) {
    console.error('Error in updateMedicalRecord:', error);
    return null;
  }
};

// Delete a medical record - using mock data
export const deleteMedicalRecord = async (recordId: string): Promise<boolean> => {
  try {
    // In a real implementation, you would delete the record from your database
    // For now, just return success
    
    return true;
  } catch (error) {
    console.error('Error in deleteMedicalRecord:', error);
    return false;
  }
};
