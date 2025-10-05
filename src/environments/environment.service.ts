import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Environment } from './environment.interface';

/**
 * Environment service
 * Provides easy access to environment configuration throughout the application
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly config: Environment = environment;

  /**
   * Get the current environment configuration
   */
  get environment(): Environment {
    return this.config;
  }

  /**
   * Check if running in production mode
   */
  get isProduction(): boolean {
    return this.config.production;
  }

  /**
   * Check if running in development mode
   */
  get isDevelopment(): boolean {
    return !this.config.production;
  }

  /**
   * Get the environment name
   */
  get environmentName(): string {
    return this.config.name;
  }

  /**
   * Get the API base URL
   */
  get apiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get the full API URL with version
   */
  get fullApiUrl(): string {
    return `${this.config.apiUrl}/${this.config.apiVersion}`;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof Environment['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Get authentication configuration
   */
  get authConfig(): Environment['auth'] {
    return this.config.auth;
  }

  /**
   * Get UI configuration
   */
  get uiConfig(): Environment['ui'] {
    return this.config.ui;
  }

  /**
   * Get external service configuration
   */
  get externalConfig(): Environment['external'] {
    return this.config.external;
  }

  /**
   * Get cache configuration
   */
  get cacheConfig(): Environment['cache'] {
    return this.config.cache;
  }

  /**
   * Get a specific configuration value by path
   * Example: getConfig('features.enableLogging')
   */
  getConfig<T = any>(path: string): T | undefined {
    return path.split('.').reduce((obj: any, key: string) => {
      return obj?.[key];
    }, this.config) as T;
  }
}