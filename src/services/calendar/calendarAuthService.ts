
import { getFromLocalStorage, storeInLocalStorage } from '../storage/localStorageService';
import { CALENDAR_CONFIG } from './calendarConfig';
import { CalendarAuthData } from './types';

/**
 * Service to handle Google Calendar authentication
 */
export class CalendarAuthService {
  /**
   * Check if the user is authenticated with Google Calendar
   */
  static isAuthenticated(): boolean {
    // In a real implementation, this would check the OAuth token
    // For now, we'll simulate with localStorage
    const authData = getFromLocalStorage(CALENDAR_CONFIG.STORAGE_KEYS.AUTH_KEY);
    return authData.length > 0 && !!authData[0]?.accessToken;
  }

  /**
   * Authenticate with Google Calendar
   */
  static async authenticate(): Promise<boolean> {
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll simulate successful authentication
      const mockAuthData: CalendarAuthData = {
        id: 'auth-' + Date.now(),
        accessToken: 'mock-access-token-' + Math.random().toString(36).substring(2),
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };
      
      storeInLocalStorage(CALENDAR_CONFIG.STORAGE_KEYS.AUTH_KEY, mockAuthData);
      console.log('Authenticated with Google Calendar (mock)');
      return true;
    } catch (error) {
      console.error('Error authenticating with Google Calendar:', error);
      return false;
    }
  }

  /**
   * Disconnect from Google Calendar
   */
  static disconnect(): boolean {
    try {
      // Clear auth data from localStorage
      storeInLocalStorage(CALENDAR_CONFIG.STORAGE_KEYS.AUTH_KEY, { id: 'removed', accessToken: null });
      return true;
    } catch (error) {
      console.error('Error disconnecting from Google Calendar:', error);
      return false;
    }
  }
}
