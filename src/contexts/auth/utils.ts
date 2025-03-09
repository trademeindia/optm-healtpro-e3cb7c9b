
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthProviderType } from './types';
import { Database } from '@/integrations/supabase/types';

export const formatUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
  if (!supabaseUser) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      name: data.name || '',
      role: data.role as UserRole,
      provider: data.provider as AuthProviderType,
      picture: data.picture
    };
  } catch (error) {
    console.error('Error formatting user:', error);
    return null;
  }
};
