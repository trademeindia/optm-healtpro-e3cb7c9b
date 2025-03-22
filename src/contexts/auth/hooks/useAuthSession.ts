
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from '../utils';
import { User } from '../types';
import { toast } from 'sonner';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<Error | null>(null);
  const [initComplete, setInitComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        if (!mounted) return;
        setIsLoading(true);
        
        // First, check local storage for demo user
        const demoUserData = localStorage.getItem('demoUser');
        if (demoUserData) {
          try {
            const demoUser = JSON.parse(demoUserData);
            console.log('Found demo user in localStorage:', demoUser.email);
            
            // Ensure demo user has all required properties
            if (demoUser && demoUser.email && demoUser.role) {
              // Ensure the user object has all required properties
              const completeUser: User = {
                id: demoUser.id || `demo-${Date.now()}`,
                email: demoUser.email,
                name: demoUser.name || (
                  demoUser.email === 'admin@example.com' ? 'Admin Demo Account' : 
                  demoUser.email === 'doctor@example.com' ? 'Dr. Demo Account' : 
                  'Patient Demo'
                ),
                role: demoUser.role,
                provider: demoUser.provider || 'email',
                picture: demoUser.picture || null,
                patientId: demoUser.patientId || (demoUser.role === 'patient' ? 'demo-patient-id-123' : undefined)
              };
              
              if (mounted) {
                setUser(completeUser);
                setIsLoading(false);
                setInitComplete(true);
              }
              console.log('Successfully set demo user:', completeUser.email, 'with role:', completeUser.role);
              return;
            }
          } catch (e) {
            console.error('Error parsing demo user data:', e);
            // Don't remove demoUser here - it might be valid but we're having a temporary parsing issue
          }
        }
        
        // Otherwise, check Supabase session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setInitError(error);
            setIsLoading(false);
            setInitComplete(true);
          }
          return;
        }
        
        if (data.session) {
          console.log('Supabase session found, loading user profile');
          try {
            const formattedUser = await formatUser(data.session.user);
            if (mounted) {
              setUser(formattedUser);
              setInitComplete(true);
            }
          } catch (profileError) {
            console.error('Error loading user profile:', profileError);
            if (mounted) {
              setInitError(profileError instanceof Error ? profileError : new Error('Failed to load user profile'));
              setInitComplete(true);
            }
          }
        } else {
          console.log('No active session found');
          if (mounted) {
            setInitComplete(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setInitError(error instanceof Error ? error : new Error('Authentication initialization failed'));
          setInitComplete(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (!mounted) return;
        setIsLoading(true);
        
        try {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            if (session) {
              const formattedUser = await formatUser(session.user);
              if (mounted) {
                setUser(formattedUser);
              }
            }
          }
          
          if (event === 'SIGNED_OUT') {
            if (mounted) {
              setUser(null);
              // Also clear any demo user
              localStorage.removeItem('demoUser');
            }
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          if (mounted) {
            setInitError(error instanceof Error ? error : new Error('Failed to process authentication update'));
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Enhanced setUser function to also store demo users in localStorage
  const setUserWithStorage = (newUser: User | null) => {
    setUser(newUser);
    
    // If this is a demo user, store in localStorage
    if (newUser && ['admin@example.com', 'doctor@example.com', 'patient@example.com', 'receptionist@example.com'].includes(newUser.email)) {
      try {
        localStorage.setItem('demoUser', JSON.stringify(newUser));
        console.log('Stored demo user in localStorage:', newUser.email);
      } catch (error) {
        console.error('Error storing demo user in localStorage:', error);
      }
    } else if (newUser === null) {
      try {
        localStorage.removeItem('demoUser');
      } catch (error) {
        console.error('Error removing demo user from localStorage:', error);
      }
    }
  };

  return {
    user,
    setUser: setUserWithStorage,
    isLoading,
    error: initError,
    isInitialized: initComplete
  };
};
