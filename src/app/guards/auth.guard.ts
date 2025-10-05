import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Authentication Guard
 * Protects routes that require user authentication
 * Redirects to login page if user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // TODO: Replace with your actual authentication service
  // const authService = inject(AuthService);

  // Mock authentication check - replace with real implementation
  const isAuthenticated = checkAuthentication();

  if (isAuthenticated) {
    return true;
  } else {
    // Redirect to login page with return URL
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};

/**
 * Mock authentication check
 * Replace this with your actual authentication logic
 */
function checkAuthentication(): boolean {
  // Example: Check if token exists in localStorage
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return false;
  }

  // Example: Check if token is not expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
}

/**
 * Async Authentication Guard
 * Use this version if you need to make HTTP calls to verify authentication
 */
export const asyncAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // TODO: Replace with your actual authentication service
  // const authService = inject(AuthService);

  // Mock async authentication check
  return checkAuthenticationAsync().pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    })
  );
};

/**
 * Mock async authentication check
 * Replace with your actual authentication service call
 */
function checkAuthenticationAsync(): Observable<boolean> {
  // Example: Return observable that verifies token with server
  return new Observable<boolean>(observer => {
    setTimeout(() => {
      const isAuth = checkAuthentication();
      observer.next(isAuth);
      observer.complete();
    }, 100);
  });
}
