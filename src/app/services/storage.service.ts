import { Injectable } from '@angular/core';
import { StorageUtils } from '../utils';

/**
 * Storage keys enum
 */
export enum StorageKeys {
  USER_PREFERENCES = 'user_preferences',
  APP_SETTINGS = 'app_settings',
  CART_ITEMS = 'cart_items',
  RECENT_SEARCHES = 'recent_searches',
  FORM_DRAFTS = 'form_drafts'
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    shareData: boolean;
  };
}

/**
 * Storage Service
 * Provides a centralized way to manage application data storage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  /**
   * Save user preferences
   */
  saveUserPreferences(preferences: UserPreferences): void {
    StorageUtils.setLocal(StorageKeys.USER_PREFERENCES, preferences);
  }

  /**
   * Get user preferences
   */
  getUserPreferences(): UserPreferences | null {
    return StorageUtils.getLocal<UserPreferences>(StorageKeys.USER_PREFERENCES);
  }

  /**
   * Save app settings
   */
  saveAppSettings(settings: Record<string, any>): void {
    StorageUtils.setLocal(StorageKeys.APP_SETTINGS, settings);
  }

  /**
   * Get app settings
   */
  getAppSettings(): Record<string, any> | null {
    return StorageUtils.getLocal<Record<string, any>>(StorageKeys.APP_SETTINGS);
  }

  /**
   * Save cart items (session storage for temporary data)
   */
  saveCartItems(items: any[]): void {
    StorageUtils.setSession(StorageKeys.CART_ITEMS, items);
  }

  /**
   * Get cart items
   */
  getCartItems(): any[] | null {
    return StorageUtils.getSession<any[]>(StorageKeys.CART_ITEMS);
  }

  /**
   * Save recent searches
   */
  saveRecentSearches(searches: string[]): void {
    // Keep only last 10 searches
    const recentSearches = searches.slice(-10);
    StorageUtils.setLocal(StorageKeys.RECENT_SEARCHES, recentSearches);
  }

  /**
   * Get recent searches
   */
  getRecentSearches(): string[] {
    return StorageUtils.getLocal<string[]>(StorageKeys.RECENT_SEARCHES) || [];
  }

  /**
   * Add search to recent searches
   */
  addRecentSearch(search: string): void {
    const searches = this.getRecentSearches();
    // Remove if already exists
    const filtered = searches.filter(s => s !== search);
    // Add to beginning
    filtered.unshift(search);
    this.saveRecentSearches(filtered);
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    StorageUtils.removeLocal(StorageKeys.RECENT_SEARCHES);
  }

  /**
   * Save form draft
   */
  saveFormDraft(formId: string, data: any): void {
    const drafts = this.getFormDrafts();
    drafts[formId] = {
      data,
      timestamp: new Date().toISOString()
    };
    StorageUtils.setLocal(StorageKeys.FORM_DRAFTS, drafts);
  }

  /**
   * Get form draft
   */
  getFormDraft(formId: string): any | null {
    const drafts = this.getFormDrafts();
    return drafts[formId]?.data || null;
  }

  /**
   * Remove form draft
   */
  removeFormDraft(formId: string): void {
    const drafts = this.getFormDrafts();
    delete drafts[formId];
    StorageUtils.setLocal(StorageKeys.FORM_DRAFTS, drafts);
  }

  /**
   * Get all form drafts
   */
  getFormDrafts(): Record<string, any> {
    return StorageUtils.getLocal<Record<string, any>>(StorageKeys.FORM_DRAFTS) || {};
  }

  /**
   * Clear old form drafts (older than 30 days)
   */
  clearOldFormDrafts(): void {
    const drafts = this.getFormDrafts();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    Object.keys(drafts).forEach(key => {
      const draft = drafts[key];
      if (draft.timestamp && new Date(draft.timestamp) < thirtyDaysAgo) {
        delete drafts[key];
      }
    });

    StorageUtils.setLocal(StorageKeys.FORM_DRAFTS, drafts);
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    localStorage: {
      used: number;
      available: boolean;
    };
    sessionStorage: {
      available: boolean;
    };
  } {
    return {
      localStorage: {
        used: StorageUtils.getLocalStorageSize(),
        available: StorageUtils.isLocalStorageAvailable()
      },
      sessionStorage: {
        available: StorageUtils.isSessionStorageAvailable()
      }
    };
  }

  /**
   * Clear all application data
   */
  clearAllData(): void {
    Object.values(StorageKeys).forEach(key => {
      StorageUtils.removeLocal(key);
      StorageUtils.removeSession(key);
    });
  }

  /**
   * Export user data
   */
  exportUserData(): string {
    const data = {
      preferences: this.getUserPreferences(),
      settings: this.getAppSettings(),
      recentSearches: this.getRecentSearches(),
      formDrafts: this.getFormDrafts(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import user data
   */
  importUserData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.preferences) {
        this.saveUserPreferences(data.preferences);
      }
      
      if (data.settings) {
        this.saveAppSettings(data.settings);
      }
      
      if (data.recentSearches) {
        this.saveRecentSearches(data.recentSearches);
      }
      
      if (data.formDrafts) {
        StorageUtils.setLocal(StorageKeys.FORM_DRAFTS, data.formDrafts);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }
}