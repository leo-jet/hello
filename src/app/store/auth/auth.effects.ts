import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import * as AuthActions from './auth.actions';

/**
 * Authentication Effects
 * Handles side effects for authentication actions
 */
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  /**
   * Login Effect
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(response => {
            // Store auth data in service
            this.authService.setAuthData(response.data);
            return AuthActions.loginSuccess({ authResponse: response.data });
          }),
          catchError(error => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  /**
   * Register Effect
   */
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(action =>
        this.authService.register(action.userData).pipe(
          map(response => {
            // Store auth data in service
            this.authService.setAuthData(response.data);
            return AuthActions.registerSuccess({ authResponse: response.data });
          }),
          catchError(error => of(AuthActions.registerFailure({ error: error.message })))
        )
      )
    )
  );

  /**
   * Logout Effect
   */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => {
            // Clear auth data in service
            this.authService.clearAuthData();
            return AuthActions.logoutSuccess();
          }),
          catchError(error => {
            // Clear auth data even on error
            this.authService.clearAuthData();
            return of(AuthActions.logoutFailure({ error: error.message }));
          })
        )
      )
    )
  );

  /**
   * Load Current User Effect
   */
  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      exhaustMap(() =>
        this.authService.getCurrentUser().pipe(
          map(response => AuthActions.loadCurrentUserSuccess({ user: response.data })),
          catchError(error => of(AuthActions.loadCurrentUserFailure({ error: error.message })))
        )
      )
    )
  );

  /**
   * Update Profile Effect
   */
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      exhaustMap(action =>
        this.authService.updateProfile(action.userData).pipe(
          map(response => AuthActions.updateProfileSuccess({ user: response.data })),
          catchError(error => of(AuthActions.updateProfileFailure({ error: error.message })))
        )
      )
    )
  );

  /**
   * Change Password Effect
   */
  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      exhaustMap(action =>
        this.authService.changePassword(action.oldPassword, action.newPassword).pipe(
          map(() => AuthActions.changePasswordSuccess()),
          catchError(error => of(AuthActions.changePasswordFailure({ error: error.message })))
        )
      )
    )
  );

  /**
   * Initialize Auth Effect
   */
  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      exhaustMap(() => {
        const token = this.authService.getAuthToken();
        if (token) {
          // Token exists, load current user
          return this.authService.getCurrentUser().pipe(
            map(response => AuthActions.loadCurrentUserSuccess({ user: response.data })),
            catchError(error => {
              // Token invalid, clear auth data
              this.authService.clearAuthData();
              return of(AuthActions.loadCurrentUserFailure({ error: error.message }));
            })
          );
        } else {
          // No token, user not authenticated
          return of(AuthActions.loadCurrentUserFailure({ error: 'No token found' }));
        }
      })
    )
  );

  /**
   * Navigation Effects (no API calls, just side effects)
   */
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.notificationService.success('Login Successful', 'Welcome back!');
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.notificationService.success('Registration Successful', 'Welcome to our platform!');
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.notificationService.info('Logged Out', 'You have been successfully logged out.');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  updateProfileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.updateProfileSuccess),
        tap(() => {
          this.notificationService.success('Profile Updated', 'Your profile has been updated successfully.');
        })
      ),
    { dispatch: false }
  );

  changePasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.changePasswordSuccess),
        tap(() => {
          this.notificationService.success('Password Changed', 'Your password has been changed successfully.');
        })
      ),
    { dispatch: false }
  );

  /**
   * Error Effects
   */
  authFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.loginFailure,
          AuthActions.registerFailure,
          AuthActions.logoutFailure,
          AuthActions.loadCurrentUserFailure,
          AuthActions.updateProfileFailure,
          AuthActions.changePasswordFailure
        ),
        tap(action => {
          this.notificationService.error('Error', action.error);
        })
      ),
    { dispatch: false }
  );
}
