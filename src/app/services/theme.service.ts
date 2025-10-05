import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Theme types
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Theme Service
 * Manages application theme and dark mode
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeSubject = new BehaviorSubject<Theme>('auto');
  private readonly isDarkModeSubject = new BehaviorSubject<boolean>(false);

  public readonly theme$ = this.themeSubject.asObservable();
  public readonly isDarkMode$ = this.isDarkModeSubject.asObservable();

  private readonly storageKey = 'app-theme';

  constructor() {
    this.initializeTheme();
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  /**
   * Toggle between light and dark theme
   */
  toggle(): void {
    const currentTheme = this.getCurrentTheme();
    if (currentTheme === 'auto') {
      // If auto, switch to opposite of current system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'light' : 'dark');
    } else {
      this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
  }

  /**
   * Initialize theme on service creation
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey) as Theme;
    const theme = savedTheme || 'auto';

    this.themeSubject.next(theme);
    this.applyTheme(theme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.getCurrentTheme() === 'auto') {
          this.applyTheme('auto');
        }
      });
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    let isDark = false;

    if (theme === 'auto') {
      // Use system preference
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = theme === 'dark';
    }

    // Apply theme class
    const themeClass = isDark ? 'dark' : 'light';
    root.classList.add(themeClass);
    body.classList.add(themeClass);

    // Update dark mode state
    this.isDarkModeSubject.next(isDark);

    // Update color-scheme for better browser integration
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): { value: Theme; label: string }[] {
    return [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'auto', label: 'Auto' }
    ];
  }

  /**
   * Check if system supports dark mode
   */
  supportsColorScheme(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all';
  }
}
