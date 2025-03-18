import { useState, useEffect } from 'react';
import { supabase, getConnectionStatus } from '@/integrations/supabase/client';
import { formatUser } from '../utils';
import { User } from '../types';
import { toast } from 'sonner';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let sessionCheckTimeout: number | null = null;

    const initializeAuth = async () => {
      if (!isMounted) return;
      
      try {
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
                id: demoUser.id || `demo-${demoUser.role}-${Date.now()}`,
                email: demoUser.email,
                name: demoUser.name || (
                  demoUser.email === 'admin@example.com' ? 'Admin Demo Account' : 
                  demoUser.email === 'doctor@example.com' ? 'Dr. Demo Account' : 
                  'Patient Demo'
                ),
                role: demoUser.role,
                provider: demoUser.provider || 'email',
                picture: demoUser.picture || null,
                patientId: demoUser.patientId || (demoUser.role === 'patient' ? `demo-patient-id-${Date.now()}` : undefined)
              };
              
              if (isMounted) {
                setUser(completeUser);
                setIsLoading(false);
              }
              return;
            }
          } catch (e) {
            console.error('Error parsing demo user data:', e);
            localStorage.removeItem('demoUser');
          }
        }
        
        // Check connection status before attempting to get the session
        const { isConnected, hasFailedCompletely } = getConnectionStatus();
        
        if (!isConnected && hasFailedCompletely) {
          console.log('Supabase completely failed to connect, skipping session check');
          setIsLoading(false);
          return;
        }
        
        // Otherwise, check Supabase session with timeout
        const timeoutPromise = new Promise<{data: {session: null}, error: Error}>((_, reject) => {
          sessionCheckTimeout = window.setTimeout(() => {
            reject(new Error('Session check timed out'));
          }, 5000);
        });
        
        const { data, error } = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]);
        
        if (sessionCheckTimeout) {
          clearTimeout(sessionCheckTimeout);
          sessionCheckTimeout = null;
        }
        
        if (error) {
          console.error('Error getting session:', error);
          setLastError(error);
          
          // Implement retry logic with exponential backoff
          if (retryCount < 2) {
            const nextRetryDelay = Math.pow(2, retryCount) * 1000;
            console.log(`Retrying session check in ${nextRetryDelay}ms (attempt ${retryCount + 1})`);
            
            setTimeout(() => {
              if (isMounted) {
                setRetryCount(prev => prev + 1);
                initializeAuth();
              }
            }, nextRetryDelay);
          } else {
            // After max retries, stop trying and show error
            if (retryCount === 2) {
              toast.error('Authentication service unavailable', {
                description: 'Using local data instead',
                duration: 4000
              });
            }
            if (isMounted) {
              setIsLoading(false);
            }
          }
          return;
        }
        
        if (data.session) {
          console.log('Supabase session found, loading user profile');
          try {
            const formattedUser = await formatUser(data.session.user);
            if (isMounted) {
              setUser(formattedUser);
            }
          } catch (profileError) {
            console.error('Error formatting user from session:', profileError);
            if (isMounted) {
              setLastError(profileError as Error);
            }
          }
        } else {
          console.log('No active session found');
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setLastError(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (!isMounted) return;
        
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          if (session) {
            try {
              const formattedUser = await formatUser(session.user);
              if (isMounted) {
                setUser(formattedUser);
              }
            } catch (error) {
              console.error('Error formatting user after auth state change:', error);
            }
          }
        }
        
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            // Also clear any demo user
            localStorage.removeItem('demoUser');
          }
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (sessionCheckTimeout) {
        clearTimeout(sessionCheckTimeout);
      }
    };
  }, [retryCount]);

  // Enhanced setUser function to also store demo users in localStorage
  const setUserWithStorage = (newUser: User | null) => {
    setUser(newUser);
    
    // If this is a demo user, store in localStorage
    if (newUser && ['admin@example.com', 'doctor@example.com', 'patient@example.com'].includes(newUser.email)) {
      localStorage.setItem('demoUser', JSON.stringify(newUser));
      console.log('Stored demo user in localStorage:', newUser.email);
    } else if (newUser === null) {
      // Always clear localStorage when setting user to null
      localStorage.removeItem('demoUser');
      console.log('Cleared demo user from localStorage');
    }
  };

  return {
    user,
    setUser: setUserWithStorage,
    isLoading,
    error: lastError
  };
};
