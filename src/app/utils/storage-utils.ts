/**
 * Storage utility library for localStorage and sessionStorage operations
 */
export class StorageUtils {
  /**
   * Set item in localStorage with JSON serialization
   */
  static setLocal<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Get item from localStorage with JSON deserialization
   */
  static getLocal<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeLocal(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all localStorage
   */
  static clearLocal(): void {
    localStorage.clear();
  }

  /**
   * Set item in sessionStorage with JSON serialization
   */
  static setSession<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  /**
   * Get item from sessionStorage with JSON deserialization
   */
  static getSession<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove item from sessionStorage
   */
  static removeSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Clear all sessionStorage
   */
  static clearSession(): void {
    sessionStorage.clear();
  }

  /**
   * Check if localStorage is available
   */
  static isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if sessionStorage is available
   */
  static isSessionStorageAvailable(): boolean {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys from localStorage
   */
  static getLocalKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }

  /**
   * Get all keys from sessionStorage
   */
  static getSessionKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }

  /**
   * Get localStorage usage in bytes
   */
  static getLocalStorageSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * Check if key exists in localStorage
   */
  static hasLocal(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Check if key exists in sessionStorage
   */
  static hasSession(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }
}