# Mock LLM Models HTTP Interceptor

## 🎭 Description

Interceptor HTTP qui simule les réponses API pour l'endpoint `/api/llm-models`.
Permet de développer et tester l'application sans backend réel.

## 📦 Emplacement

```
src/app/interceptors/mock-llm-models.interceptor.ts
```

## 🔧 Configuration

L'interceptor est activé dans `app.config.ts` :

```typescript
import { mockLlmModelsInterceptor } from './interceptors/mock-llm-models.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([mockLlmModelsInterceptor])),
    // ...
  ]
};
```

## 📊 Données mockées

L'interceptor retourne 4 modèles LLM :

```typescript
[
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Modèle avancé',
    maxTokens: 8192,
    isAvailable: true
  },
  {
    id: 'gpt-5',
    name: 'GPT-5 Pro',
    provider: 'OpenAI',
    description: 'Avec raisonnement',
    maxTokens: 16384,
    isAvailable: true
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    provider: 'Anthropic',
    description: 'Anthropic',
    maxTokens: 100000,
    isAvailable: true
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Multimodal',
    maxTokens: 32768,
    isAvailable: true
  }
]
```

## 🚀 Fonctionnement

### 1. Interception automatique

```typescript
// Dans n'importe quel service
this.http.get<LlmModel[]>('/api/llm-models')
```

L'interceptor détecte l'URL et retourne automatiquement les données mockées.

### 2. Simulation réaliste

- ✅ **Délai** : 500ms pour simuler la latence réseau
- ✅ **HttpResponse** : Réponse HTTP complète (status 200)
- ✅ **Observable** : Retourne un Observable comme une vraie requête
- ✅ **Console log** : Log "🎭 Mock intercepté" pour le debugging

### 3. Transparent

Les autres requêtes HTTP passent normalement :

```typescript
// Cette requête n'est PAS interceptée
this.http.get('/api/users') // → va vers le vrai backend
```

## 🎯 Utilisation avec le Store

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ChatActions from '@app/store/chat';

@Component({...})
export class MyComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    // Dispatch l'action
    this.store.dispatch(ChatActions.loadLlmModels());
    
    // 1. L'Effect intercepte l'action
    // 2. Appelle ChatModeService.loadLlmModels()
    // 3. Le service fait http.get('/api/llm-models')
    // 4. L'interceptor retourne les données mockées
    // 5. Le store est mis à jour avec les modèles
  }
}
```

## 🔄 Flow complet

```
Component
  ↓ dispatch(loadLlmModels())
ChatEffects
  ↓ switchMap
ChatModeService.loadLlmModels()
  ↓ http.get('/api/llm-models')
mockLlmModelsInterceptor
  ↓ return Observable.of(mockData)
ChatEffects
  ↓ dispatch(loadLlmModelsSuccess({ models }))
ChatReducer
  ↓ update state
Component (via selectors)
  ✓ Affiche les modèles
```

## 🛠️ Personnalisation

### Modifier les données

Éditez `mock-llm-models.interceptor.ts` :

```typescript
const mockModels: LlmModel[] = [
  {
    id: 'mon-modele',
    name: 'Mon Modèle Custom',
    provider: 'MaCompany',
    description: 'Description personnalisée',
    maxTokens: 4096,
    isAvailable: true
  },
  // ...
];
```

### Modifier le délai

```typescript
return of(mockResponse).pipe(delay(1000)); // 1 seconde
```

### Simuler une erreur

```typescript
if (req.url.includes('/api/llm-models')) {
  // Simuler une erreur 500
  return throwError(() => new Error('Erreur serveur simulée')).pipe(
    delay(500)
  );
}
```

### Désactiver le mock

Dans `app.config.ts`, retirez l'interceptor :

```typescript
// Avant (avec mock)
provideHttpClient(withInterceptors([mockLlmModelsInterceptor]))

// Après (sans mock - utilise le vrai backend)
provideHttpClient()
```

## 🧪 Test du mock

### Console

Ouvrez la console du navigateur, vous devriez voir :

```
🎭 Mock intercepté: /api/llm-models
```

### Redux DevTools

1. Ouvrez Redux DevTools
2. Dispatch `loadLlmModels`
3. Observez la séquence :
   - `[Chat] Load LLM Models`
   - `[Chat] Load LLM Models Success` (avec les 4 modèles)

### Network Tab

Dans l'onglet Network, vous ne verrez **PAS** de vraie requête HTTP car elle est interceptée.

## 📱 Composant de démonstration

Un composant exemple est disponible :

```
src/app/components/model-selector-example/model-selector-example.component.ts
```

Pour l'utiliser, ajoutez-le à une route :

```typescript
{
  path: 'models-demo',
  component: ModelSelectorExampleComponent
}
```

Puis visitez : `http://localhost:4200/models-demo`

## ⚠️ Production

**IMPORTANT** : N'oubliez pas de retirer le mock en production !

```typescript
// app.config.ts
import { environment } from '@env/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // Utiliser le mock seulement en développement
    provideHttpClient(
      withInterceptors(
        environment.production ? [] : [mockLlmModelsInterceptor]
      )
    ),
  ]
};
```

## 🎓 Avantages

✅ **Développement indépendant** - Pas besoin de backend  
✅ **Tests rapides** - Réponses instantanées  
✅ **Données contrôlées** - Testez tous les cas  
✅ **Démos** - Présentations sans serveur  
✅ **CI/CD** - Tests automatisés sans dépendances  

## 🔗 Ressources

- [Angular HTTP Interceptors](https://angular.dev/guide/http/interceptors)
- [RxJS of()](https://rxjs.dev/api/index/function/of)
- [RxJS delay()](https://rxjs.dev/api/operators/delay)
