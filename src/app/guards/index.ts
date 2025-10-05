// Auth guards
export {
  authGuard,
  asyncAuthGuard,
} from './auth.guard';

// Role-based guards
export {
  roleGuard,
  adminGuard,
  moderatorGuard,
  createRoleGuard,
} from './role.guard';

// Unsaved changes guards
export {
  unsavedChangesGuard,
  formGuard,
  createUnsavedChangesGuard,
  createAdvancedUnsavedChangesGuard,
} from './unsaved-changes.guard';

export type { CanComponentDeactivate } from './unsaved-changes.guard';

// Permission-based guards
export {
  permissionGuard,
  resourcePermissionGuard,
  featureGuard,
  allPermissionsGuard,
  anyPermissionGuard,
  createPermissionGuard,
} from './permissions.guard';
