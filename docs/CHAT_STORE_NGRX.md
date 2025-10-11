# Chat Store NgRx - Guide d'utilisation

## Architecture

Le store `chat` utilise NgRx pour gérer l'état des modèles LLM de manière centralisée et réactive.

### Structure des fichiers

```
src/app/store/chat/
├── chat.state.ts      - Interface et état initial
├── chat.actions.ts    - Actions NgRx
├── chat.reducer.ts    - Reducer NgRx
├── chat.selectors.ts  - Selectors NgRx
├── chat.effects.ts    - Effects NgRx (appels API)
└── index.ts          - Exports publics
```

## État (State)

```typescript
interface ChatState {
  llmModels: LlmModel[];
  selectedModelId: string | null;
  isLoading: boolean;
  error: string | null;
}
```

## Actions disponibles

```typescript
import * as ChatActions from '@app/store/chat';

// Charger les modèles
store.dispatch(ChatActions.loadLlmModels());

// Sélectionner un modèle
store.dispatch(ChatActions.selectModel({ modelId: 'gpt-4' }));

// Ajouter/Mettre à jour un modèle
store.dispatch(ChatActions.upsertModel({ model: myModel }));

// Supprimer un modèle
store.dispatch(ChatActions.removeModel({ modelId: 'gpt-4' }));

// Réinitialiser le store
store.dispatch(ChatActions.resetChat());

// Effacer l'erreur
store.dispatch(ChatActions.clearError());
```

## Selectors disponibles

```typescript
import { Store } from '@ngrx/store';
import * as ChatSelectors from '@app/store/chat';

export class MyComponent {
  // Tous les modèles
  llmModels$ = this.store.select(ChatSelectors.selectLlmModels);
  
  // Modèles disponibles uniquement
  availableModels$ = this.store.select(ChatSelectors.selectAvailableLlmModels);
  
  // Modèle sélectionné
  selectedModel$ = this.store.select(ChatSelectors.selectSelectedModel);
  
  // ID du modèle sélectionné
  selectedModelId$ = this.store.select(ChatSelectors.selectSelectedModelId);
  
  // État de chargement
  isLoading$ = this.store.select(ChatSelectors.selectIsLoading);
  
  // Erreur
  error$ = this.store.select(ChatSelectors.selectError);

  constructor(private store: Store) {}
}
```

## Exemple complet dans un composant

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LlmModel } from '@app/models';
import * as ChatActions from '@app/store/chat';
import * as ChatSelectors from '@app/store/chat';

