import { Environment } from './environment.interface';

/**
 * Development environment configuration
 * Used during local development and testing
 */
export const environment: Environment = {
  production: false,
  name: 'development',
  apiUrl: 'http://localhost:3000/api',
  apiVersion: 'v1',
  
  features: {
    enableLogging: true,
    enableAnalytics: false,
    enableNotifications: true,
    enableExperimentalFeatures: true,
  },
  
  auth: {
    tokenKey: 'dev_auth_token',
    refreshTokenKey: 'dev_refresh_token',
    sessionTimeout: 480, // 8 hours
  },
  
  ui: {
    theme: 'light',
    language: 'en',
    pageSize: 10,
  },
  
  external: {
    // Development keys (safe to commit)
    googleAnalyticsId: undefined,
    sentryDsn: undefined,
    stripePublicKey: 'pk_test_development_key',
  },
  
  cache: {
    ttl: 300000, // 5 minutes
    maxSize: 50, // 50 MB
  },
};