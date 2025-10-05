# Angular Guards

This folder contains Angular route guards organized by functionality type.

## Directory Structure

```
src/app/guards/
├── auth.guard.ts              # Authentication guards
├── role.guard.ts              # Role-based access guards
├── unsaved-changes.guard.ts   # Navigation protection guards
├── permissions.guard.ts       # Permission-based guards
├── index.ts                  # Barrel exports
└── README.md                 # This documentation
```

## Available Guards

### Authentication Guards (`./auth.guard.ts`)

#### `authGuard`
Basic authentication guard that checks if user is logged in.
```typescript
// Route configuration
{
  path: 'profile',
  component: ProfileComponent,
  canActivate: [authGuard]
}
```

#### `asyncAuthGuard`
Async authentication guard for server-side token verification.
```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [asyncAuthGuard]
}
```

### Role-Based Guards (`./role.guard.ts`)

#### `roleGuard`
Generic role-based access control using route data.
```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['admin', 'super-admin'] }
}
```

#### `adminGuard`
Shortcut guard for admin-only routes.
```typescript
{
  path: 'admin-panel',
  component: AdminPanelComponent,
  canActivate: [adminGuard]
}
```

#### `moderatorGuard`
Allows access for moderators and admins.
```typescript
{
  path: 'moderation',
  component: ModerationComponent,
  canActivate: [moderatorGuard]
}
```

#### `createRoleGuard(roles: string[])`
Factory function to create custom role guards.
```typescript
const managerGuard = createRoleGuard(['manager', 'admin']);

{
  path: 'reports',
  component: ReportsComponent,
  canActivate: [managerGuard]
}
```

### Unsaved Changes Guards (`./unsaved-changes.guard.ts`)

#### `unsavedChangesGuard`
Prevents navigation when component has unsaved changes.
```typescript
// Component must implement CanComponentDeactivate
export class EditComponent implements CanComponentDeactivate {
  canDeactivate(): boolean {
    return !this.hasUnsavedChanges;
  }
}

// Route configuration
{
  path: 'edit/:id',
  component: EditComponent,
  canDeactivate: [unsavedChangesGuard]
}
```

#### `formGuard`
Quick guard for Angular Reactive Forms.
```typescript
export class FormComponent {
  form = this.fb.group({...});
}

{
  path: 'form',
  component: FormComponent,
  canDeactivate: [formGuard]
}
```

### Permission Guards (`./permissions.guard.ts`)

#### `permissionGuard`
Granular permission-based access control.
```typescript
{
  path: 'users',
  component: UsersComponent,
  canActivate: [permissionGuard],
  data: { permissions: ['read:users', 'list:users'] }
}
```

#### `resourcePermissionGuard`
Permission checks for specific resources.
```typescript
{
  path: 'users/:id/edit',
  component: EditUserComponent,
  canActivate: [resourcePermissionGuard],
  data: {
    resourceType: 'user',
    action: 'edit'
  }
}
```

#### `featureGuard`
Feature flag-based access control.
```typescript
{
  path: 'beta-feature',
  component: BetaComponent,
  canActivate: [featureGuard],
  data: { feature: 'beta-features' }
}
```

## Usage Examples

### Basic Route Protection
```typescript
// app.routes.ts
import { authGuard, roleGuard } from './guards';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },

  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Admin-only routes
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  }
];
```

### Multiple Guards Chain
```typescript
{
  path: 'secure-feature',
  component: SecureFeatureComponent,
  canActivate: [
    authGuard,           // Must be logged in
    roleGuard,           // Must have correct role
    permissionGuard,     // Must have specific permissions
    featureGuard         // Feature must be enabled
  ],
  data: {
    roles: ['user', 'admin'],
    permissions: ['read:feature', 'use:feature'],
    feature: 'secure-feature-flag'
  }
}
```

### Form Protection
```typescript
// Component implementing CanComponentDeactivate
export class ProfileEditComponent implements CanComponentDeactivate {
  @ViewChild('profileForm') form!: NgForm;

  canDeactivate(): boolean {
    return !this.form.dirty;
  }
}

// Route with unsaved changes protection
{
  path: 'profile/edit',
  component: ProfileEditComponent,
  canActivate: [authGuard],
  canDeactivate: [unsavedChangesGuard]
}
```

### Custom Guard Creation
```typescript
// Custom business logic guard
const businessHoursGuard: CanActivateFn = () => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 9 && hour <= 17) {
    return true;
  } else {
    alert('This feature is only available during business hours (9 AM - 5 PM)');
    return false;
  }
};

// Usage
{
  path: 'business-feature',
  component: BusinessFeatureComponent,
  canActivate: [authGuard, businessHoursGuard]
}
```

### Guard with Async Operations
```typescript
const apiHealthGuard: CanActivateFn = () => {
  const http = inject(HttpClient);

  return http.get('/api/health').pipe(
    map(() => true),
    catchError(() => {
      alert('Service is currently unavailable');
      return of(false);
    })
  );
};
```

## Component Implementation

### Implementing CanComponentDeactivate
```typescript
import { CanComponentDeactivate } from './guards';

@Component({...})
export class EditComponent implements CanComponentDeactivate {
  private isDirty = false;

  canDeactivate(): boolean | Observable<boolean> {
    if (!this.isDirty) {
      return true;
    }

    // Simple confirmation
    return confirm('You have unsaved changes. Are you sure you want to leave?');
  }

  // Or async version
  canDeactivateAsync(): Observable<boolean> {
    if (!this.isDirty) {
      return of(true);
    }

    // Custom dialog service
    return this.dialogService.confirm(
      'Unsaved Changes',
      'You have unsaved changes. Are you sure you want to leave?'
    );
  }
}
```

### Using Environment Service with Guards
```typescript
import { EnvironmentService } from '../environments/environment.service';

const developmentOnlyGuard: CanActivateFn = () => {
  const envService = inject(EnvironmentService);

  if (envService.isDevelopment) {
    return true;
  } else {
    alert('This feature is only available in development mode');
    return false;
  }
};
```

## Testing Guards

### Unit Testing Example
```typescript
describe('AuthGuard', () => {
  let guard: typeof authGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });

    router = TestBed.inject(Router);
    guard = authGuard;
  });

  it('should allow access for authenticated users', () => {
    // Mock authentication
    spyOn(localStorage, 'getItem').and.returnValue('valid-token');

    const result = guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBe(true);
  });

  it('should redirect unauthenticated users', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(router, 'navigate');

    const result = guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], jasmine.any(Object));
  });
});
```

## Best Practices

1. **Chain Guards Properly**: Place authentication guards before authorization guards
2. **Use Meaningful Names**: Guard names should clearly indicate their purpose
3. **Handle Errors Gracefully**: Provide user feedback when access is denied
4. **Keep Guards Focused**: Each guard should have a single responsibility
5. **Test Guards Thoroughly**: Unit test all guard logic and edge cases
6. **Use Factory Functions**: For reusable guards with parameters
7. **Consider Performance**: Avoid expensive operations in guards
8. **Provide Fallbacks**: Always have routes for denied access (login, unauthorized, etc.)

## Security Notes

- Guards run on the client side and can be bypassed by determined users
- Always validate permissions on the server side
- Use guards for UX enhancement, not security enforcement
- Sensitive operations should always be protected server-side
- Regular security audits of guard implementations are recommended
