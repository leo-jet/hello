# TypeScript Enums

This folder contains TypeScript enums organized by domain/functionality.

## Directory Structure

```
src/app/enums/
├── user.enum.ts       # UserRole, UserStatus, UserPermission
├── ui.enum.ts         # Theme, ButtonSize, ButtonVariant, etc.
├── status.enum.ts     # HttpStatus, LoadingState, ApiStatus, etc.
├── index.ts          # Barrel exports for easy importing
└── README.md         # This documentation
```

## Available Enums

### User Enums (`./user.enum.ts`)

#### UserRole
Defines user roles in the application:
```typescript
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest',
}
```

#### UserStatus
Defines user account states:
```typescript
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}
```

#### UserPermission
Defines user permissions:
```typescript
export enum UserPermission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
  MODERATE = 'moderate',
}
```

### UI Enums (`./ui.enum.ts`)

#### Theme
Application theme options:
```typescript
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}
```

#### ButtonSize & ButtonVariant
Button styling options:
```typescript
export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra-large',
}

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  // ... etc
}
```

### Status Enums (`./status.enum.ts`)

#### HttpStatus
HTTP status codes:
```typescript
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  // ... etc
}
```

#### LoadingState
Async operation states:
```typescript
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
```

## Usage Examples

### Importing Individual Enums
```typescript
import { UserRole } from './enums/user.enum';
import { ButtonSize } from './enums/ui.enum';

// Usage
const currentUserRole: UserRole = UserRole.ADMIN;
const buttonSize: ButtonSize = ButtonSize.LARGE;
```

### Importing via Barrel Exports
```typescript
import { UserRole, ButtonSize, LoadingState } from './enums';

// Usage
const user = {
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
};

const buttonProps = {
  size: ButtonSize.MEDIUM,
  variant: ButtonVariant.PRIMARY,
};

const apiState = LoadingState.LOADING;
```

### In Components
```typescript
import { Component } from '@angular/core';
import { UserRole, LoadingState } from './enums';

@Component({
  template: \`
    <div [ngClass]="getButtonClass()">
      <span *ngIf="loadingState === LoadingState.LOADING">Loading...</span>
      <span *ngIf="userRole === UserRole.ADMIN">Admin Panel</span>
    </div>
  \`
})
export class MyComponent {
  UserRole = UserRole; // Make enum available in template
  LoadingState = LoadingState;

  userRole: UserRole = UserRole.USER;
  loadingState: LoadingState = LoadingState.IDLE;

  getButtonClass(): string {
    return \`btn-\${this.userRole}\`;
  }
}
```

### In Services
```typescript
import { Injectable } from '@angular/core';
import { HttpStatus, ApiStatus } from './enums';

@Injectable()
export class ApiService {
  handleResponse(status: number): ApiStatus {
    switch (status) {
      case HttpStatus.OK:
        return ApiStatus.COMPLETED;
      case HttpStatus.BAD_REQUEST:
        return ApiStatus.FAILED;
      default:
        return ApiStatus.PENDING;
    }
  }
}
```

## Best Practices

1. **String vs Numeric Enums**: Use string enums for better debugging and serialization
2. **Naming**: Use UPPER_CASE for enum values, PascalCase for enum names
3. **Organization**: Group related enums by domain/functionality
4. **Documentation**: Add JSDoc comments explaining each enum's purpose
5. **Barrel Exports**: Use index.ts for convenient importing
6. **Type Safety**: Always specify enum types in function parameters and variables

## Creating New Enums

1. Create a new folder under `src/app/enums/` for your domain
2. Add your enum file: `your-domain.enum.ts`
3. Export it in `index.ts`
4. Update this README with documentation and examples
