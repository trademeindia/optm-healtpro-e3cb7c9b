
import { supabase } from '@/integrations/supabase/client';

/**
 * General storage service for saving application data to a database
 */
export const dataStorageService = {
  /**
   * Saves data to a specified table
   */
  saveData: async <T extends Record<string, any>>(
    tableName: string,
    data: T
  ): Promise<{ success: boolean; error?: any; data?: T }> => {
    try {
      // Get the current user ID if available
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      // Add userId to data if user is authenticated
      const dataWithUserId = userId ? { ...data, user_id: userId } : data;

      // Insert data into table
      const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert(dataWithUserId)
        .select();

      if (error) {
        throw error;
      }

      return { success: true, data: insertedData[0] as T };
    } catch (error) {
      console.error(`Error saving data to ${tableName}:`, error);
      return { success: false, error };
    }
  },

  /**
   * Retrieves data from a specified table with optional filters
   */
  getData: async <T>(
    tableName: string,
    options?: {
      filters?: Record<string, any>;
      limit?: number;
      page?: number;
      orderBy?: { column: string; ascending?: boolean };
      columns?: string;
      userScopedOnly?: boolean;
    }
  ): Promise<{ success: boolean; error?: any; data?: T[] }> => {
    try {
      const {
        filters,
        limit,
        page,
        orderBy,
        columns = '*',
        userScopedOnly = false,
      } = options || {};

      // Start building the query
      let query = supabase.from(tableName).select(columns);

      // Get the current user ID if available and filter by user_id if requested
      if (userScopedOnly) {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;

        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          // No user is logged in, but request was for user-scoped data
          return { success: true, data: [] };
        }
      }

      // Apply any other filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? true,
        });
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit);

        if (page && page > 1) {
          const offset = (page - 1) * limit;
          query = query.range(offset, offset + limit - 1);
        }
      }

      // Execute the query
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return { success: true, data: data as T[] };
    } catch (error) {
      console.error(`Error retrieving data from ${tableName}:`, error);
      return { success: false, error };
    }
  },

  /**
   * Updates data in a specified table
   */
  updateData: async <T>(
    tableName: string,
    id: string,
    data: Partial<T>
  ): Promise<{ success: boolean; error?: any; data?: T }> => {
    try {
      const { data: updatedData, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      return { success: true, data: updatedData[0] as T };
    } catch (error) {
      console.error(`Error updating data in ${tableName}:`, error);
      return { success: false, error };
    }
  },

  /**
   * Deletes data from a specified table
   */
  deleteData: async (
    tableName: string,
    id: string
  ): Promise<{ success: boolean; error?: any }> => {
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting data from ${tableName}:`, error);
      return { success: false, error };
    }
  },
};
