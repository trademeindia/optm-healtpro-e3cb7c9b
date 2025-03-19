
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthProviderType } from './types';

export const formatUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
  if (!supabaseUser) return null;

  try {
    console.log("Formatting user:", supabaseUser.id);
    
    // Get provider information from the user metadata
    // Ensure provider is of type AuthProviderType
    const providerInfo: AuthProviderType = 
      (supabaseUser.app_metadata?.provider as AuthProviderType) || 
      (supabaseUser.identities && supabaseUser.identities.length > 0 ? 
        supabaseUser.identities[0].provider as AuthProviderType : 'email');
    
    // Get name from user metadata or identity data for OAuth users
    let userName = '';
    let userPicture = '';
    
    if (providerInfo !== 'email') {
      // For OAuth users, try to get name and picture from identity data
      if (supabaseUser.user_metadata) {
        userName = supabaseUser.user_metadata.full_name || 
                   supabaseUser.user_metadata.name || 
                   supabaseUser.user_metadata.user_name || 
                   '';
                   
        userPicture = supabaseUser.user_metadata.avatar_url || 
                      supabaseUser.user_metadata.picture || 
                      '';
      }
    }
    
    // Type-safe query using explicit casting
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If we can't find a profile but we have OAuth data, we could create a default profile
      if (providerInfo !== 'email' && userName) {
        console.log("No profile found but have OAuth data - creating default profile");
        
        // Default to patient role for OAuth users
        const defaultRole: UserRole = 'patient';
        
        // Insert a new profile for the OAuth user
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: userName,
            role: defaultRole,
            provider: providerInfo,
            picture: userPicture
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating user profile:', insertError);
          return null;
        }
        
        return {
          id: newProfile.id,
          email: newProfile.email,
          name: newProfile.name,
          role: newProfile.role as UserRole,
          provider: newProfile.provider as AuthProviderType,
          picture: newProfile.picture,
          // Handle patient_id in a type-safe way
          patientId: newProfile.patient_id || undefined
        };
      }
      
      return null;
    }

    if (!data) return null;

    // Type-safe access to profile data
    return {
      id: data.id,
      email: data.email,
      name: data.name || userName || '',
      role: (data.role as UserRole) || 'patient',
      provider: (data.provider as AuthProviderType) || providerInfo,
      picture: data.picture || userPicture || null,
      // Handle patient_id in a type-safe way - use optional chaining or hasOwnProperty
      patientId: data.hasOwnProperty('patient_id') ? data.patient_id : undefined
    };
  } catch (error) {
    console.error('Error formatting user:', error);
    return null;
  }
};
