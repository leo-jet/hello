/**
 * Base environment interface
 * Defines the structure that all environment configs must follow
 */
export interface Environment {
  production: boolean;
  name: string;
  apiUrl: string;
  apiVersion: string;
  features: {
    enableLogging: boolean;
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableExperimentalFeatures: boolean;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    sessionTimeout: number; // in minutes
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    pageSize: number;
  };
  external: {
    googleAnalyticsId?: string;
    sentryDsn?: string;
    stripePublicKey?: string;
  };
  cache: {
    ttl: number; // in milliseconds
    maxSize: number; // in MB
  };
  
  /**
   * MSAL (Microsoft Authentication Library) Configuration
   * Optional - Only needed if using Azure AD authentication with BaseMsalApiService
   */
  msalConfig?: {
    auth: {
      clientId: string;                      // Azure AD Application (client) ID
      authority: string;                     // https://login.microsoftonline.com/{tenant-id}
      redirectUri: string;                   // Application redirect URI
      postLogoutRedirectUri?: string;        // Post-logout redirect URI
      navigateToLoginRequestUrl?: boolean;   // Navigate to original request after login
    };
    cache: {
      cacheLocation: 'localStorage' | 'sessionStorage';  // Token cache location
      storeAuthStateInCookie: boolean;                   // Store state in cookie (for IE11)
    };
    system?: {
      loggerOptions?: {
        loggerCallback?: (level: number, message: string, containsPii: boolean) => void;
        logLevel?: number;
        piiLoggingEnabled?: boolean;
      };
    };
  };
  
  /**
   * Default MSAL scopes for API access
   * Optional - Used by BaseMsalApiService
   */
  msalScopes?: string[];
  
  /**
   * Microsoft Graph API base URL
   * Optional - Useful when using Microsoft Graph API
   */
  graphApiUrl?: string;
}
