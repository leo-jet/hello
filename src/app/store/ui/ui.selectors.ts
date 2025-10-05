import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UiState } from './ui.state';

/**
 * Feature selector for UI state
 */
export const selectUiState = createFeatureSelector<UiState>('ui');

/**
 * Theme Selectors
 */
export const selectTheme = createSelector(
  selectUiState,
  (state: UiState) => state.theme
);

export const selectIsDarkMode = createSelector(
  selectUiState,
  (state: UiState) => state.isDarkMode
);

/**
 * Loading Selectors
 */
export const selectIsLoading = createSelector(
  selectUiState,
  (state: UiState) => state.isLoading
);

/**
 * Sidebar Selectors
 */
export const selectSidebarOpen = createSelector(
  selectUiState,
  (state: UiState) => state.sidebarOpen
);

/**
 * Notification Selectors
 */
export const selectNotifications = createSelector(
  selectUiState,
  (state: UiState) => state.notifications
);

export const selectUnreadNotifications = createSelector(
  selectNotifications,
  (notifications) => notifications.filter(n => !n.read)
);

export const selectUnreadNotificationCount = createSelector(
  selectUnreadNotifications,
  (notifications) => notifications.length
);

export const selectNotificationsByType = (type: 'success' | 'error' | 'warning' | 'info') =>
  createSelector(
    selectNotifications,
    (notifications) => notifications.filter(n => n.type === type)
  );

/**
 * Breadcrumb Selectors
 */
export const selectBreadcrumbs = createSelector(
  selectUiState,
  (state: UiState) => state.breadcrumbs
);

export const selectActiveBreadcrumb = createSelector(
  selectBreadcrumbs,
  (breadcrumbs) => breadcrumbs.find(b => b.active)
);

export const selectBreadcrumbCount = createSelector(
  selectBreadcrumbs,
  (breadcrumbs) => breadcrumbs.length
);

/**
 * Combined Selectors
 */
export const selectUiConfig = createSelector(
  selectTheme,
  selectIsDarkMode,
  selectSidebarOpen,
  (theme, isDarkMode, sidebarOpen) => ({
    theme,
    isDarkMode,
    sidebarOpen
  })
);
