import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';
import { LoginCredentials, RegisterData, User } from '@app/models';


/**
 * Auth Facade Service
 * Provides a simplified interface for auth-related state management
 */
@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private store = inject(Store<AppState>);

  // Selectors
  readonly user$ = this.store.select(AuthSelectors.selectCurrentUser);
  readonly isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  readonly isLoading$ = this.store.select(AuthSelectors.selectAuthLoading);
  readonly error$ = this.store.select(AuthSelectors.selectAuthError);
  readonly userName$ = this.store.select(AuthSelectors.selectUserName);
  readonly userEmail$ = this.store.select(AuthSelectors.selectUserEmail);
  readonly userRole$ = this.store.select(AuthSelectors.selectUserRole);

  /**
   * Actions
   */
  login(credentials: LoginCredentials): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  register(userData: RegisterData): void {
    this.store.dispatch(AuthActions.register({ userData }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  loadCurrentUser(): void {
    this.store.dispatch(AuthActions.loadCurrentUser());
  }

  updateProfile(userData: Partial<User>): void {
    this.store.dispatch(AuthActions.updateProfile({ userData }));
  }

  changePassword(oldPassword: string, newPassword: string): void {
    this.store.dispatch(AuthActions.changePassword({ oldPassword, newPassword }));
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearAuthError());
  }

  initializeAuth(): void {
    this.store.dispatch(AuthActions.initializeAuth());
  }

  /**
   * Helper methods
   */
  hasRole(role: string): Observable<boolean> {
    return this.store.select(AuthSelectors.selectHasRole(role));
  }

  hasAnyRole(roles: string[]): Observable<boolean> {
    return this.store.select(AuthSelectors.selectHasAnyRole(roles));
  }
}