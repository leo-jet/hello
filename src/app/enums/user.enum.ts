/**
 * User role enumeration
 * Defines the different roles a user can have in the application
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest',
}

/**
 * User status enumeration
 * Defines the different states a user account can be in
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

/**
 * User permissions enumeration
 * Defines specific permissions that can be granted to users
 */
export enum UserPermission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
  MODERATE = 'moderate',
}
