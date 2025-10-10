# Structure des Services - Architecture

## Organisation

L'application utilise une séparation claire entre les services API et les services métier :

```
src/app/
├── api/                      # Services API (communication HTTP)
│   ├── base-api.service.ts   # Service de base pour HTTP
│   ├── auth.service.ts       # Authentification API
│   ├── index.ts              # Exports publics
│   └── README.md
│
└── services/                 # Services métier (logique applicative)
    ├── auth-facade.service.ts    # Facade NgRx pour auth
    ├── ui-facade.service.ts      # Facade pour UI services
    ├── loading.service.ts        # Gestion du loading
    ├── notification.service.ts   # Système de notifications
    ├── theme.service.ts          # Gestion du thème
    ├── storage.service.ts        # Gestion du stockage local
    ├── chat-mode.service.ts      # Gestion des modes de chat
    ├── index.ts                  # Exports publics
    └── README.md
```

## Principes de séparation

### Dossier `/api`
**Responsabilité** : Communication avec le backend via HTTP

- Tous les services qui font des appels HTTP
- Héritent de `BaseApiService`
- Retournent des `Observable<ApiResponse<T>>`
- Gestion centralisée des erreurs HTTP
- Configuration des requêtes (timeout, retry, headers)

**Exemples** :
- `AuthService` - Login, register, refresh token
- `UserService` - CRUD utilisateurs
- `ChatService` - Gestion des conversations

### Dossier `/services`
**Responsabilité** : Logique métier et gestion d'état

- Services qui ne font PAS d'appels HTTP directs
- Gestion d'état locale (BehaviorSubject, signals)
- Orchestration de la logique métier
- Services utilitaires (theme, storage, notifications)
- Facades NgRx

**Exemples** :
- `LoadingService` - État de chargement global
- `NotificationService` - Système de toast/notifications
- `ThemeService` - Dark mode / light mode
- `AuthFacade` - Interface simplifiée pour l'état auth (NgRx)

## Imports recommandés

### Avec path aliases (tsconfig.json)

```typescript
// Import depuis le dossier API
import { AuthService } from '@app/api';
import { BaseApiService } from '@app/api/base-api.service';

// Import depuis le dossier services
import { LoadingService, NotificationService } from '@app/services';
import { AuthFacade } from '@app/services/auth-facade.service';
```

### Sans path aliases (chemins relatifs)

```typescript
// Depuis un component
import { AuthService } from '../../api/auth.service';
import { LoadingService } from '../../services/loading.service';
```

## Bonnes pratiques

### ✅ Faire

1. **Services API** : Étendre `BaseApiService` pour tous les services API
2. **Types** : Définir des interfaces pour les requêtes et réponses
3. **Erreurs** : Laisser `BaseApiService` gérer les erreurs HTTP
4. **Injection** : Utiliser `inject()` dans les constructeurs (Angular 14+)
5. **Observables** : Retourner des Observables pour les opérations asynchrones

### ❌ Éviter

1. Ne pas faire d'appels HTTP directement dans les services métier
2. Ne pas dupliquer la logique de gestion d'erreurs
3. Ne pas mettre de logique métier complexe dans les services API
4. Ne pas mélanger responsabilités API et métier dans un même service

## Migration d'un service

Si vous avez un service qui fait à la fois de l'HTTP et de la logique métier :

1. **Extraire** la partie HTTP vers `/api`
2. **Créer** un service métier dans `/services` qui utilise le service API
3. **Mettre à jour** les imports dans toute l'application

### Exemple

**Avant** (tout dans `/services/user.service.ts`) :
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers() { /* HTTP call */ }
  formatUserName(user: User) { /* logique métier */ }
}
```

**Après** :

`/api/user-api.service.ts` :
```typescript
export class UserApiService extends BaseApiService {
  getUsers() { return this.get<User[]>('/users'); }
}
```

`/services/user.service.ts` :
```typescript
export class UserService {
  constructor(private userApi: UserApiService) {}

  async loadUsers() {
    const response = await firstValueFrom(this.userApi.getUsers());
    return response.data.map(u => this.formatUserName(u));
  }

  formatUserName(user: User) { /* logique métier */ }
}
```

## Tests

- **Services API** : Mocker HttpClient, tester les endpoints et la gestion d'erreurs
- **Services métier** : Mocker les services API, tester la logique métier

## Voir aussi

- [API Services README](../api/README.md)
- [Services README](./README.md)
