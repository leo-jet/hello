# 🎉 BaseMsalApiService - Intégration Complète

## ✅ Ce qui a été créé

### 1. Services API
- ✅ **base-msal-api.service.ts** - Service de base avec authentification Azure AD/MSAL
- ✅ **ms-graph-api.service.ts** - Exemple d'implémentation Microsoft Graph API

### 2. Documentation
- ✅ **MSAL-INTEGRATION-GUIDE.md** - Guide complet d'intégration (12+ sections)
- ✅ **MSAL-QUICK-START.md** - Guide de démarrage rapide
- ✅ **MSAL-SUMMARY.md** - Résumé de l'intégration
- ✅ **src/app/api/README.md** - Mis à jour avec instructions MSAL

### 3. Configuration
- ✅ **environment.interface.ts** - Ajout des types pour msalConfig et msalScopes
- ✅ **src/app/api/index.ts** - Export des nouveaux services

## 🎯 Fonctionnalités du BaseMsalApiService

### Gestion Automatique des Tokens
```typescript
// Acquisition silencieuse → Cache → Rafraîchissement automatique
// Fallback vers authentification interactive si nécessaire
this.getMsal<Data>('endpoint'); // Token géré automatiquement !
```

### Méthodes HTTP Disponibles
| Méthode | Description | Exemple |
|---------|-------------|---------|
| `getMsal<T>()` | GET avec auth | `this.getMsal<User>('users')` |
| `postMsal<T>()` | POST avec auth | `this.postMsal<User>('users', data)` |
| `putMsal<T>()` | PUT avec auth | `this.putMsal<User>('users/1', data)` |
| `patchMsal<T>()` | PATCH avec auth | `this.patchMsal<User>('users/1', data)` |
| `deleteMsal<T>()` | DELETE avec auth | `this.deleteMsal<void>('users/1')` |

### Méthodes d'Authentification
| Méthode | Description |
|---------|-------------|
| `loginMsalPopup()` | Login avec popup |
| `loginMsalRedirect()` | Login avec redirection |
| `logoutMsal()` | Logout avec popup |
| `logoutMsalRedirect()` | Logout avec redirection |
| `isMsalAuthenticated()` | Vérifier l'authentification |
| `getCurrentAccount()` | Obtenir le compte actuel |

### Configuration Personnalisée par Requête
```typescript
this.getMsal<User>('users', {
  scopes: ['User.Read.All'],    // Scopes personnalisés
  forceRefresh: true             // Forcer le rafraîchissement
});
```

## 📋 Pour Commencer

### Étape 1 : Installer les packages
```bash
npm install @azure/msal-angular @azure/msal-browser
```

### Étape 2 : Configurer environment.ts
```typescript
export const environment = {
  // ... configuration existante
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

### Étape 3 : Configurer app.config.ts
```typescript
import { MsalModule, MsalService, MsalGuard, MsalBroadcastService } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... providers existants
    importProvidersFrom(
      MsalModule.forRoot(
        new PublicClientApplication(environment.msalConfig),
        { interactionType: InteractionType.Redirect, authRequest: { scopes: environment.msalScopes } },
        { interactionType: InteractionType.Redirect, protectedResourceMap: new Map([
          [environment.apiUrl, environment.msalScopes]
        ])}
      )
    ),
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};
```

### Étape 4 : Créer votre service
```typescript
import { Injectable } from '@angular/core';
import { BaseMsalApiService } from '@app/api';

@Injectable({ providedIn: 'root' })
export class MyApiService extends BaseMsalApiService {
  getData() {
    return this.getMsal<MyData>('my-endpoint');
  }
}
```

### Étape 5 : Utiliser dans un composant
```typescript
export class MyComponent {
  private apiService = inject(MyApiService);
  
  loadData() {
    this.apiService.getData().subscribe({
      next: (response) => console.log(response.data),
      error: (error) => console.error(error)
    });
  }
}
```

## 📚 Exemples Complets

### Exemple 1 : API Simple
```typescript
@Injectable({ providedIn: 'root' })
export class UserApiService extends BaseMsalApiService {
  getUsers() {
    return this.getMsal<User[]>('users');
  }
  
  createUser(user: User) {
    return this.postMsal<User>('users', user);
  }
}
```

### Exemple 2 : Microsoft Graph API
```typescript
@Injectable({ providedIn: 'root' })
export class GraphService extends BaseMsalApiService {
  private graphUrl = 'https://graph.microsoft.com/v1.0';
  
  getMyProfile() {
    return this.getMsal<User>(`${this.graphUrl}/me`);
  }
  
