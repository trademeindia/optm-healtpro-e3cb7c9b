
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xjxxuqqyjqzgmvtgrpgv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeHh1cXF5anF6Z212dGdycGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTEwNTksImV4cCI6MjA1NzA4NzA1OX0.ENwkIBR2DQBztLNrZB7oZ3JQ1zRKEAXWfyDTtjqPzOI";

// Create and export the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  },
});

// Export helper functions for working with health app data
export const healthAppsApi = {
  async getConnections(userId: string) {
    // Using raw query since the types file doesn't include these tables yet
    return supabase
      .from('fitness_connections')
      .select('*')
      .eq('user_id', userId);
  },
  
  async getLatestHealthData(userId: string, provider: string, dataType: string) {
    // Using raw query since the types file doesn't include these tables yet
    return supabase
      .from('fitness_data')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', dataType)
      .eq('data_type', dataType)
      .order('timestamp', { ascending: false })
      .limit(1);
  },
  
  async getHealthDataHistory(userId: string, provider: string, dataType: string, limit = 30) {
    // Using raw query since the types file doesn't include these tables yet
    return supabase
      .from('fitness_data')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .eq('data_type', dataType)
      .order('timestamp', { ascending: false })
      .limit(limit);
  }
};
