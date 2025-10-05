import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/**
 * Permission-based authorization guard
 * Protects routes based on specific user permissions
 * More granular than role-based access
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);

  // Get required permissions from route data
  const requiredPermissions = route.data?.['permissions'] as string[] || [];

  if (requiredPermissions.length === 0) {
    return true;
  }

  // Check permissions (replace with your actual service)
  return checkUserPermissions(requiredPermissions).pipe(
    take(1),
    map(hasPermission => {
      if (hasPermission) {
        return true;
      } else {
        router.navigate(['/access-denied']);
        return false;
      }
    })
  );
};

/**
 * Resource-specific permission guard
 * Checks if user has permission for a specific resource (e.g., edit specific user)
 */
export const resourcePermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);

  // Get resource info from route
  const resourceType = route.data?.['resourceType'] as string;
  const resourceId = route.params['id'];
  const action = route.data?.['action'] as string;

  if (!resourceType || !action) {
    return true;
  }

  // Check resource-specific permission
  return checkResourcePermission(resourceType, resourceId, action).pipe(
    take(1),
    map(hasPermission => {
      if (hasPermission) {
        return true;
      } else {
        router.navigate(['/access-denied']);
        return false;
      }
    })
  );
};

/**
 * Feature flag guard
 * Controls access based on feature flags
 */
export const featureGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);

  // Get feature flag from route data
  const featureFlag = route.data?.['feature'] as string;

  if (!featureFlag) {
    return true;
  }

  // Check if feature is enabled (replace with your feature service)
  const isFeatureEnabled = checkFeatureFlag(featureFlag);

  if (isFeatureEnabled) {
    return true;
  } else {
    router.navigate(['/not-found']);
    return false;
  }
};

/**
 * Combined permissions guard
 * Requires ALL specified permissions
 */
export const allPermissionsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const requiredPermissions = route.data?.['permissions'] as string[] || [];

  return checkAllPermissions(requiredPermissions).pipe(
    take(1),
    map(hasAllPermissions => {
      if (hasAllPermissions) {
        return true;
      } else {
        router.navigate(['/access-denied']);
        return false;
      }
    })
  );
};

/**
 * Any permissions guard
 * Requires ANY of the specified permissions
 */
export const anyPermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const requiredPermissions = route.data?.['permissions'] as string[] || [];

  return checkAnyPermission(requiredPermissions).pipe(
    take(1),
    map(hasAnyPermission => {
      if (hasAnyPermission) {
        return true;
      } else {
        router.navigate(['/access-denied']);
        return false;
      }
    })
  );
};

// Mock functions - replace with your actual implementation

function checkUserPermissions(permissions: string[]): Observable<boolean> {
  // Mock implementation - replace with actual service call
  const userPermissions = getCurrentUserPermissions();
  const hasPermissions = permissions.every(permission =>
    userPermissions.includes(permission)
  );
  return of(hasPermissions);
}

function checkResourcePermission(resourceType: string, resourceId: string, action: string): Observable<boolean> {
  // Mock implementation - replace with actual service call
  // Example: Check if user can perform 'edit' action on 'user' resource with id '123'
  console.log(`Checking ${action} permission for ${resourceType}:${resourceId}`);
  return of(true); // Mock result
}

function checkFeatureFlag(feature: string): boolean {
  // Mock implementation - replace with actual feature flag service
  const enabledFeatures = ['experimental-ui', 'beta-features'];
  return enabledFeatures.includes(feature);
}

function checkAllPermissions(permissions: string[]): Observable<boolean> {
  const userPermissions = getCurrentUserPermissions();
  const hasAll = permissions.every(permission =>
    userPermissions.includes(permission)
  );
  return of(hasAll);
}

function checkAnyPermission(permissions: string[]): Observable<boolean> {
  const userPermissions = getCurrentUserPermissions();
  const hasAny = permissions.some(permission =>
    userPermissions.includes(permission)
  );
  return of(hasAny);
}

function getCurrentUserPermissions(): string[] {
  // Mock implementation - replace with actual user service
  const userDataString = localStorage.getItem('user_data');

  if (!userDataString) {
    return [];
  }

  try {
    const userData = JSON.parse(userDataString);
    return userData.permissions || [];
  } catch {
    return [];
  }
}

/**
 * Higher-order function to create permission guards
 * Usage: createPermissionGuard(['read:users', 'write:users'])
 */
export function createPermissionGuard(requiredPermissions: string[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);

    return checkUserPermissions(requiredPermissions).pipe(
      take(1),
      map(hasPermission => {
        if (hasPermission) {
          return true;
        } else {
          router.navigate(['/access-denied']);
          return false;
        }
      })
    );
  };
}