  getMyMail() {
    return this.getMsal<Mail[]>(
      `${this.graphUrl}/me/messages`,
      { scopes: ['Mail.Read'] }
    );
  }
}
```

### Exemple 3 : Scopes Personnalisés
```typescript
@Injectable({ providedIn: 'root' })
export class SecureApiService extends BaseMsalApiService {
  getSecureData() {
    return this.getMsal<Data>('secure/endpoint', {
      scopes: ['api://your-api-id/YourScope.Read']
    });
  }
  
  updateWithRefresh(id: string, data: Data) {
    return this.putMsal<Data>(
      `items/${id}`,
      data,
      { 
        scopes: ['api://your-api-id/YourScope.Write'],
        forceRefresh: true 
      }
    );
  }
}
```

## 🔐 Configuration Azure AD

### Dans le Portail Azure (portal.azure.com)

1. **Azure Active Directory** → **App registrations** → **New registration**
2. **Name** : Nom de votre application
3. **Supported account types** : Choisir le type approprié
4. **Redirect URI** : 
   - Type: Single-page application (SPA)
   - URI: `http://localhost:4200` (dev) / `https://yourdomain.com` (prod)
5. **Register**

Après la création :
6. **Overview** → Copier **Application (client) ID**
7. **Overview** → Copier **Directory (tenant) ID**
8. **API permissions** → **Add a permission** → Ajouter les scopes nécessaires
   - Microsoft Graph (User.Read, Mail.Read, etc.)
   - Votre API personnalisée
9. **Grant admin consent** si nécessaire

### Scopes Communs

**Microsoft Graph :**
- `user.read` - Lire le profil
- `mail.read` - Lire les emails
- `mail.send` - Envoyer des emails
- `calendars.read` - Lire le calendrier
- `files.read` - Lire les fichiers

**API Personnalisée :**
- `api://{clientId}/access_as_user`
- `api://{clientId}/YourScope.Read`
- `api://{clientId}/YourScope.Write`

## 🎓 Documentation Détaillée

| Document | Description |
|----------|-------------|
| **MSAL-INTEGRATION-GUIDE.md** | Guide complet avec exemples, troubleshooting, best practices |
| **MSAL-QUICK-START.md** | Démarrage rapide en 5 étapes |
| **MSAL-SUMMARY.md** | Résumé de l'implémentation |
| **src/app/api/README.md** | Documentation des services API |
| **ms-graph-api.service.ts** | Exemple complet d'implémentation |

## 🚨 Notes Importantes

1. ⚠️ **Les packages MSAL ne sont pas installés** - Exécuter `npm install @azure/msal-angular @azure/msal-browser`
2. ⚠️ **Configuration Azure AD requise** - Créer une app registration
3. ⚠️ **Environment.ts à configurer** - Ajouter msalConfig et msalScopes
4. ⚠️ **App.config.ts à mettre à jour** - Importer MsalModule
5. ✅ **Le service est prêt** - Dès que la config est faite !

## 🎁 Bonus : Service Microsoft Graph Inclus

Un service complet `MsGraphApiService` est fourni avec des exemples pour :
- ✅ Profil utilisateur
- ✅ Emails (lecture/envoi)
- ✅ Calendrier
- ✅ OneDrive (fichiers)
- ✅ Teams
- ✅ Groupes
- ✅ Présence (statut en ligne)
- ✅ Organisation
- ✅ Recherche utilisateurs
- ✅ Batch requests

## 🏗️ Architecture

```
Component
    ↓
YourApiService (extends BaseMsalApiService)
    ↓
BaseMsalApiService
    ↓ (gère les tokens automatiquement)
    ↓
BaseApiService
    ↓
HttpClient
```

## ✨ Avantages

1. **🔒 Sécurité** - Authentification Azure AD enterprise-grade
2. **⚡ Performance** - Cache intelligent des tokens
3. **🎯 Simple** - Même API que BaseApiService
4. **🔄 Automatique** - Gestion des tokens transparente
5. **💪 Robuste** - Gestion d'erreurs et fallbacks
6. **🎨 Flexible** - Scopes personnalisables par requête
7. **📦 Prêt à l'emploi** - Juste installer et configurer !

## 🚀 Prochaines Étapes

1. ✅ Lire MSAL-QUICK-START.md
2. ✅ Installer les packages MSAL
3. ✅ Configurer Azure AD
4. ✅ Configurer environment.ts
5. ✅ Configurer app.config.ts
6. ✅ Créer votre premier service
7. ✅ Tester !

---

**Prêt à démarrer ?** 🎉 Commencez par [MSAL-QUICK-START.md](./MSAL-QUICK-START.md)
