
import { supabase } from '@/integrations/supabase/client';
import { Provider, UserSession } from './types';

/**
 * Creates a user profile in the database
 */
export const createUserProfile = async (
  id: string,
  email: string,
  name: string,
  role: 'doctor' | 'patient' | 'receptionist',
  provider: Provider,
  picture: string
): Promise<UserSession | null> => {
  try {
    console.log('Creating user profile', { id, email, name, role, provider, picture });
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single() as any;
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching existing profile:', fetchError);
      return null;
    }
    
    if (existingProfile) {
      console.log('Profile already exists, returning existing profile');
      
      const userSession: UserSession = {
        id: existingProfile.id,
        email: existingProfile.email,
        name: existingProfile.name,
        role: existingProfile.role,
        provider: existingProfile.provider,
        picture: existingProfile.picture
      };
      
      return userSession;
    }
    
    // Create new profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id,
        email,
        name,
        role,
        provider,
        picture
      })
      .select()
      .single() as any;
      
    if (insertError) {
      console.error('Error creating user profile:', insertError);
      return null;
    }
    
    const userSession: UserSession = {
      id: newProfile.id,
      email: newProfile.email,
      name: newProfile.name,
      role: newProfile.role,
      provider: newProfile.provider,
      picture: newProfile.picture
    };
    
    return userSession;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
};

/**
 * Gets a user session from the database
 */
export const getUserSession = async (userId: string): Promise<UserSession | null> => {
  try {
    // Get profile from database
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single() as any;
      
    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
    
    // If no profile found
    if (!data) {
      console.log('No profile found for user', userId);
      return null;
    }
    
    // Return user session
    const userSession: UserSession = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      provider: data.provider,
      picture: data.picture
    };
    
    return userSession;
  } catch (error) {
    console.error('Error in getUserSession:', error);
    return null;
  }
};

/**
 * Gets the current authenticated user session 
 */
export const getCurrentSession = async (): Promise<UserSession | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting current session:', error);
      return null;
    }
    
    if (!session) {
      console.log('No active session found');
      return null;
    }
    
    const userId = session.user.id;
    return await getUserSession(userId);
  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    return null;
  }
};

/**
 * Checks if the current user has the required role
 */
export const hasRole = async (
  requiredRole: 'doctor' | 'patient' | 'receptionist' | 'any'
): Promise<boolean> => {
  try {
    const userSession = await getCurrentSession();
    
    if (!userSession) {
      return false;
    }
    
    if (requiredRole === 'any') {
      return true;
    }
    
    return userSession.role === requiredRole;
  } catch (error) {
    console.error('Error in hasRole:', error);
    return false;
  }
};
