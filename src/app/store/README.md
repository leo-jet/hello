# NgRx Store

This folder contains the NgRx store implementation for state management in the Angular application.

## Architecture Overview

The store is organized using the **feature-based** approach with the following structure:

```
store/
├── app.state.ts           # Root application state interface
├── index.ts              # Root reducers and configuration
├── auth/                 # Authentication feature
│   ├── auth.state.ts     # Auth state interface
│   ├── auth.actions.ts   # Auth actions
│   ├── auth.reducer.ts   # Auth reducer
│   ├── auth.selectors.ts # Auth selectors
│   ├── auth.effects.ts   # Auth effects (side effects)
│   └── index.ts          # Auth feature exports
└── ui/                   # UI feature
    ├── ui.state.ts       # UI state interface
    ├── ui.actions.ts     # UI actions
    ├── ui.reducer.ts     # UI reducer
    ├── ui.selectors.ts   # UI selectors
    ├── ui.effects.ts     # UI effects
    └── index.ts          # UI feature exports
```

## Features

### Authentication Store (`auth/`)

Manages user authentication state including:
- **User Information**: Current user data, profile, roles
- **Authentication Status**: Login state, tokens, loading states
- **Auth Operations**: Login, register, logout, profile updates

**Key Actions:**
- `login` - Authenticate user with credentials
- `register` - Register new user account
- `logout` - Sign out current user
- `loadCurrentUser` - Load user profile from token
- `updateProfile` - Update user profile information
- `changePassword` - Change user password

**Key Selectors:**
- `selectCurrentUser` - Get current user object
- `selectIsAuthenticated` - Check if user is logged in
- `selectAuthLoading` - Check if auth operation is in progress
- `selectUserRole` - Get user's role
- `selectHasRole(role)` - Check if user has specific role

### UI Store (`ui/`)

Manages application UI state including:
- **Theme Management**: Light/dark mode, theme preferences
- **Loading States**: Global loading indicators
- **Sidebar State**: Sidebar open/closed state
- **Notifications**: In-app notifications and alerts
- **Breadcrumbs**: Navigation breadcrumb trail

**Key Actions:**
- `setTheme` - Change application theme
- `toggleSidebar` - Toggle sidebar visibility
- `addNotification` - Add new notification
- `setBreadcrumbs` - Set navigation breadcrumbs

**Key Selectors:**
- `selectTheme` - Get current theme
- `selectIsDarkMode` - Check if dark mode is active
- `selectSidebarOpen` - Check if sidebar is open
- `selectNotifications` - Get all notifications
- `selectBreadcrumbs` - Get navigation breadcrumbs

## Usage with Facade Services

The store includes **Facade Services** that provide a simplified interface for components:

### AuthFacade Service

```typescript
import { AuthFacade } from './services';

@Component({...})
export class LoginComponent {
  constructor(private authFacade: AuthFacade) {}

  // Subscribe to auth state
  user$ = this.authFacade.user$;
  isLoading$ = this.authFacade.isLoading$;
  
  // Dispatch actions
  login(credentials: LoginCredentials) {
    this.authFacade.login(credentials);
  }
  
  logout() {
    this.authFacade.logout();
  }
}
```

### UiFacade Service

```typescript
import { UiFacade } from './services';

@Component({...})
export class HeaderComponent {
  constructor(private uiFacade: UiFacade) {}

  // Subscribe to UI state
  isDarkMode$ = this.uiFacade.isDarkMode$;
  sidebarOpen$ = this.uiFacade.sidebarOpen$;
  
  // Dispatch actions
  toggleTheme() {
    this.uiFacade.toggleTheme();
  }
  
  toggleSidebar() {
    this.uiFacade.toggleSidebar();
  }
  
  showNotification() {
    this.uiFacade.addSuccessNotification('Success!', 'Operation completed.');
  }
}
```

## Direct Store Usage

For advanced scenarios, you can use the store directly:

