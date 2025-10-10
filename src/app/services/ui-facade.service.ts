import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../store/app.state';
import * as UiActions from '../store/ui/ui.actions';
import * as UiSelectors from '../store/ui/ui.selectors';
import { Theme } from '@app/models';
import { Breadcrumb } from '../store/ui/ui.state';

/**
 * UI Facade Service
 * Provides a simplified interface for UI-related state management
 */
@Injectable({
  providedIn: 'root'
})
export class UiFacade {
  private store = inject(Store<AppState>);

  // Selectors
  readonly theme$ = this.store.select(UiSelectors.selectTheme);
  readonly isDarkMode$ = this.store.select(UiSelectors.selectIsDarkMode);
  readonly isLoading$ = this.store.select(UiSelectors.selectIsLoading);
  readonly sidebarOpen$ = this.store.select(UiSelectors.selectSidebarOpen);
  readonly notifications$ = this.store.select(UiSelectors.selectNotifications);
  readonly unreadNotifications$ = this.store.select(UiSelectors.selectUnreadNotifications);
  readonly unreadNotificationCount$ = this.store.select(UiSelectors.selectUnreadNotificationCount);
  readonly breadcrumbs$ = this.store.select(UiSelectors.selectBreadcrumbs);
  readonly uiConfig$ = this.store.select(UiSelectors.selectUiConfig);

  /**
   * Theme Actions
   */
  setTheme(theme: Theme): void {
    this.store.dispatch(UiActions.setTheme({ theme }));
  }

  toggleTheme(): void {
    this.store.dispatch(UiActions.toggleTheme());
  }

  setDarkMode(isDarkMode: boolean): void {
    this.store.dispatch(UiActions.setDarkMode({ isDarkMode }));
  }

  /**
   * Loading Actions
   */
  setLoading(isLoading: boolean): void {
    this.store.dispatch(UiActions.setLoading({ isLoading }));
  }

  showLoading(): void {
    this.store.dispatch(UiActions.showLoading());
  }

  hideLoading(): void {
    this.store.dispatch(UiActions.hideLoading());
  }

  /**
   * Sidebar Actions
   */
  toggleSidebar(): void {
    this.store.dispatch(UiActions.toggleSidebar());
  }

  openSidebar(): void {
    this.store.dispatch(UiActions.openSidebar());
  }

  closeSidebar(): void {
    this.store.dispatch(UiActions.closeSidebar());
  }

  setSidebarState(isOpen: boolean): void {
    this.store.dispatch(UiActions.setSidebarState({ isOpen }));
  }

  /**
   * Notification Actions
   */
  addNotification(type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string): void {
    this.store.dispatch(UiActions.addNotification({
      notification: { type, title, message }
    }));
  }

  addSuccessNotification(title: string, message?: string): void {
    this.addNotification('success', title, message);
  }

  addErrorNotification(title: string, message?: string): void {
    this.addNotification('error', title, message);
  }

  addWarningNotification(title: string, message?: string): void {
    this.addNotification('warning', title, message);
  }

  addInfoNotification(title: string, message?: string): void {
    this.addNotification('info', title, message);
  }

  removeNotification(id: string): void {
    this.store.dispatch(UiActions.removeNotification({ id }));
  }

  markNotificationAsRead(id: string): void {
    this.store.dispatch(UiActions.markNotificationAsRead({ id }));
  }

  clearAllNotifications(): void {
    this.store.dispatch(UiActions.clearAllNotifications());
  }

  clearReadNotifications(): void {
    this.store.dispatch(UiActions.clearReadNotifications());
  }

  /**
   * Breadcrumb Actions
   */
  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.store.dispatch(UiActions.setBreadcrumbs({ breadcrumbs }));
  }

  addBreadcrumb(breadcrumb: Breadcrumb): void {
    this.store.dispatch(UiActions.addBreadcrumb({ breadcrumb }));
  }

  removeBreadcrumb(index: number): void {
    this.store.dispatch(UiActions.removeBreadcrumb({ index }));
  }

  clearBreadcrumbs(): void {
    this.store.dispatch(UiActions.clearBreadcrumbs());
  }
}
