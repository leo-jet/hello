import { Environment } from './environment.interface';

/**
 * Staging environment configuration
 * Used for pre-production testing and validation
 */
export const environment: Environment = {
  production: false,
  name: 'staging',
  apiUrl: 'https://staging-api.yourdomain.com/api',
  apiVersion: 'v1',

  features: {
    enableLogging: true,
    enableAnalytics: true,
    enableNotifications: true,
    enableExperimentalFeatures: true,
  },

  auth: {
    tokenKey: 'staging_auth_token',
    refreshTokenKey: 'staging_refresh_token',
    sessionTimeout: 240, // 4 hours
  },

  ui: {
    theme: 'light',
    language: 'en',
    pageSize: 15,
  },

  external: {
    // Staging keys
    googleAnalyticsId: 'GA_STAGING_ID',
    sentryDsn: 'STAGING_SENTRY_DSN',
    stripePublicKey: 'pk_test_staging_key',
  },

  cache: {
    ttl: 900000, // 15 minutes
    maxSize: 75, // 75 MB
  },
};
