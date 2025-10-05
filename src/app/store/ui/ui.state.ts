import { Theme } from '../../services/theme.service';

/**
 * UI State interface
 */
export interface UiState {
  theme: Theme;
  isDarkMode: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  notifications: Notification[];
  breadcrumbs: Breadcrumb[];
}

/**
 * Breadcrumb interface
 */
export interface Breadcrumb {
  label: string;
  url?: string;
  active?: boolean;
}

/**
 * Notification interface for UI state
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: Date;
  read: boolean;
}

/**
 * Initial UI state
 */
export const initialUiState: UiState = {
  theme: 'auto',
  isDarkMode: false,
  isLoading: false,
  sidebarOpen: false,
  notifications: [],
  breadcrumbs: []
};