```typescript
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import * as AuthActions from './store/auth/auth.actions';
import * as AuthSelectors from './store/auth/auth.selectors';

@Component({...})
export class MyComponent {
  constructor(private store: Store<AppState>) {}

  // Select data
  user$ = this.store.select(AuthSelectors.selectCurrentUser);
  
  // Dispatch actions
  login(credentials: LoginCredentials) {
    this.store.dispatch(AuthActions.login({ credentials }));
  }
}
```

## Effects and Side Effects

The store uses **NgRx Effects** to handle side effects like:
- HTTP API calls
- Local storage operations
- Navigation
- Notifications
- Integration with services

**Auth Effects:**
- Handle login/register API calls
- Navigate after successful auth operations
- Show success/error notifications
- Manage token storage

**UI Effects:**
- Apply theme changes to ThemeService
- Auto-remove notifications after timeout

## DevTools Integration

The store is configured with **Redux DevTools** for development:
- Time-travel debugging
- Action replay
- State inspection
- Performance monitoring

Enable Redux DevTools browser extension to use these features.

## Best Practices

### Component Integration
```typescript
@Component({
  template: `
    <div *ngIf="authFacade.isLoading$ | async">Loading...</div>
    <div *ngIf="authFacade.user$ | async as user">
      Welcome, {{ user.name }}!
    </div>
  `
})
export class UserComponent {
  constructor(public authFacade: AuthFacade) {}
}
```

### Error Handling
```typescript
// Effects handle errors and show notifications
this.authFacade.error$.subscribe(error => {
  if (error) {
    // Error notification is automatically shown by effects
    console.error('Auth error:', error);
  }
});
```

### Loading States
```typescript
// Use loading selectors for UI feedback
@Component({
  template: `
    <button 
      [disabled]="authFacade.isLoading$ | async"
      (click)="login()">
      <span *ngIf="authFacade.isLoading$ | async">Loading...</span>
      <span *ngIf="!(authFacade.isLoading$ | async)">Login</span>
    </button>
  `
})
```

### Memory Management
```typescript
@Component({...})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.authFacade.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        // Handle user changes
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Testing

### Unit Testing Actions
```typescript
describe('Auth Actions', () => {
  it('should create login action', () => {
    const credentials = { email: 'test@test.com', password: 'password' };
    const action = AuthActions.login({ credentials });
    
    expect(action.type).toBe('[Auth] Login');
    expect(action.credentials).toEqual(credentials);
  });
});
```

### Unit Testing Reducers
```typescript
describe('Auth Reducer', () => {
  it('should set loading state on login', () => {
    const action = AuthActions.login({ credentials: mockCredentials });
    const state = authReducer(initialAuthState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });
});
```

### Unit Testing Selectors
```typescript
describe('Auth Selectors', () => {
  it('should select current user', () => {
    const mockState = { auth: { user: mockUser, ...initialAuthState } };
    const result = AuthSelectors.selectCurrentUser.projector(mockState.auth);
    
    expect(result).toEqual(mockUser);
  });
});
```

### Integration Testing with Effects
```typescript
describe('Auth Effects', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        // Mock services
      ]
    });
  });

  it('should return loginSuccess action on successful login', () => {
    const action = AuthActions.login({ credentials: mockCredentials });
    const outcome = AuthActions.loginSuccess({ authResponse: mockResponse });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: outcome });

    expect(effects.login$).toBeObservable(expected);
  });
});
```

## Performance Optimization

### OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>{{ user$ | async | json }}</div>
  `
})
export class OptimizedComponent {
  user$ = this.authFacade.user$;
  
  constructor(private authFacade: AuthFacade) {}
}
```

### Memoized Selectors
Selectors are automatically memoized by NgRx for performance.

### Lazy Loading
Features can be lazy-loaded with their own feature stores:
```typescript
// In feature module
StoreModule.forFeature('featureName', featureReducer)
```

## Migration from Services

If migrating from service-based state management:

1. **Keep existing services** for now
2. **Add NgRx store** alongside services
3. **Migrate components** to use facades
4. **Remove old services** once migration is complete

This approach allows for gradual migration with minimal disruption.