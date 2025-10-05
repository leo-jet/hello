import { Environment } from './environment.interface';

/**
 * Test environment configuration
 * Used during automated testing (unit tests, e2e tests)
 */
export const environment: Environment = {
  production: false,
  name: 'test',
  apiUrl: 'http://localhost:3001/api',
  apiVersion: 'v1',

  features: {
    enableLogging: false,
    enableAnalytics: false,
    enableNotifications: false,
    enableExperimentalFeatures: true,
  },

  auth: {
    tokenKey: 'test_auth_token',
    refreshTokenKey: 'test_refresh_token',
    sessionTimeout: 60, // 1 hour
  },

  ui: {
    theme: 'light',
    language: 'en',
    pageSize: 5, // Smaller for faster tests
  },

  external: {
    // Test keys (mock values)
    googleAnalyticsId: undefined,
    sentryDsn: undefined,
    stripePublicKey: 'pk_test_mock_key',
  },

  cache: {
    ttl: 10000, // 10 seconds
    maxSize: 10, // 10 MB
  },
};
