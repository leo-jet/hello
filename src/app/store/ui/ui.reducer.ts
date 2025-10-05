import { createReducer, on } from '@ngrx/store';
import { UiState, initialUiState } from './ui.state';
import * as UiActions from './ui.actions';

/**
 * UI Reducer
 * Handles all UI-related state changes
 */
export const uiReducer = createReducer(
  initialUiState,

  // Theme Actions
  on(UiActions.setTheme, (state, { theme }) => ({
    ...state,
    theme
  })),

  on(UiActions.toggleTheme, (state) => ({
    ...state,
    theme: state.theme === 'light' ? 'dark' as const : 'light' as const
  })),

  on(UiActions.setDarkMode, (state, { isDarkMode }) => ({
    ...state,
    isDarkMode
  })),

  // Loading Actions
  on(UiActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  })),

  on(UiActions.showLoading, (state) => ({
    ...state,
    isLoading: true
  })),

  on(UiActions.hideLoading, (state) => ({
    ...state,
    isLoading: false
  })),

  // Sidebar Actions
  on(UiActions.toggleSidebar, (state) => ({
    ...state,
    sidebarOpen: !state.sidebarOpen
  })),

  on(UiActions.openSidebar, (state) => ({
    ...state,
    sidebarOpen: true
  })),

  on(UiActions.closeSidebar, (state) => ({
    ...state,
    sidebarOpen: false
  })),

  on(UiActions.setSidebarState, (state, { isOpen }) => ({
    ...state,
    sidebarOpen: isOpen
  })),

  // Notification Actions
  on(UiActions.addNotification, (state, { notification }) => ({
    ...state,
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: generateId(),
        timestamp: new Date(),
        read: false
      }
    ]
  })),

  on(UiActions.removeNotification, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  on(UiActions.markNotificationAsRead, (state, { id }) => ({
    ...state,
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  })),

  on(UiActions.clearAllNotifications, (state) => ({
    ...state,
    notifications: []
  })),

  on(UiActions.clearReadNotifications, (state) => ({
    ...state,
    notifications: state.notifications.filter(n => !n.read)
  })),

  // Breadcrumb Actions
  on(UiActions.setBreadcrumbs, (state, { breadcrumbs }) => ({
    ...state,
    breadcrumbs
  })),

  on(UiActions.addBreadcrumb, (state, { breadcrumb }) => ({
    ...state,
    breadcrumbs: [...state.breadcrumbs, breadcrumb]
  })),

  on(UiActions.removeBreadcrumb, (state, { index }) => ({
    ...state,
    breadcrumbs: state.breadcrumbs.filter((_, i) => i !== index)
  })),

  on(UiActions.clearBreadcrumbs, (state) => ({
    ...state,
    breadcrumbs: []
  }))
);

/**
 * Helper function to generate unique IDs
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export type { UiState } from './ui.state';