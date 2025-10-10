# Services

This folder contains Angular services that provide business logic, data management, and cross-cutting concerns for the application.

> **Note**: API services (HTTP communication with backend) are located in the `/api` folder.

## Available Services

### Facade Services

#### Auth Facade (`auth-facade.service.ts`)
Simplified interface for authentication state management:
- Uses NgRx Store for state management
- Provides observables for auth state
- Dispatches authentication actions
- Integrates with AuthService from `/api` folder

#### UI Facade (`ui-facade.service.ts`)
Unified interface for UI-related services:
- Combines LoadingService, NotificationService, ThemeService
- Provides simplified API for common UI operations
- Reduces boilerplate in components

### Core Services Loading Service (`loading.service.ts`)
Manages global loading states:
- **Loading Counter**: Track multiple concurrent operations
- **Observable State**: Reactive loading state for UI components
- **Utility Methods**: Helper methods for loading operations
- **Safe Operations**: Prevents negative counter states

**Usage:**
```typescript
// In component
constructor(private loading: LoadingService) {}

// Show loading
this.loading.show();

// Hide loading
this.loading.hide();

// Execute with loading
await this.loading.withLoading(async () => {
  // Your async operation
});
```

### Notification Service (`notification.service.ts`)
Manages application notifications and alerts:
- **Notification Types**: Success, error, warning, info
- **Auto-dismiss**: Configurable duration for notifications
- **Persistent Notifications**: For critical messages
- **Queue Management**: Multiple notifications support

**Features:**
- Unique ID generation for tracking
- Timestamp for each notification
- Type-based filtering and clearing
- Customizable duration and persistence

### Theme Service (`theme.service.ts`)
Manages application theme and dark mode:
- **Theme Options**: Light, dark, and auto (system preference)
- **System Integration**: Responds to OS theme changes
- **Persistence**: Saves user preference to localStorage
- **CSS Integration**: Applies theme classes to document

**Features:**
- Auto theme based on system preference
- Toggle functionality
- Theme persistence across sessions
- Color scheme integration for better browser support

### Storage Service (`storage.service.ts`)
Centralized data storage management:
- **User Preferences**: Theme, language, notification settings
- **App Settings**: Application-specific configurations
- **Form Drafts**: Auto-save form data
- **Recent Searches**: Search history management
- **Data Export/Import**: Backup and restore functionality

**Storage Types:**
- localStorage for persistent data
- sessionStorage for temporary data
- Automatic cleanup of old data
- Storage usage monitoring

## Service Architecture

### Inheritance Pattern
```typescript
// Base service for API operations
export class UserService extends BaseApiService {
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.get<User[]>('users');
  }
}
```

### Dependency Injection
All services use Angular's dependency injection:
```typescript
@Injectable({
  providedIn: 'root'
})
export class MyService {
  constructor(
    private auth: AuthService,
    private notification: NotificationService
  ) {}
}
```

### Observable Patterns
Services use RxJS observables for reactive programming:
```typescript
// Subscribe to user state
this.auth.currentUser$.subscribe(user => {
  // Handle user changes
});

// Subscribe to theme changes
this.theme.isDarkMode$.subscribe(isDark => {
  // Handle theme changes
});
```

## Error Handling

### Global Error Handling
```typescript
// BaseApiService handles common HTTP errors
this.userService.getUser(id).subscribe({
  next: (response) => {
    // Handle success
  },
  error: (error) => {
    // Error is already processed by BaseApiService
    this.notification.error('Failed to load user', error.message);
  }
});
```

### Service-Specific Errors
```typescript
// Custom error handling in services
login(credentials: LoginCredentials): Observable<ApiResponse<AuthResponse>> {
  return this.post<AuthResponse>('auth/login', credentials).pipe(
    tap(response => {
      this.setAuthData(response.data);
      this.notification.success('Login successful');
    }),
    catchError(error => {
      this.notification.error('Login failed', error.message);
      return throwError(() => error);
    })
  );
}
```

## Testing Services

### Unit Testing
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login user', () => {
    const mockResponse = { data: mockUser, token: 'token' };

    service.login(mockCredentials).subscribe(response => {
      expect(response.data).toEqual(mockUser);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
```

## Best Practices

### Service Design
- **Single Responsibility**: Each service has a clear, focused purpose
- **Reactive Programming**: Use observables for state management
- **Error Handling**: Centralized error processing
- **Type Safety**: Strong typing with TypeScript interfaces

### Performance
- **Lazy Loading**: Services are loaded only when needed
- **Caching**: Implement caching for expensive operations
- **Memory Management**: Unsubscribe from observables to prevent leaks

### Security
- **Token Management**: Secure storage and automatic refresh
- **Input Validation**: Validate data before API calls
- **Error Messages**: Don't expose sensitive information

## Creating New Services

1. **Generate Service**: `ng generate service services/my-service`
2. **Extend Base**: Extend BaseApiService for API operations
3. **Add Interfaces**: Define TypeScript interfaces for data
4. **Implement Methods**: Add business logic methods
5. **Export**: Add to `index.ts` for easy importing
6. **Document**: Update this README with service details

## Environment Configuration

Services use environment-specific configuration:
```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api',
  production: false
};
```

## Integration Examples

### Component Integration
```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="loading.loading$ | async">Loading...</div>
    <div *ngFor="let notification of notification.notifications$ | async">
      {{ notification.title }}
    </div>
  `
})
export class UserProfileComponent {
  constructor(
    public loading: LoadingService,
    public notification: NotificationService,
    private auth: AuthService
  ) {}
}
```
