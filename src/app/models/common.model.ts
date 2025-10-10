/**
 * Theme Type
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * User Preferences
 */
export interface UserPreferences {
  theme: Theme;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    shareData: boolean;
    showOnlineStatus: boolean;
    allowAnalytics: boolean;
  };
}

/**
 * Storage Keys
 */
export enum StorageKeys {
  USER_PREFERENCES = 'user_preferences',
  AUTH_TOKEN = 'auth_token',
  REFRESH_TOKEN = 'refresh_token',
  THEME = 'theme',
  LANGUAGE = 'language',
  RECENT_SEARCHES = 'recent_searches',
  FORM_DRAFT = 'form_draft',
  FORM_DRAFTS = 'form_drafts',
  APP_SETTINGS = 'app_settings',
  CART_ITEMS = 'cart_items',
}
