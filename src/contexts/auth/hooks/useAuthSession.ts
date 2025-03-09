import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from '../utils';
import { User } from '../types';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // First, check local storage for demo user
        const demoUserData = localStorage.getItem('demoUser');
        if (demoUserData) {
          const demoUser = JSON.parse(demoUserData);
          console.log('Found demo user in localStorage:', demoUser.email);
          setUser(demoUser);
          setIsLoading(false);
          return;
        }
        
        // Otherwise, check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const formattedUser = await formatUser(session.user);
          setUser(formattedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          const formattedUser = await formatUser(session?.user || null);
          setUser(formattedUser);
        }
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          // Also clear any demo user
          localStorage.removeItem('demoUser');
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Enhanced setUser function to also store demo users in localStorage
  const setUserWithStorage = (newUser: User | null) => {
    setUser(newUser);
    
    // If this is a demo user, store in localStorage
    if (newUser && (newUser.email === 'doctor@example.com' || newUser.email === 'patient@example.com')) {
      localStorage.setItem('demoUser', JSON.stringify(newUser));
      console.log('Stored demo user in localStorage:', newUser.email);
    } else if (newUser === null) {
      localStorage.removeItem('demoUser');
    }
  };

  return {
    user,
    setUser: setUserWithStorage,
    isLoading
  };
};
