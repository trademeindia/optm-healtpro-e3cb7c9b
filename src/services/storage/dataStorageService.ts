
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
      const { data: savedData, error } = await supabase
        .from(table)
        .upsert(dataWithUser, {
          onConflict: 'id'
        })
        .select();
        
      if (error) {
        console.error(`Error saving data to ${table}:`, error);
        return null;
      }
      
      // Assuming the first item in the array is the saved data
      return savedData.length > 0 ? savedData[0] as T : null;
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
