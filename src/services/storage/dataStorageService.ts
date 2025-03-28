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
    
    // Insert or update the data
    const { data: savedData, error } = await supabase
      .from(table)
      .upsert(dataWithUser, {
        onConflict: 'id'
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error saving data to ${table}:`, error);
      return null;
    }
    
    return savedData;
  } catch (error) {
    console.error(`Error in saveUserData for table ${table}:`, error);
    return null;
  }
};
