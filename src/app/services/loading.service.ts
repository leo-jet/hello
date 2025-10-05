import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Loading Service
 * Manages global loading state for the application
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCounter = 0;

  public readonly loading$ = this.loadingSubject.asObservable();

  /**
   * Show loading indicator
   */
  show(): void {
    this.loadingCounter++;
    if (this.loadingCounter > 0) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Hide loading indicator
   */
  hide(): void {
    this.loadingCounter--;
    if (this.loadingCounter <= 0) {
      this.loadingCounter = 0;
      this.loadingSubject.next(false);
    }
  }

  /**
   * Force hide loading indicator
   */
  forceHide(): void {
    this.loadingCounter = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Get current loading state
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Execute function with loading state
   */
  async withLoading<T>(fn: () => Promise<T>): Promise<T> {
    this.show();
    try {
      return await fn();
    } finally {
      this.hide();
    }
  }
}
