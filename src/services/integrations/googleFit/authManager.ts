
import { toast } from 'sonner';
import { GOOGLE_FIT_CLIENT_ID } from './types';

class GoogleFitAuthManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;
  private userId: string | null = null;

  constructor() {
    // Try to load stored tokens from localStorage
    this.loadStoredCredentials();
  }

  public loadStoredCredentials() {
    try {
      const storedAuth = localStorage.getItem('googleFit_auth');
      if (storedAuth) {
        const auth = JSON.parse(storedAuth);
        this.accessToken = auth.accessToken;
        this.refreshToken = auth.refreshToken;
        this.tokenExpiry = auth.expiresAt;
        this.userId = auth.userId;

        // Check if token is expired and needs refresh
        if (this.tokenExpiry < Date.now()) {
          console.log('Token expired, will refresh on next API call');
        }
      }
    } catch (error) {
      console.error('Error loading Google Fit credentials:', error);
      this.clearStoredCredentials();
    }
  }

  public storeCredentials(accessToken: string, refreshToken: string, expiresIn: number, userId: string) {
    const expiresAt = Date.now() + (expiresIn * 1000);
    
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = expiresAt;
    this.userId = userId;
    
    localStorage.setItem('googleFit_auth', JSON.stringify({
      accessToken,
      refreshToken,
      expiresAt,
      userId
    }));
  }

  public clearStoredCredentials() {
    localStorage.removeItem('googleFit_auth');
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = 0;
    this.userId = null;
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken && this.tokenExpiry > Date.now();
  }

  public initiateAuth(): void {
    // In a real implementation, this would redirect to Google's OAuth flow
    // For demo purposes, we'll simulate the auth flow with a mock
    this.mockAuthFlow();
  }

  public async refreshAuthToken(): Promise<boolean> {
    // In a real implementation, this would call Google's token endpoint
    // For demo purposes, we'll simulate the refresh with a mock
    try {
      if (!this.refreshToken) {
        return false;
      }
      
      // Simulate a token refresh
      const mockAccessToken = `mock_refreshed_token_${Date.now()}`;
      const expiresIn = 3600; // 1 hour
      
      this.accessToken = mockAccessToken;
      this.tokenExpiry = Date.now() + (expiresIn * 1000);
      
      // Update stored auth
      localStorage.setItem('googleFit_auth', JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresAt: this.tokenExpiry,
        userId: this.userId
      }));
      
      return true;
    } catch (error) {
      console.error('Error refreshing Google Fit token:', error);
      return false;
    }
  }

  public async ensureValidToken(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }
    
    if (this.tokenExpiry <= Date.now()) {
      return await this.refreshAuthToken();
    }
    
    return true;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  private mockAuthFlow() {
    // In a real app, we would redirect to Google's OAuth endpoint
    // For demo purposes, we'll simulate a successful auth after a delay
    toast.info("Connecting to Google Fit...", {
      duration: 2000
    });
    
    setTimeout(() => {
      // Simulate successful authentication with mock tokens
      const mockAccessToken = `mock_access_token_${Date.now()}`;
      const mockRefreshToken = `mock_refresh_token_${Date.now()}`;
      const expiresIn = 3600; // 1 hour
      const userId = `user_${Date.now()}`;
      
      this.storeCredentials(mockAccessToken, mockRefreshToken, expiresIn, userId);
      
      toast.success("Connected to Google Fit", {
        description: "Your health data is now being synced"
      });
    }, 2000);
  }

  public async disconnect(): Promise<boolean> {
    try {
      // In a real implementation, we would revoke the token with Google
      // For demo purposes, we'll just clear the stored credentials
      this.clearStoredCredentials();
      return true;
    } catch (error) {
      console.error('Error disconnecting from Google Fit:', error);
      return false;
    }
  }
}

export default GoogleFitAuthManager;
