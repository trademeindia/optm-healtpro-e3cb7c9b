
import { supabase } from '@/integrations/supabase/client';
import { Patient, PatientSearchParams, PatientData } from '@/types/patient';

// Function to get patients with optional filters
export async function getPatients(
  searchParams?: PatientSearchParams
): Promise<Patient[]> {
  try {
    let query = supabase.from('patients').select('*');

    // Apply filters if provided
    if (searchParams?.search) {
      const search = `%${searchParams.search}%`;
      query = query.or(`first_name.ilike.${search},last_name.ilike.${search},email.ilike.${search}`);
    }

    // Get only patients for the current doctor (if doctor is logged in)
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    
    if (user && user.user_metadata?.role === 'doctor') {
      query = query.eq('doctor_id', user.id);
    }

    // Pagination
    if (searchParams?.page && searchParams?.pageSize) {
      const from = (searchParams.page - 1) * searchParams.pageSize;
      const to = from + searchParams.pageSize - 1;
      query = query.range(from, to);
    }

    // Sorting
    if (searchParams?.sort) {
      query = query.order(searchParams.sort.field, {
        ascending: searchParams.sort.direction === 'asc',
      });
    } else {
      // Default sorting
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting patients:', error);
    throw error;
  }
}

// Function to get a single patient by ID
export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error getting patient with ID ${id}:`, error);
    return null;
  }
}

// Create a new patient
export async function createPatient(patientData: PatientData): Promise<Patient> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
}

// Update an existing patient
export async function updatePatient(
  id: string,
  patientData: Partial<PatientData>
): Promise<Patient> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating patient with ID ${id}:`, error);
    throw error;
  }
}

// Delete a patient
export async function deletePatient(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('patients').delete().eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting patient with ID ${id}:`, error);
    throw error;
  }
}
