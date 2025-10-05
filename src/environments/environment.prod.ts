import { Environment } from './environment.interface';

/**
 * Production environment configuration
 * Used in live/production deployments
 */
export const environment: Environment = {
  production: true,
  name: 'production',
  apiUrl: 'https://api.yourdomain.com/api',
  apiVersion: 'v1',

  features: {
    enableLogging: false,
    enableAnalytics: true,
    enableNotifications: true,
    enableExperimentalFeatures: false,
  },

  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    sessionTimeout: 120, // 2 hours
  },

  ui: {
    theme: 'light',
    language: 'en',
    pageSize: 20,
  },

  external: {
    // Production keys (should be set via environment variables)
    googleAnalyticsId: 'GA_TRACKING_ID',
    sentryDsn: 'SENTRY_DSN_URL',
    stripePublicKey: 'pk_live_production_key',
  },

  cache: {
    ttl: 3600000, // 1 hour
    maxSize: 100, // 100 MB
  },
};
