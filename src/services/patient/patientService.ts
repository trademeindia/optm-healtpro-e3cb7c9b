
import { supabase } from '@/integrations/supabase/client';
import { PatientProfile } from '@/types/patient';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development
const mockPatientProfiles = [
  {
    id: '1',
    user_id: 'user-1',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1980-01-01',
    gender: 'Male',
    blood_type: 'A+',
    allergies: ['Penicillin'],
    emergency_contact: '555-1234',
    phone_number: '555-5678',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * Get a patient profile by ID
 */
export const getPatientProfile = async (patientId?: string): Promise<PatientProfile | null> => {
  if (!patientId) {
    try {
      // If no patientId provided, get current user
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) return null;
      
      // Try to get profile from database
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error || !data) {
          console.log('No patient profile found in database, using mock data');
          return mockPatientProfiles.find(p => p.user_id === userId) || null;
        }
        
        return {
          id: data.id,
          user_id: data.id,
          first_name: data.name?.split(' ')[0] || '',
          last_name: data.name?.split(' ').slice(1).join(' ') || '',
          date_of_birth: '',
          gender: '',
          blood_type: '',
          allergies: [],
          emergency_contact: '',
          phone_number: '',
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString()
        };
      } catch (err) {
        console.error('Error fetching patient profile:', err);
        return null;
      }
    } catch (err) {
      console.error('Error getting current session:', err);
      return null;
    }
  } else {
    // Get by specific patientId
    try {
      // Try getting from the database first
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();
        
      if (error || !data) {
        // Return mock data for development
        console.log('No patient profile found in database, using mock data');
        return mockPatientProfiles.find(p => p.id === patientId) || null;
      }
      
      return {
        id: data.id,
        user_id: data.id,
        first_name: data.name?.split(' ')[0] || '',
        last_name: data.name?.split(' ').slice(1).join(' ') || '',
        date_of_birth: '',
        gender: '',
        blood_type: '',
        allergies: [],
        emergency_contact: '',
        phone_number: '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    } catch (err) {
      console.error('Error fetching patient profile:', err);
      return mockPatientProfiles.find(p => p.id === patientId) || null;
    }
  }
};

/**
 * Get all medical records for a patient
 */
export const getPatientMedicalRecords = async (patientId: string): Promise<any[] | null> => {
  // For development, return mock data
  return [
    {
      id: '1',
      patient_id: patientId,
      record_type: 'Blood Test',
      diagnosis: 'Normal results',
      treatment: '',
      notes: 'All values within normal range',
      date: new Date().toISOString(),
      attachments: [],
    }
  ];
};

/**
 * Update a patient profile
 */
export const updatePatientProfile = async (patientId: string, updates: Partial<PatientProfile>): Promise<PatientProfile | null> => {
  try {
    if (!patientId) return null;
    
    // Try to update in database
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: `${updates.first_name} ${updates.last_name}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating patient profile:', error);
      // For development, update mock data
      const existingProfile = mockPatientProfiles.find(p => p.id === patientId);
      if (existingProfile) {
        Object.assign(existingProfile, updates, {
          updated_at: new Date().toISOString()
        });
        return existingProfile;
      }
      return null;
    }
    
    // Return the updated profile
    return {
      id: data.id,
      user_id: data.id,
      first_name: updates.first_name || data.name?.split(' ')[0] || '',
      last_name: updates.last_name || data.name?.split(' ').slice(1).join(' ') || '',
      date_of_birth: updates.date_of_birth || '',
      gender: updates.gender || '',
      blood_type: updates.blood_type || '',
      allergies: updates.allergies || [],
      emergency_contact: updates.emergency_contact || '',
      phone_number: updates.phone_number || '',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  } catch (err) {
    console.error('Error updating patient profile:', err);
    return null;
  }
};

// Export the service interface
export const patientService = {
  getPatientProfile,
  updatePatientProfile,
  getPatientMedicalRecords,
  
  createPatientProfile: async (patientId: string, profileData: Partial<PatientProfile>): Promise<PatientProfile | null> => {
    try {
      const { first_name = '', last_name = '' } = profileData;
      
      // Try to create in database
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          name: `${first_name} ${last_name}`,
          updated_at: new Date().toISOString() 
        })
        .eq('id', patientId)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating patient profile:', error);
        // For development, create mock data
        const newProfile = {
          id: patientId,
          user_id: patientId,
          first_name,
          last_name,
          date_of_birth: profileData.date_of_birth || '',
          gender: profileData.gender || '',
          blood_type: profileData.blood_type || '',
          allergies: profileData.allergies || [],
          emergency_contact: profileData.emergency_contact || '',
          phone_number: profileData.phone_number || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockPatientProfiles.push(newProfile);
        return newProfile;
      }
      
      // Return the created profile
      return {
        id: data.id,
        user_id: data.id,
        first_name,
        last_name,
        date_of_birth: profileData.date_of_birth || '',
        gender: profileData.gender || '',
        blood_type: profileData.blood_type || '',
        allergies: profileData.allergies || [],
        emergency_contact: profileData.emergency_contact || '',
        phone_number: profileData.phone_number || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    } catch (err) {
      console.error('Error creating patient profile:', err);
      return null;
    }
  }
};

// Export type for the service
export type PatientService = typeof patientService;
