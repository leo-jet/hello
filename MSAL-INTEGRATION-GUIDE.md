# MSAL Integration Guide

## Overview

The `BaseMsalApiService` extends `BaseApiService` to provide automatic Azure AD authentication using MSAL (Microsoft Authentication Library). This service handles token acquisition, refresh, and injection into HTTP requests.

## Installation

### 1. Install MSAL Packages

```bash
npm install @azure/msal-angular @azure/msal-browser
```

### 2. Environment Configuration

Add MSAL configuration to your `environment.ts` files:

```typescript
// src/environments/environment.ts
export interface Environment {
  production: boolean;
  apiUrl: string;
  msalConfig: {
    auth: {
      clientId: string;
      authority: string;
      redirectUri: string;
    };
    cache: {
      cacheLocation: 'localStorage' | 'sessionStorage';
      storeAuthStateInCookie: boolean;
    };
  };
  msalScopes: string[];
}

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  msalConfig: {
    auth: {
      clientId: 'YOUR_AZURE_AD_CLIENT_ID',
      authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
      redirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false
    }
  },
  msalScopes: [
    'user.read',
    'openid',
    'profile',
    'email'
  ]
};
```

### 3. Update Environment Type Definition

Update `src/environments/environment.d.ts` (create if it doesn't exist):

```typescript
export interface Environment {
  production: boolean;
  apiUrl: string;
  msalConfig?: {
    auth: {
      clientId: string;
      authority: string;
      redirectUri: string;
    };
    cache: {
      cacheLocation: 'localStorage' | 'sessionStorage';
      storeAuthStateInCookie: boolean;
    };
  };
  msalScopes?: string[];
}
```

### 4. Configure MSAL in App Config

Update your `app.config.ts`:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalRedirectComponent
} from '@azure/msal-angular';
import {
  PublicClientApplication,
  InteractionType
} from '@azure/msal-browser';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      MsalModule.forRoot(
        new PublicClientApplication(environment.msalConfig),
        {
          interactionType: InteractionType.Redirect,
          authRequest: {
            scopes: environment.msalScopes
          }
        },
        {
          interactionType: InteractionType.Redirect,
          protectedResourceMap: new Map([
            [environment.apiUrl, environment.msalScopes]
          ])
        }
      )
    ),
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};
```

### 5. Update Main.ts (for Redirect Component)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { MsalRedirectComponent } from '@azure/msal-angular';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

## Usage

### 1. Create an API Service Extending BaseMsalApiService

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMsalApiService } from './base-msal-api.service';
import { ApiResponse, User } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseMsalApiService {
  /**
   * Get user profile from Microsoft Graph API
   */
  getUserProfile(): Observable<ApiResponse<User>> {
    return this.getMsal<User>('https://graph.microsoft.com/v1.0/me');
  }

  /**
   * Get users list with custom scopes
   */
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.getMsal<User[]>(
      'users',
      { scopes: ['User.Read.All'] }
    );
  }

  /**
   * Update user profile
   */
  updateUser(userId: string, userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.putMsal<User>(
      `users/${userId}`,
      userData,
      { scopes: ['User.ReadWrite.All'] }
    );
  }

  /**
   * Force token refresh
   */
  getUsersWithRefresh(): Observable<ApiResponse<User[]>> {
    return this.getMsal<User[]>(
      'users',
      {
        scopes: ['User.Read.All'],
        forceRefresh: true
      }
    );
  }
}
```

### 2. Use in Components

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { UserApiService } from './services/user-api.service';
import { User } from '@app/models';

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  private userApiService = inject(UserApiService);
  user: User | null = null;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userApiService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response.data;
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
      }
    });
  }
}
```

## API Reference

### HTTP Methods with MSAL

All methods automatically acquire and inject Azure AD tokens:

- `getMsal<T>(endpoint, msalConfig?, config?)` - GET request
- `postMsal<T>(endpoint, body, msalConfig?, config?)` - POST request
- `putMsal<T>(endpoint, body, msalConfig?, config?)` - PUT request
- `patchMsal<T>(endpoint, body, msalConfig?, config?)` - PATCH request
- `deleteMsal<T>(endpoint, msalConfig?, config?)` - DELETE request

### MSAL Configuration

```typescript
interface MsalApiConfig {
  scopes?: string[];        // Override default scopes
  forceRefresh?: boolean;   // Force token refresh
}
```

### Helper Methods

```typescript
// Authentication state
protected isMsalAuthenticated(): boolean
protected getCurrentAccount()
protected getAllAccounts()
protected setActiveAccount(account: any): void

