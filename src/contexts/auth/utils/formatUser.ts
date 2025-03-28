
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, Provider } from '../types';
import { SupabaseUser } from './types';

export async function formatUser(user?: SupabaseUser | null): Promise<User | null> {
  if (!user) return null;
  
  try {
    // Get the user's profile from the database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, role, picture, provider')
      .eq('id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error fetching user profile:', error);
      // Continue with available data only
    }

    // Determine provider: use profile if available, else infer from app_metadata
    let provider: Provider = 'email';
    if (profile?.provider) {
      provider = profile.provider as Provider;
    } else if (user.app_metadata?.provider) {
      provider = (user.app_metadata.provider === 'google' ? 'google' :
                 user.app_metadata.provider === 'facebook' ? 'facebook' :
                 user.app_metadata.provider === 'twitter' ? 'twitter' :
                 user.app_metadata.provider === 'github' ? 'github' : 'email') as Provider;
    }

    // Get name from profile > user_metadata > email prefix
    const name = profile?.name || 
                user.user_metadata?.name || 
                user.user_metadata?.full_name || 
                (user.email ? user.email.split('@')[0] : null);

    // Get role from profile > user_metadata > default to 'patient'
    const role = profile?.role || 
                (user.user_metadata?.role as UserRole) || 
                'patient';

    // Get picture from profile > user_metadata
    const picture = profile?.picture || 
                   user.user_metadata?.avatar_url || 
                   null;

    return {
      id: user.id,
      email: user.email || '',
      name,
      role,
      provider,
      picture,
      // If the user is a patient, add the patientId field
      ...(role === 'patient' ? { patientId: user.id } : {})
    };
  } catch (error) {
    console.error('Error formatting user:', error);
    return null;
  }
}
