import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';

/**
 * Role-based authorization guard
 * Protects routes based on user roles
 * Requires authentication guard to run first
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);

  // Get required roles from route data
  const requiredRoles = route.data?.['roles'] as string[] || [];

  if (requiredRoles.length === 0) {
    // No specific roles required, allow access
    return true;
  }

  // Get user roles (replace with your actual implementation)
  const userRoles = getCurrentUserRoles();

  // Check if user has any of the required roles
  const hasRequiredRole = requiredRoles.some(role =>
    userRoles.includes(role)
  );

  if (hasRequiredRole) {
    return true;
  } else {
    // Redirect to unauthorized page
    router.navigate(['/unauthorized']);
    return false;
  }
};

/**
 * Admin role guard
 * Shortcut guard for admin-only routes
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRoles = getCurrentUserRoles();

  if (userRoles.includes('admin')) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};

/**
 * Moderator or Admin guard
 * Allows access for moderators and admins
 */
export const moderatorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRoles = getCurrentUserRoles();

  const hasAccess = userRoles.some(role =>
    ['admin', 'moderator'].includes(role)
  );

  if (hasAccess) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};

/**
 * Mock function to get current user roles
 * Replace with your actual user service
 */
function getCurrentUserRoles(): string[] {
  // Example: Get roles from localStorage or service
  const userDataString = localStorage.getItem('user_data');

  if (!userDataString) {
    return [];
  }

  try {
    const userData = JSON.parse(userDataString);
    return userData.roles || [];
  } catch {
    return [];
  }
}

/**
 * Higher-order function to create role guards
 * Usage: createRoleGuard(['admin', 'manager'])
 */
export function createRoleGuard(allowedRoles: string[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    const userRoles = getCurrentUserRoles();

    const hasAccess = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (hasAccess) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  };
}
