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
}