// Login/Logout
protected loginMsalPopup(scopes?: string[]): Observable<AuthenticationResult>
protected loginMsalRedirect(scopes?: string[]): Observable<void>
protected logoutMsal(): Observable<void>
protected logoutMsalRedirect(): Observable<void>

// Token acquisition
protected acquireTokenSilent(scopes?: string[]): Observable<AuthenticationResult>
```

## Token Handling

### Automatic Token Acquisition

The service automatically:
1. Attempts silent token acquisition from cache
2. Falls back to interactive authentication (popup) if silent acquisition fails
3. Injects the token into the `Authorization` header as `Bearer {token}`

### Token Refresh

Tokens are automatically refreshed when:
- They are expired
- `forceRefresh: true` is specified in `MsalApiConfig`

### Error Handling

- `InteractionRequiredAuthError`: Automatically triggers interactive authentication
- Other errors: Propagated to the caller for handling

## Common Scopes

### Microsoft Graph API
- `user.read` - Read user profile
- `user.readwrite` - Read and write user profile
- `mail.read` - Read user mail
- `mail.send` - Send mail as user
- `calendars.read` - Read user calendars
- `files.read` - Read user files

### Custom API Scopes
For your custom Azure AD-protected APIs:
- `api://{clientId}/access_as_user`
- `api://{clientId}/User.Read`
- `api://{clientId}/User.Write`

## Azure AD App Registration

### Required Configuration

1. **Redirect URIs**: Add your app URLs
   - `http://localhost:4200` (development)
   - `https://yourdomain.com` (production)

2. **Implicit Grant**: Enable ID tokens and Access tokens

3. **API Permissions**: Add required permissions
   - Microsoft Graph API permissions
   - Custom API permissions

4. **Authentication**: Configure platform
   - Single-page application
   - Enable public client flows (for mobile/desktop)

## Security Best Practices

1. **Never expose Client Secret** in frontend code
2. **Use appropriate scopes** - Request only what you need
3. **Implement token caching** - Already handled by MSAL
4. **Handle token expiration** - Already handled by MSAL
5. **Validate tokens on backend** - Always validate tokens server-side
6. **Use HTTPS** in production
7. **Implement proper error handling**

## Troubleshooting

### Common Issues

**Token acquisition fails**
- Check that the user is logged in: `isMsalAuthenticated()`
- Verify scopes are correctly configured
- Check Azure AD app registration permissions

**Popup blocked**
- Use redirect flow instead: `loginMsalRedirect()`
- Or inform users to allow popups

**CORS errors**
- Configure CORS on your API to accept requests from your domain
- Add domain to Azure AD app registration redirect URIs

**Token not injected**
- Verify the API endpoint matches `protectedResourceMap` in MSAL config
- Check that the method uses `*Msal` variants (e.g., `getMsal` not `get`)

## Examples

### Example 1: Simple GET Request

```typescript
getUserData(): Observable<ApiResponse<User>> {
  return this.getMsal<User>('user/profile');
}
```

### Example 2: POST with Custom Scopes

```typescript
createDocument(doc: Document): Observable<ApiResponse<Document>> {
  return this.postMsal<Document>(
    'documents',
    doc,
    { scopes: ['Files.ReadWrite.All'] }
  );
}
```

### Example 3: Force Token Refresh

```typescript
getLatestData(): Observable<ApiResponse<Data>> {
  return this.getMsal<Data>(
    'data/latest',
    { forceRefresh: true }
  );
}
```

### Example 4: Multiple API Calls with Different Scopes

```typescript
loadDashboardData(): Observable<DashboardData> {
  return forkJoin({
    user: this.getMsal<User>('me', { scopes: ['User.Read'] }),
    mail: this.getMsal<Mail[]>('mail', { scopes: ['Mail.Read'] }),
    calendar: this.getMsal<Event[]>('calendar', { scopes: ['Calendars.Read'] })
  }).pipe(
    map(responses => ({
      user: responses.user.data,
      mail: responses.mail.data,
      calendar: responses.calendar.data
    }))
  );
}
```

## Migration from Regular Auth

If you're migrating from regular auth to MSAL:

1. Change service to extend `BaseMsalApiService` instead of `BaseApiService`
2. Replace `get()` with `getMsal()`, `post()` with `postMsal()`, etc.
3. Remove manual token handling code
4. Configure MSAL as described above
5. Test with Azure AD authentication

**Before:**
```typescript
export class MyService extends BaseApiService {
  getData(): Observable<ApiResponse<Data>> {
    return this.get<Data>('data');
  }
}
```

**After:**
```typescript
export class MyService extends BaseMsalApiService {
  getData(): Observable<ApiResponse<Data>> {
    return this.getMsal<Data>('data');
  }
}
```

## Additional Resources

- [MSAL Angular Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)
- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/api/overview)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [MSAL Browser Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)
