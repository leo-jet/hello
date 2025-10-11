# Migration ChatLayoutComponent vers NgRx Store

## 📋 Changements effectués

### Avant (Données statiques)
```typescript
availableModels: AIModel[] = [
  { id: 'gpt-4', display_name: 'GPT-4', ... },
  { id: 'gpt-5', display_name: 'GPT-5 Pro', ... },
  { id: 'claude-3', display_name: 'Claude 3', ... },
  { id: 'gemini-pro', display_name: 'Gemini Pro', ... }
];
```

### Après (Données du Store)
```typescript
// Signal connecté au store NgRx
availableModels = toSignal(
  this.store.select(ChatSelectors.selectAvailableLlmModels),
  { initialValue: [] }
);
```

## 🔄 Modifications détaillées

### 1. Imports ajoutés
```typescript
import { Store } from '@ngrx/store';
import { OnInit } from '@angular/core';
import * as ChatActions from '@app/store/chat';
import * as ChatSelectors from '@app/store/chat';
import { LlmModel } from '@app/models';
```

### 2. Injection du Store
```typescript
export class ChatLayoutComponent implements OnInit {
  private store = inject(Store);
  // ...
}
```

### 3. Signals connectés au Store
```typescript
// Modèles disponibles (filtrés par isAvailable: true)
availableModels = toSignal(
  this.store.select(ChatSelectors.selectAvailableLlmModels),
  { initialValue: [] }
);

// Modèle sélectionné dans le store
selectedModelFromStore = toSignal(
  this.store.select(ChatSelectors.selectSelectedModel),
  { initialValue: null }
);

// État de chargement
isLoadingModels = toSignal(
  this.store.select(ChatSelectors.selectIsLoading),
  { initialValue: false }
);
```

### 4. Chargement initial des modèles
```typescript
ngOnInit() {
  // Dispatch l'action pour charger les modèles
  // → Appel API intercepté par le mock
  // → Retourne les 4 modèles LLM
  this.store.dispatch(ChatActions.loadLlmModels());
}
```

### 5. Sélection de modèle mise à jour
```typescript
onModelSelect(modelId: string): void {
  // Dispatcher l'action vers le store global
  this.store.dispatch(ChatActions.selectModel({ modelId }));
  
  // Mettre à jour aussi le signal local
  const model = this.availableModels().find(m => m.id === modelId);
  if (model) this.selectedModel.set(model);
}
```

### 6. Options de select adaptées
```typescript
// Avant
get modelSelectOptions() {
  return this.availableModels.map(m => ({ 
    value: m.id, 
    label: m.display_name,  // ← AIModel
    icon: '' 
  }));
}

// Après
get modelSelectOptions() {
  return this.availableModels().map(m => ({ 
    value: m.id, 
    label: m.name,  // ← LlmModel
    icon: '' 
  }));
}
```

### 7. Interface AIModel supprimée
```typescript
// ❌ Supprimé
interface AIModel {
  id: string;
  display_name: string;
  description: string;
  has_reasoning: boolean;
  reasoning_level: ('low' | 'medium' | 'high')[];
}

// ✅ Utilise maintenant
interface LlmModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  maxTokens?: number;
  isAvailable: boolean;
}
```

## 🎯 Flow complet

```
1. Component ngOnInit()
   ↓
2. dispatch(loadLlmModels())
   ↓
3. ChatEffects intercepte
   ↓
4. ChatModeService.loadLlmModels()
   ↓
5. http.get('/api/llm-models')
   ↓
6. mockLlmModelsInterceptor répond avec 4 modèles
   ↓
7. dispatch(loadLlmModelsSuccess({ models }))
   ↓
8. ChatReducer met à jour le state
   ↓
9. availableModels() signal se met à jour automatiquement
   ↓
10. Template affiche les modèles
```

## 📊 Différences clés

| Aspect | Avant | Après |
|--------|-------|-------|
| Source des données | Tableau statique dans le composant | Store NgRx global |
| Type | `AIModel[]` | `LlmModel[]` (from store) |
| Chargement | Instantané | Asynchrone via API (mockée) |
| État partagé | Non | Oui (accessible partout) |
| Réactivité | Limitée au composant | Globale via selectors |
| Champ nom | `display_name` | `name` |

## 🎨 Dans le template

Les modèles sont maintenant accessibles via le signal :

```html
<!-- Accès aux modèles -->
@for (model of availableModels(); track model.id) {
  <div>{{ model.name }} - {{ model.provider }}</div>
}

<!-- Indicateur de chargement -->
@if (isLoadingModels()) {
  <div>Chargement des modèles...</div>
}

<!-- Modèle sélectionné depuis le store -->
@if (selectedModelFromStore(); as model) {
  <div>Modèle actif: {{ model.name }}</div>
}
```

## ✅ Avantages de cette migration

✅ **Données centralisées** - Les modèles sont dans le store, accessibles partout  
✅ **Réactivité automatique** - Les signals se mettent à jour automatiquement  
✅ **État partagé** - Plusieurs composants peuvent utiliser les mêmes modèles  
✅ **Persistance** - Le modèle sélectionné persiste entre les navigations  
✅ **Debugging** - Redux DevTools pour voir les changements d'état  
✅ **Testabilité** - Plus facile à mocker et tester  

## 🔄 Prochaines étapes

1. ✅ Utiliser `availableModels()` dans le template
2. ✅ Afficher un loader avec `isLoadingModels()`
3. ✅ Utiliser `selectedModelFromStore()` pour l'affichage
4. ⏳ Synchroniser `selectedModel` local avec le store
5. ⏳ Gérer les erreurs de chargement

## 🎓 Exemple d'utilisation complète

```typescript
export class ChatLayoutComponent implements OnInit {
  // Injection du store
  private store = inject(Store);
  
  // Signals connectés au store (lecture seule)
  availableModels = toSignal(
    this.store.select(ChatSelectors.selectAvailableLlmModels),
    { initialValue: [] }
  );
  
  ngOnInit() {
    // Charger les modèles au démarrage
    this.store.dispatch(ChatActions.loadLlmModels());
  }
  
  onModelSelect(modelId: string) {
    // Dispatcher l'action pour changer le modèle
    this.store.dispatch(ChatActions.selectModel({ modelId }));
  }
}
```

## 🚀 Le composant utilise maintenant le store NgRx !

Les données viennent maintenant du mock interceptor → store → signals → template 🎉
