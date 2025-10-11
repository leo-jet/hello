# Chat Store - Gestion de l'état LLM Models

## Architecture

Le store `ChatStore` gère l'état global des modèles LLM dans l'application Angular.

### Structure de l'état (State)

```typescript
interface ChatState {
  llmModels: LlmModel[];        // Liste de tous les modèles
  selectedModelId: string | null; // ID du modèle sélectionné
  isLoading: boolean;             // État de chargement
  error: string | null;           // Message d'erreur
}
```

### Modèle LLM

```typescript
interface LlmModel {
  id: string;              // Identifiant unique
  name: string;            // Nom d'affichage
  provider: string;        // Fournisseur (OpenAI, Anthropic, etc.)
  description?: string;    // Description optionnelle
  maxTokens?: number;      // Nombre maximum de tokens
  isAvailable: boolean;    // Disponibilité du modèle
}
```

## Utilisation

### 1. Injection du Store

```typescript
import { Component, inject } from '@angular/core';
import { ChatStore } from './stores/chat.store';

export class MyComponent {
  chatStore = inject(ChatStore);
}
```

### 2. Accès aux données (Lecture seule via computed signals)

```typescript
// Liste complète des modèles
const allModels = this.chatStore.llmModels();

// Modèles disponibles uniquement
const availableModels = this.chatStore.availableModels();

// Modèle sélectionné
const selectedModel = this.chatStore.selectedModel();

// État de chargement
const isLoading = this.chatStore.isLoading();

// Erreur
const error = this.chatStore.error();
```

### 3. Actions

#### Charger les modèles depuis l'API

```typescript
async loadModels() {
  await this.chatStore.loadLlmModels();
}
```

#### Sélectionner un modèle

```typescript
selectModel(modelId: string) {
  this.chatStore.selectModel(modelId);
}
```

#### Ajouter ou mettre à jour un modèle

```typescript
const newModel: LlmModel = {
  id: 'gpt-4',
  name: 'GPT-4',
  provider: 'OpenAI',
  description: 'Modèle avancé',
  maxTokens: 8000,
  isAvailable: true
};

this.chatStore.upsertModel(newModel);
```

#### Supprimer un modèle

```typescript
this.chatStore.removeModel('gpt-4');
```

#### Réinitialiser le store

```typescript
this.chatStore.reset();
```

#### Effacer l'erreur

```typescript
this.chatStore.clearError();
```

## Exemple dans un template

```html
<!-- Indicateur de chargement -->
@if (chatStore.isLoading()) {
  <div>Chargement...</div>
}

<!-- Affichage des erreurs -->
@if (chatStore.error()) {
  <div class="error">{{ chatStore.error() }}</div>
}

<!-- Liste des modèles -->
@for (model of chatStore.availableModels(); track model.id) {
  <div 
    (click)="chatStore.selectModel(model.id)"
    [class.selected]="model.id === chatStore.selectedModelId()"
  >
    {{ model.name }} - {{ model.provider }}
  </div>
}

<!-- Modèle sélectionné -->
@if (chatStore.selectedModel(); as model) {
  <div>
    Modèle actif: {{ model.name }}
  </div>
}
```

## Intégration avec ChatModeService

Le service `ChatModeService` contient maintenant une méthode `loadLlmModels()` qui fait l'appel API.

### Utilisation combinée

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ChatStore } from './stores/chat.store';
import { ChatModeService } from './services/chat-mode.service';

@Component({...})
export class MyComponent implements OnInit {
  chatStore = inject(ChatStore);
  chatModeService = inject(ChatModeService);

  async ngOnInit() {
    // Option 1: Utiliser directement le store (recommandé)
    await this.chatStore.loadLlmModels();

    // Option 2: Utiliser le service puis mettre à jour le store
    const models = await this.chatModeService.loadLlmModels();
    models.forEach(model => this.chatStore.upsertModel(model));
  }
}
```

## Configuration de l'API

Par défaut, le store appelle l'endpoint `/api/llm-models`. Pour le personnaliser:

1. **Modifier l'URL dans le store:**
   ```typescript
   // Dans chat.store.ts
   const models = await firstValueFrom(
     this.http.get<LlmModel[]>('https://votre-api.com/models')
   );
   ```

2. **Ou utiliser un service intermédiaire:**
   ```typescript
   // Dans un service API
   @Injectable({ providedIn: 'root' })
   export class ApiService {
     constructor(private http: HttpClient) {}
     
     getLlmModels() {
       return this.http.get<LlmModel[]>(environment.apiUrl + '/models');
     }
   }
   ```

## Avantages de cette architecture

✅ **État centralisé** - Une seule source de vérité pour les modèles LLM  
✅ **Réactivité** - Utilise les signals Angular pour les mises à jour automatiques  
✅ **Type-safe** - TypeScript assure la sécurité des types  
✅ **Immuabilité** - Le state n'est modifiable que via les actions du store  
✅ **Testabilité** - Facile à tester avec des mocks  
✅ **Gestion d'erreurs** - Erreurs capturées et exposées via le state  

## Prochaines étapes

- [ ] Implémenter le vrai endpoint API
- [ ] Ajouter la persistance (localStorage, sessionStorage)
- [ ] Implémenter le retry logic pour les appels API
- [ ] Ajouter des filtres/tri pour les modèles
- [ ] Gérer les favoris utilisateur
