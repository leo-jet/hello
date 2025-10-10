import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification, NotificationType } from '@app/models';

/**
 * Notification Service
 * Manages application notifications and alerts
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private readonly defaultDuration = 5000; // 5 seconds
  
  public readonly notifications$ = this.notificationsSubject.asObservable();

  /**
   * Show success notification
   */
  success(title: string, message?: string, duration?: number): void {
    this.addNotification('success', title, message, duration);
  }

  /**
   * Show error notification
   */
  error(title: string, message?: string, duration?: number): void {
    this.addNotification('error', title, message, duration);
  }

  /**
   * Show warning notification
   */
  warning(title: string, message?: string, duration?: number): void {
    this.addNotification('warning', title, message, duration);
  }

  /**
   * Show info notification
   */
  info(title: string, message?: string, duration?: number): void {
    this.addNotification('info', title, message, duration);
  }

  /**
   * Show persistent notification (doesn't auto-dismiss)
   */
  persistent(type: NotificationType, title: string, message?: string): void {
    this.addNotification(type, title, message, undefined, true);
  }

  /**
   * Remove specific notification
   */
  remove(id: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Clear notifications by type
   */
  clearByType(type: NotificationType): void {
    const notifications = this.notificationsSubject.value.filter(n => n.type !== type);
    this.notificationsSubject.next(notifications);
  }

  /**
   * Get current notifications
   */
  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Add notification
   */
  private addNotification(
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number,
    persistent = false
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration: duration || this.defaultDuration,
      persistent,
      timestamp: new Date()
    };

    const notifications = [...this.notificationsSubject.value, notification];
    this.notificationsSubject.next(notifications);

    // Auto-remove notification after duration (unless persistent)
    if (!persistent) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}