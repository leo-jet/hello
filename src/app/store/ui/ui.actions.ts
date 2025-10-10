import { createAction, props } from '@ngrx/store';
import { Theme } from '@app/models';
import { Breadcrumb, Notification } from './ui.state';

/**
 * Theme Actions
 */
export const setTheme = createAction(
  '[UI] Set Theme',
  props<{ theme: Theme }>()
);

export const toggleTheme = createAction('[UI] Toggle Theme');

export const setDarkMode = createAction(
  '[UI] Set Dark Mode',
  props<{ isDarkMode: boolean }>()
);

/**
 * Loading Actions
 */
export const setLoading = createAction(
  '[UI] Set Loading',
  props<{ isLoading: boolean }>()
);

export const showLoading = createAction('[UI] Show Loading');

export const hideLoading = createAction('[UI] Hide Loading');

/**
 * Sidebar Actions
 */
export const toggleSidebar = createAction('[UI] Toggle Sidebar');

export const openSidebar = createAction('[UI] Open Sidebar');

export const closeSidebar = createAction('[UI] Close Sidebar');

export const setSidebarState = createAction(
  '[UI] Set Sidebar State',
  props<{ isOpen: boolean }>()
);

/**
 * Notification Actions
 */
export const addNotification = createAction(
  '[UI] Add Notification',
  props<{ notification: Omit<Notification, 'id' | 'timestamp' | 'read'> }>()
);

export const removeNotification = createAction(
  '[UI] Remove Notification',
  props<{ id: string }>()
);

export const markNotificationAsRead = createAction(
  '[UI] Mark Notification As Read',
  props<{ id: string }>()
);

export const clearAllNotifications = createAction('[UI] Clear All Notifications');

export const clearReadNotifications = createAction('[UI] Clear Read Notifications');

/**
 * Breadcrumb Actions
 */
export const setBreadcrumbs = createAction(
  '[UI] Set Breadcrumbs',
  props<{ breadcrumbs: Breadcrumb[] }>()
);

export const addBreadcrumb = createAction(
  '[UI] Add Breadcrumb',
  props<{ breadcrumb: Breadcrumb }>()
);

export const removeBreadcrumb = createAction(
  '[UI] Remove Breadcrumb',
  props<{ index: number }>()
);

export const clearBreadcrumbs = createAction('[UI] Clear Breadcrumbs');