@Component({
  selector: 'app-model-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <!-- Loading -->
      @if (isLoading$ | async) {
        <div class="text-center">
          <i class="fas fa-spinner fa-spin"></i>
          Chargement des modèles...
        </div>
      }

      <!-- Error -->
      @if (error$ | async; as error) {
        <div class="bg-red-50 border border-red-200 p-4 rounded mb-4">
          <p class="text-red-800">{{ error }}</p>
          <button 
            (click)="clearError()"
            class="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Fermer
          </button>
        </div>
      }

      <!-- Models list -->
      <div class="space-y-2">
        @for (model of availableModels$ | async; track model.id) {
          <div 
            class="p-3 border rounded cursor-pointer hover:bg-gray-50"
            [class.bg-blue-50]="model.id === (selectedModelId$ | async)"
            [class.border-blue-500]="model.id === (selectedModelId$ | async)"
            (click)="selectModel(model.id)"
          >
            <div class="font-semibold">{{ model.name }}</div>
            <div class="text-sm text-gray-600">{{ model.provider }}</div>
          </div>
        }
      </div>

      <!-- Selected model info -->
      @if (selectedModel$ | async; as model) {
        <div class="mt-4 bg-green-50 border border-green-200 p-4 rounded">
          <h4 class="font-semibold text-green-900">Modèle sélectionné</h4>
          <p class="text-green-800">{{ model.name }} - {{ model.provider }}</p>
        </div>
      }

      <!-- Actions -->
      <div class="mt-4 flex gap-2">
        <button 
          (click)="loadModels()"
          class="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Recharger
        </button>
        <button 
          (click)="reset()"
          class="px-4 py-2 bg-gray-200 rounded"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  `
})
export class ModelSelectorComponent implements OnInit {
  // Observables
  llmModels$: Observable<LlmModel[]>;
  availableModels$: Observable<LlmModel[]>;
  selectedModel$: Observable<LlmModel | null>;
  selectedModelId$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    // Initialiser les observables
    this.llmModels$ = this.store.select(ChatSelectors.selectLlmModels);
    this.availableModels$ = this.store.select(ChatSelectors.selectAvailableLlmModels);
    this.selectedModel$ = this.store.select(ChatSelectors.selectSelectedModel);
    this.selectedModelId$ = this.store.select(ChatSelectors.selectSelectedModelId);
    this.isLoading$ = this.store.select(ChatSelectors.selectIsLoading);
    this.error$ = this.store.select(ChatSelectors.selectError);
  }

  ngOnInit() {
    // Charger les modèles au démarrage
    this.loadModels();
  }

  loadModels() {
    this.store.dispatch(ChatActions.loadLlmModels());
  }

  selectModel(modelId: string) {
    this.store.dispatch(ChatActions.selectModel({ modelId }));
  }

  clearError() {
    this.store.dispatch(ChatActions.clearError());
  }

  reset() {
    this.store.dispatch(ChatActions.resetChat());
  }
}
```

## Utilisation avec des Signals (Angular 17+)

Si vous préférez utiliser des signals au lieu d'observables :

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import * as ChatActions from '@app/store/chat';
import * as ChatSelectors from '@app/store/chat';

@Component({...})
export class ModelSelectorComponent implements OnInit {
  // Convertir les observables en signals
  llmModels = toSignal(this.store.select(ChatSelectors.selectLlmModels), { initialValue: [] });
  availableModels = toSignal(this.store.select(ChatSelectors.selectAvailableLlmModels), { initialValue: [] });
  selectedModel = toSignal(this.store.select(ChatSelectors.selectSelectedModel), { initialValue: null });
  isLoading = toSignal(this.store.select(ChatSelectors.selectIsLoading), { initialValue: false });
  error = toSignal(this.store.select(ChatSelectors.selectError), { initialValue: null });

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(ChatActions.loadLlmModels());
  }

  selectModel(modelId: string) {
    this.store.dispatch(ChatActions.selectModel({ modelId }));
  }
}
```

Dans le template :

```html
<!-- Utilisation avec signals (pas de | async) -->
@for (model of availableModels(); track model.id) {
  <div (click)="selectModel(model.id)">
    {{ model.name }}
  </div>
}

@if (selectedModel(); as model) {
  <p>Modèle: {{ model.name }}</p>
}
```

## Configuration API

L'appel API est géré dans `ChatEffects` qui utilise `ChatModeService.loadLlmModels()`.

Pour modifier l'endpoint, éditez :
- `src/app/services/chat-mode.service.ts`
- Méthode `loadLlmModels()`

```typescript
async loadLlmModels(): Promise<LlmModel[]> {
  const models = await firstValueFrom(
    this.http.get<LlmModel[]>('https://votre-api.com/models')
  );
  return models;
}
```

## Debugging avec Redux DevTools

Le store est configuré avec Redux DevTools. Ouvrez Chrome/Firefox DevTools et allez dans l'onglet Redux pour :
- Voir l'état en temps réel
- Inspecter les actions dispatchées
- Time-travel debugging

## Tests

### Test du reducer

```typescript
import { chatReducer } from './chat.reducer';
import { initialChatState } from './chat.state';
import * as ChatActions from './chat.actions';

describe('Chat Reducer', () => {
  it('should load models successfully', () => {
    const models = [{ id: '1', name: 'GPT-4', ... }];
    const action = ChatActions.loadLlmModelsSuccess({ models });
    const state = chatReducer(initialChatState, action);
    
    expect(state.llmModels).toEqual(models);
    expect(state.isLoading).toBe(false);
  });
});
```

### Test des selectors

```typescript
import * as ChatSelectors from './chat.selectors';

describe('Chat Selectors', () => {
  it('should select available models', () => {
    const state = {
      chat: {
        llmModels: [
          { id: '1', isAvailable: true },
          { id: '2', isAvailable: false }
        ],
        ...
      }
    };
    
    const result = ChatSelectors.selectAvailableLlmModels.projector(state.chat.llmModels);
    expect(result).toHaveLength(1);
  });
});
```

## Avantages de NgRx

✅ **État prévisible** - Actions et reducers purs  
✅ **Time-travel debugging** - Redux DevTools  
✅ **Testabilité** - Facile à tester unitairement  
✅ **Scalabilité** - Structure claire pour grandes applications  
✅ **Side effects** - Gestion propre avec Effects  
✅ **Performance** - Memoization automatique avec selectors  

## Prochaines étapes

- [ ] Implémenter le vrai endpoint API
- [ ] Ajouter la persistance (localStorage)
- [ ] Implémenter le retry logic dans les effects
- [ ] Ajouter des actions de filtrage/tri
- [ ] Gérer les favoris utilisateur
