
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthSession } from './types';

export class AuthStateManager {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async getSession(): Promise<AuthSession> {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      return {
        user: data.session?.user || null,
        session: data.session,
      };
    } catch (error) {
      console.error('Error getting session:', error);
      return { user: null, session: null };
    }
  }

  subscribeToAuthChanges(callback: (session: AuthSession) => void): () => void {
    const { data } = this.supabase.auth.onAuthStateChange((event, session) => {
      callback({
        user: session?.user || null,
        session,
      });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }
}

export const createAuthStateManager = (supabase: SupabaseClient): AuthStateManager => {
  return new AuthStateManager(supabase);
};
