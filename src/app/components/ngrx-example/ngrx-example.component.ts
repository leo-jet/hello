import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade, UiFacade } from '../../services';

/**
 * Example component showing NgRx usage with facade services
 */
@Component({
  selector: 'app-ngrx-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-2xl font-bold">NgRx Store Example</h2>

      <!-- Auth State -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Authentication State</h3>

        <div *ngIf="authFacade.user$ | async as user; else notLoggedIn">
          <p><strong>User:</strong> {{ user.name }} ({{ user.email }})</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          <button
            (click)="authFacade.logout()"
            class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        <ng-template #notLoggedIn>
          <p>Not logged in</p>
          <button
            (click)="simulateLogin()"
            [disabled]="authFacade.isLoading$ | async"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
            <span *ngIf="authFacade.isLoading$ | async">Logging in...</span>
            <span *ngIf="!(authFacade.isLoading$ | async)">Simulate Login</span>
          </button>
        </ng-template>

        <div *ngIf="authFacade.error$ | async as error" class="mt-2 p-2 bg-red-100 text-red-700 rounded">
          Error: {{ error }}
        </div>
      </div>

      <!-- UI State -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">UI State</h3>

        <div class="space-y-2">
          <div>
            <strong>Theme:</strong> {{ uiFacade.theme$ | async }}
            <button
              (click)="uiFacade.toggleTheme()"
              class="ml-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
              Toggle Theme
            </button>
          </div>

          <div>
            <strong>Dark Mode:</strong> {{ (uiFacade.isDarkMode$ | async) ? 'Yes' : 'No' }}
          </div>

          <div>
            <strong>Sidebar:</strong> {{ (uiFacade.sidebarOpen$ | async) ? 'Open' : 'Closed' }}
            <button
              (click)="uiFacade.toggleSidebar()"
              class="ml-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
              Toggle Sidebar
            </button>
          </div>

          <div>
            <strong>Loading:</strong> {{ (uiFacade.isLoading$ | async) ? 'Yes' : 'No' }}
            <button
              (click)="toggleLoading()"
              class="ml-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
              Toggle Loading
            </button>
          </div>
        </div>

        <div class="mt-4 space-x-2">
          <button
            (click)="uiFacade.addSuccessNotification('Success!', 'This is a success message')"
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            Success Notification
          </button>
          <button
            (click)="uiFacade.addErrorNotification('Error!', 'This is an error message')"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            Error Notification
          </button>
          <button
            (click)="uiFacade.addWarningNotification('Warning!', 'This is a warning message')"
            class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Warning Notification
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">
          Notifications
          <span class="text-sm font-normal">({{ uiFacade.unreadNotificationCount$ | async }} unread)</span>
        </h3>

        <div *ngIf="(uiFacade.notifications$ | async)?.length === 0" class="text-gray-500">
          No notifications
        </div>

        <div *ngFor="let notification of uiFacade.notifications$ | async"
             class="mb-2 p-2 rounded border-l-4"
             [ngClass]="{
               'border-green-500 bg-green-50': notification.type === 'success',
               'border-red-500 bg-red-50': notification.type === 'error',
               'border-yellow-500 bg-yellow-50': notification.type === 'warning',
               'border-blue-500 bg-blue-50': notification.type === 'info'
             }">
          <div class="flex justify-between items-start">
            <div>
              <strong>{{ notification.title }}</strong>
              <p *ngIf="notification.message" class="text-sm">{{ notification.message }}</p>
              <small class="text-gray-500">{{ notification.timestamp | date:'short' }}</small>
            </div>
            <div class="space-x-1">
              <button
                *ngIf="!notification.read"
                (click)="uiFacade.markNotificationAsRead(notification.id)"
                class="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                Mark Read
              </button>
              <button
                (click)="uiFacade.removeNotification(notification.id)"
                class="text-xs px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="(uiFacade.notifications$ | async) as notifications">
          <div *ngIf="notifications.length > 0" class="mt-4 space-x-2">
          <button
            (click)="uiFacade.clearReadNotifications()"
            class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
            Clear Read
          </button>
          <button
            (click)="uiFacade.clearAllNotifications()"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            Clear All
          </button>
        </div>
      </div>

      <!-- Breadcrumbs -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Breadcrumbs</h3>

        <div *ngIf="(uiFacade.breadcrumbs$ | async)?.length === 0" class="text-gray-500">
          No breadcrumbs set
        </div>

        <nav *ngIf="(uiFacade.breadcrumbs$ | async) as breadcrumbs">
          <div *ngIf="breadcrumbs.length > 0" class="flex space-x-2">
            <span *ngFor="let breadcrumb of uiFacade.breadcrumbs$ | async; let last = last">
              <a *ngIf="breadcrumb.url && !breadcrumb.active"
                 [href]="breadcrumb.url"
                 class="text-blue-500 hover:text-blue-600">
                {{ breadcrumb.label }}
              </a>
              <span *ngIf="!breadcrumb.url || breadcrumb.active"
                    [class.font-semibold]="breadcrumb.active">
                {{ breadcrumb.label }}
              </span>
              <span *ngIf="!last" class="text-gray-500">/</span>
            </span>
          </div>
        </nav>

        <div class="mt-4 space-x-2">
          <button
            (click)="setBreadcrumbs()"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Set Sample Breadcrumbs
          </button>
          <button
            (click)="uiFacade.clearBreadcrumbs()"
            class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
            Clear Breadcrumbs
          </button>
        </div>
      </div>
    </div>
  `
})
export class NgRxExampleComponent implements OnInit {
  protected authFacade = inject(AuthFacade);
  protected uiFacade = inject(UiFacade);

  ngOnInit() {
    // Initialize auth state
    this.authFacade.initializeAuth();
  }

  simulateLogin() {
    // Simulate login with mock credentials
    this.authFacade.login({
      email: 'demo@example.com',
      password: 'password123'
    });
  }

  toggleLoading() {
    const currentLoading = false; // You'd get this from the store
    this.uiFacade.setLoading(!currentLoading);

    // Auto-hide after 2 seconds
    setTimeout(() => {
      this.uiFacade.hideLoading();
    }, 2000);
  }

  setBreadcrumbs() {
    this.uiFacade.setBreadcrumbs([
      { label: 'Home', url: '/' },
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Current Page', active: true }
    ]);
  }
}
