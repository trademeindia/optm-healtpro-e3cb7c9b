
import { supabase } from '@/integrations/supabase/client';

/**
 * Saves data to the specified table for the current user
 * @param table The table name to save data to
 * @param data The data to save
 * @returns The saved data or null if there was an error
 */
export const saveUserData = async <T extends Record<string, any>>(
  table: string,
  data: T
): Promise<T | null> => {
  try {
    // Get the current user
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      console.error('No authenticated user found');
      return null;
    }
    
    // Add user_id and timestamps to the data
    const dataWithUser = {
      ...data,
      user_id: userId,
      updated_at: new Date().toISOString()
    };
    
    // If no id is provided, add created_at
    if (!data.id) {
      dataWithUser.created_at = dataWithUser.updated_at;
    }
    
    // For tables we know exist in the database
    if (
      table === 'profiles' || 
      table === 'appointments' || 
      table === 'fitness_connections' ||
      table === 'fitness_data' ||
      table === 'messages'
    ) {
      // Use type assertion to handle the generic type safely
      const { data: savedData, error } = await supabase
        .from(table)
        .upsert(dataWithUser as any, {
          onConflict: 'id'
        })
        .select();
        
      if (error) {
        console.error(`Error saving data to ${table}:`, error);
        return null;
      }
      
      // Assuming the first item in the array is the saved data
      return savedData.length > 0 ? (savedData[0] as T) : null;
    } else {
      // For mock data or tables that don't exist yet
      console.log(`Mocking data save to table ${table} for development`);
      return {
        ...dataWithUser,
        id: dataWithUser.id || Math.random().toString(36).substring(2, 15),
      } as T;
    }
  } catch (error) {
    console.error(`Error in saveUserData for table ${table}:`, error);
    return null;
  }
};

// Export a proper DataStorageService interface and implementation
export const dataStorageService = {
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

// Export type for the service
export type DataStorageService = typeof dataStorageService;

// Export the service instance
export { dataStorageService as DataStorageService };
