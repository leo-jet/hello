import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

/**
 * Feature selector for auth state
 */
export const selectAuthState = createFeatureSelector<AuthState>('auth');

/**
 * Auth Selectors
 */
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

/**
 * Computed selectors
 */
export const selectUserName = createSelector(
  selectCurrentUser,
  (user) => user?.name || ''
);

export const selectUserEmail = createSelector(
  selectCurrentUser,
  (user) => user?.email || ''
);

export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role || ''
);

export const selectUserAvatar = createSelector(
  selectCurrentUser,
  (user) => user?.avatar || ''
);

/**
 * Check if user has specific role
 */
export const selectHasRole = (role: string) => createSelector(
  selectUserRole,
  (userRole) => userRole === role
);

/**
 * Check if user has any of the specified roles
 */
export const selectHasAnyRole = (roles: string[]) => createSelector(
  selectUserRole,
  (userRole) => roles.includes(userRole)
);

/**
 * Check if auth operation is in progress
 */
export const selectAuthInProgress = createSelector(
  selectAuthLoading,
  (isLoading) => isLoading
);

/**
 * Check if there's an auth error
 */
export const selectHasAuthError = createSelector(
  selectAuthError,
  (error) => !!error
);