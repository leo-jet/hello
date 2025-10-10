# API Services

Ce dossier contient tous les services qui interagissent avec les APIs backend.

## Structure

```
api/
├── base-api.service.ts          # Service de base pour HTTP (sans auth)
├── base-msal-api.service.ts     # Service de base avec Azure AD/MSAL
├── auth.service.ts              # Service d'authentification
├── ms-graph-api.service.ts      # Microsoft Graph API (exemple)
└── index.ts                     # Exports
```

## Types de Services

### 1. BaseApiService
**Usage** : Requêtes HTTP sans authentification Azure AD
**Utiliser quand** :
- Endpoints publics
- Authentification personnalisée
- APIs non-Azure AD

**Exemple** :
```typescript
export class PublicApiService extends BaseApiService {
  getPublicData(): Observable<ApiResponse<Data>> {
    return this.get<Data>('public/data');
  }
}
```

### 2. BaseMsalApiService
**Usage** : Requêtes HTTP avec authentification Azure AD automatique
**Utiliser quand** :
- APIs protégées par Azure AD
- Microsoft Graph API
- Services Microsoft 365
- SSO d'entreprise

**Exemple** :
```typescript
export class SecureApiService extends BaseMsalApiService {
  getSecureData(): Observable<ApiResponse<Data>> {
    return this.getMsal<Data>('secure/data', {
      scopes: ['api://your-api-id/access']
    });
  }
}
```

## Principes

1. **Séparation des responsabilités** : Les services API se concentrent uniquement sur les communications HTTP
2. **Héritage** : Tous les services API doivent étendre `BaseApiService` ou `BaseMsalApiService`
3. **Typage fort** : Utiliser des interfaces TypeScript depuis `@app/models`
4. **Gestion d'erreurs** : Gestion automatique des erreurs HTTP

## Utilisation

```typescript
// Import depuis @app/api
import { AuthService, BaseMsalApiService } from '@app/api';

// ou import direct
import { AuthService } from '@app/api/auth.service';
```

## Méthodes Disponibles

### BaseApiService
- `get<T>(endpoint, config?)`
- `post<T>(endpoint, body, config?)`
- `put<T>(endpoint, body, config?)`
- `patch<T>(endpoint, body, config?)`
- `delete<T>(endpoint, config?)`
- `uploadFile<T>(endpoint, file, additionalData?, config?)`
- `downloadFile(endpoint, filename?, config?)`

### BaseMsalApiService (en plus de BaseApiService)
- `getMsal<T>(endpoint, msalConfig?, config?)` - GET avec auth Azure AD
- `postMsal<T>(endpoint, body, msalConfig?, config?)` - POST avec auth
- `putMsal<T>(endpoint, body, msalConfig?, config?)` - PUT avec auth
- `patchMsal<T>(endpoint, body, msalConfig?, config?)` - PATCH avec auth
- `deleteMsal<T>(endpoint, msalConfig?, config?)` - DELETE avec auth
- `loginMsalPopup(scopes?)` - Login Azure AD
- `logoutMsal()` - Logout Azure AD
- `isMsalAuthenticated()` - Vérifier l'authentification

## Ajouter un nouveau service API

### Option A : Sans MSAL (authentification classique)

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, YourModel } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class YourApiService extends BaseApiService {

  getItems(): Observable<ApiResponse<YourModel[]>> {
    return this.get<YourModel[]>('items');
  }

  createItem(item: YourModel): Observable<ApiResponse<YourModel>> {
    return this.post<YourModel>('items', item);
  }
}
```

### Option B : Avec MSAL (authentification Azure AD)

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMsalApiService } from './base-msal-api.service';
import { ApiResponse, YourModel } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class YourMsalApiService extends BaseMsalApiService {

  getItems(): Observable<ApiResponse<YourModel[]>> {
    return this.getMsal<YourModel[]>('items');
  }

  createItem(item: YourModel): Observable<ApiResponse<YourModel>> {
    return this.postMsal<YourModel>(
      'items',
      item,
      { scopes: ['YourApi.Write'] }
    );
  }
}
```

N'oubliez pas d'exporter dans `index.ts` :
```typescript
export * from './your-api.service';
```

## Configuration MSAL

Pour intégrer MSAL, installer les packages :
```bash
npm install @azure/msal-angular @azure/msal-browser
```

Voir [MSAL-INTEGRATION-GUIDE.md](../../MSAL-INTEGRATION-GUIDE.md) pour la configuration complète.

## Documentation Connexe

- [Guide d'intégration MSAL](../../MSAL-INTEGRATION-GUIDE.md)
- [Architecture](../../ARCHITECTURE-REFACTORING.md)
- [Modèles](../models/README.md)
