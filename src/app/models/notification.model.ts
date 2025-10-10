/**
 * Notification Type
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  timestamp: Date;
}
