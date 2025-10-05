// Export all services for easy import
export { BaseApiService } from './base-api.service';
export { AuthService } from './auth.service';
export { LoadingService } from './loading.service';
export { NotificationService } from './notification.service';
export { ThemeService } from './theme.service';
export { StorageService } from './storage.service';

// Export facade services
export { AuthFacade } from './auth-facade.service';
export { UiFacade } from './ui-facade.service';

// Export interfaces and types
export type { ApiRequestConfig, ApiResponse, PaginatedResponse } from './base-api.service';
export type { User, LoginCredentials, RegisterData, AuthResponse } from './auth.service';
export type { NotificationType, Notification } from './notification.service';
export type { Theme } from './theme.service';
export type { UserPreferences } from './storage.service';
export { StorageKeys } from './storage.service';
