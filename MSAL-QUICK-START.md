# Installation Rapide MSAL

## 1. Installer les packages

```bash
npm install @azure/msal-angular @azure/msal-browser
```

## 2. Configuration minimale

### environment.ts

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  msalConfig: {
    auth: {
      clientId: 'VOTRE_CLIENT_ID_AZURE',
      authority: 'https://login.microsoftonline.com/VOTRE_TENANT_ID',
      redirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false
    }
  },
  msalScopes: ['user.read', 'openid', 'profile']
};
```

### app.config.ts

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MsalModule, MsalService, MsalGuard, MsalBroadcastService } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
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
          authRequest: { scopes: environment.msalScopes }
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

## 3. Utilisation dans un service

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMsalApiService } from '@app/api';
import { ApiResponse, User } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class MyApiService extends BaseMsalApiService {

  // Requête avec authentification Azure AD automatique
  getUserData(): Observable<ApiResponse<User>> {
    return this.getMsal<User>('user/profile');
  }

  // Avec scopes personnalisés
  getSecureData(): Observable<ApiResponse<any>> {
    return this.getMsal<any>('secure/data', {
      scopes: ['api://votre-api/access']
    });
  }
}
```

## 4. Configuration Azure AD

### Dans le portail Azure :

1. **App Registration** → Créer une nouvelle application
2. **Authentication** → Ajouter la plateforme "Single-page application"
3. **Redirect URIs** → Ajouter `http://localhost:4200`
4. **API permissions** → Ajouter les permissions nécessaires
5. **Copier le Client ID et Tenant ID**

## 5. Test

```typescript
// Dans un composant
export class MyComponent implements OnInit {
  private apiService = inject(MyApiService);

  ngOnInit() {
    this.apiService.getUserData().subscribe({
      next: (response) => console.log('Success:', response.data),
      error: (error) => console.error('Error:', error)
    });
  }
}
```

## Documentation complète

Voir [MSAL-INTEGRATION-GUIDE.md](./MSAL-INTEGRATION-GUIDE.md) pour plus de détails.
