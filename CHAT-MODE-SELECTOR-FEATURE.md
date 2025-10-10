# Fonctionnalité : Sélecteur de Mode de Chat

## 📝 Description

Ajout d'un sélecteur de mode de chat dans le composant `main-chat-input`, permettant à l'utilisateur de choisir entre différents modes de conversation :
- **Mode Chat** (basic) - Conversation standard
- **Mode Advanced Chat** (advanced) - Chat avancé avec plus de fonctionnalités
- **Mode RAG** (rag) - Retrieval-Augmented Generation

## ✅ Modifications Effectuées

### 1. Composant `MainChatInputComponent`

#### Fichier TypeScript (`main-chat-input.component.ts`)

**Nouveaux Inputs :**
```typescript
chatModeSelectOptions = input<SelectOption[]>([]);  // Options pour le sélecteur de mode
selectedChatMode = input<string | null>(null);      // Mode actuellement sélectionné
```

**Nouveau Output :**
```typescript
chatModeSelect = output<string>();  // Événement émis lors de la sélection d'un mode
```

**Nouvelle Méthode :**
```typescript
onChatModeSelect(event: any) {
  this.chatModeSelect.emit(event.value);
}
```

#### Fichier Template (`main-chat-input.component.html`)

**Nouveau Sélecteur :**
```html
<!-- Sélecteur de mode de chat -->
<app-select
  [options]="chatModeSelectOptions()"
  [defaultValue]="selectedChatMode()"
  [openUpward]="true"
  placeholder="Choisir un mode"
  (selection)="onChatModeSelect($event)"
  buttonClass="bg-purple-50 hover:bg-purple-100 border-purple-200 text-sm"
  menuClass="border-purple-200 min-w-[200px]"
/>
```

**Position :** Le sélecteur de mode est placé à gauche du sélecteur de modèle, avant le sélecteur de niveau de raisonnement.

### 2. Composant Parent `NewChatComponent`

#### Fichier TypeScript (`new-chat.component.ts`)

**Import du Service :**
```typescript
import { ChatModeService, ChatMode } from '../../services/chat-mode.service';
```

**Injection du Service :**
```typescript
private chatModeService = inject(ChatModeService);
```

**Nouveaux Signaux :**
```typescript
selectedChatMode = signal<ChatMode>(null);  // Mode sélectionné
```

**Données des Modes :**
```typescript
chatModes: Array<{ mode: ChatMode; info: ChatModeInfo }> = [
  { mode: 'basic', info: this.chatModeService.getModeInfo('basic') },
  { mode: 'advanced', info: this.chatModeService.getModeInfo('advanced') },
  { mode: 'rag', info: this.chatModeService.getModeInfo('rag') }
];
```

**Options Formatées :**
```typescript
get chatModeSelectOptions() {
  return this.chatModes.map(({ mode, info }) => ({
    value: mode as string,
    label: info.label,
    icon: info.icon
  }));
}
```

**Gestionnaire d'Événement :**
```typescript
onChatModeSelect(mode: string): void {
  const chatMode = mode as ChatMode;
  this.selectedChatMode.set(chatMode);
  this.chatModeService.setMode(chatMode);
  this.currentChatModeInfo.set(this.chatModeService.getCurrentModeInfo());
  console.log('Mode de chat sélectionné:', mode);
}
```

#### Fichier Template (`new-chat.component.html`)

**Binding des Propriétés :**
```html
<app-main-chat-input
  [currentChatModeInfo]="currentChatModeInfo()"
  [chatModeSelectOptions]="chatModeSelectOptions"
  [selectedChatMode]="selectedChatMode()"
  [modelSelectOptions]="modelSelectOptions"
  [reasoningLevelSelectOptions]="reasoningLevelSelectOptions"
  [selectedModelId]="selectedModel().id"
  [selectedReasoningLevel]="selectedReasoningLevel()"
  [hasReasoning]="selectedModel().has_reasoning"
  [isSendButtonDisabled]="isSendButtonDisabled"
  (chatModeSelect)="onChatModeSelect($event)"
  (modelSelect)="onModelSelect($event)"
  (reasoningLevelSelect)="onReasoningLevelSelect($event)"
  (inputChange)="onFooterInputChange($event)"
  (microphoneClick)="onMicrophoneClick()"
  (sendMessage)="onSendMessage()"
/>
```

## 🎨 Interface Utilisateur

### Layout des Sélecteurs

```
┌─────────────────────────────────────────────────────────┐
│              [Badge du mode sélectionné]                │
├─────────────────────────────────────────────────────────┤
│  [Mode] [Modèle] [Niveau de Raisonnement (optionnel)]  │
├─────────────────────────────────────────────────────────┤
│  [📎] [Input de texte...              ] [🎤] [✈️]      │
└─────────────────────────────────────────────────────────┘
```

### Styles du Sélecteur de Mode

- **Bouton :** Fond violet clair (`bg-purple-50`) avec bordure violet
- **Hover :** Fond violet plus foncé (`bg-purple-100`)
- **Menu :** Bordure violet, largeur minimale 200px
- **Ouverture :** Vers le haut (`openUpward="true"`)

## 🔄 Flux de Données

1. **Initialisation :**
   - `NewChatComponent` charge les modes depuis `ChatModeService`
   - Convertit les modes en options pour le sélecteur
   - Passe les options à `MainChatInputComponent`

2. **Sélection d'un Mode :**
   - Utilisateur clique sur le sélecteur de mode
   - Sélectionne un mode (basic, advanced, rag)
   - `MainChatInputComponent` émet l'événement `chatModeSelect`
   - `NewChatComponent` reçoit l'événement via `onChatModeSelect`
   - Met à jour le signal `selectedChatMode`
   - Met à jour le service `ChatModeService.setMode()`
   - Met à jour `currentChatModeInfo` pour afficher le badge

3. **Affichage du Badge :**
   - Si un mode est sélectionné, le badge s'affiche en haut
   - Badge contient : icône + label du mode
   - Couleur de l'icône selon le mode :
     - Basic : bleu (`text-blue-500`)
     - Advanced : vert (`text-green-500`)
     - RAG : violet (`text-purple-500`)

## 📋 Modes Disponibles

### Mode Chat (basic)
- **Label :** "Mode Chat"
- **Icône :** `fa-comments`
- **Couleur :** Bleu
- **Description :** Mode de conversation standard

### Mode Advanced Chat (advanced)
- **Label :** "Mode Advanced Chat"
- **Icône :** `fa-brain`
- **Couleur :** Vert
- **Description :** Chat avec fonctionnalités avancées

### Mode RAG (rag)
- **Label :** "Mode RAG"
- **Icône :** `fa-database`
- **Couleur :** Violet
- **Description :** Retrieval-Augmented Generation (recherche + génération)

## 🚀 Utilisation dans d'Autres Composants

Pour utiliser cette fonctionnalité dans d'autres composants :

### 1. Importer le Service

```typescript
import { ChatModeService, ChatMode } from '@app/services/chat-mode.service';
```

### 2. Injecter le Service

```typescript
private chatModeService = inject(ChatModeService);
```

### 3. Préparer les Données

```typescript
chatModes: Array<{ mode: ChatMode; info: ChatModeInfo }> = [
  { mode: 'basic', info: this.chatModeService.getModeInfo('basic') },
  { mode: 'advanced', info: this.chatModeService.getModeInfo('advanced') },
  { mode: 'rag', info: this.chatModeService.getModeInfo('rag') }
];

get chatModeSelectOptions() {
  return this.chatModes.map(({ mode, info }) => ({
    value: mode as string,
    label: info.label,
    icon: info.icon
  }));
}

selectedChatMode = signal<ChatMode>(null);
currentChatModeInfo = signal<ChatModeInfo | null>(null);
```

### 4. Gérer la Sélection

```typescript
onChatModeSelect(mode: string): void {
  const chatMode = mode as ChatMode;
  this.selectedChatMode.set(chatMode);
  this.chatModeService.setMode(chatMode);
  this.currentChatModeInfo.set(this.chatModeService.getCurrentModeInfo());
}
```

### 5. Utiliser dans le Template

```html
<app-main-chat-input
  [chatModeSelectOptions]="chatModeSelectOptions"
  [selectedChatMode]="selectedChatMode()"
  [currentChatModeInfo]="currentChatModeInfo()"
  (chatModeSelect)="onChatModeSelect($event)"
  <!-- autres propriétés -->
/>
```

## 🔍 Accès au Mode Actuel

### Depuis n'importe quel Composant

```typescript
// Obtenir le mode actuel
const currentMode = this.chatModeService.currentMode();

// Obtenir les infos du mode actuel
const currentModeInfo = this.chatModeService.getCurrentModeInfo();

// Vérifier si un mode est actif
if (currentMode !== null) {
  console.log('Mode actif:', currentModeInfo?.label);
}
```

### Observer les Changements de Mode

```typescript
// Dans ngOnInit ou constructor
effect(() => {
  const mode = this.chatModeService.currentMode();
  console.log('Mode changé:', mode);
  // Logique en réaction au changement de mode
});
```

## 🎯 Cas d'Usage

### 1. Adapter le Comportement selon le Mode

```typescript
onSendMessage(): void {
  const mode = this.chatModeService.currentMode();
  
  switch(mode) {
    case 'basic':
      // Envoyer un message simple
      this.sendBasicMessage();
      break;
    case 'advanced':
      // Utiliser des fonctionnalités avancées
      this.sendAdvancedMessage();
      break;
    case 'rag':
      // Effectuer une recherche RAG avant d'envoyer
      this.performRAGSearch().then(() => this.sendMessage());
      break;
    default:
      console.error('Aucun mode sélectionné');
  }
}
```

### 2. Afficher des Options Contextuelles

```typescript
// Template
@if (chatModeService.currentMode() === 'rag') {
  <div class="rag-options">
    <label>Source de données :</label>
    <select>
      <option>Documents internes</option>
      <option>Base de connaissances</option>
      <option>Web</option>
    </select>
  </div>
}
```

### 3. Personnaliser l'UI selon le Mode

```typescript
// TypeScript
get inputPlaceholder(): string {
  const mode = this.chatModeService.currentMode();
  switch(mode) {
    case 'basic':
      return 'Tapez votre message...';
    case 'advanced':
      return 'Posez une question complexe...';
    case 'rag':
      return 'Rechercher dans les documents...';
    default:
      return 'Choisissez un mode de chat';
  }
}

// Template
<input [placeholder]="inputPlaceholder" />
```

## 📊 Architecture des Données

### Flux de Sélection

```
┌─────────────────────────────────────────────────┐
│         MainChatInputComponent                   │
│  ┌──────────────────────────────────────┐       │
│  │ Sélecteur de Mode                    │       │
│  │ [Basic] [Advanced] [RAG]             │       │
│  └────────────────┬─────────────────────┘       │
│                   │ chatModeSelect.emit()       │
│                   v                             │
└───────────────────┼─────────────────────────────┘
                    │
                    v
┌───────────────────┼─────────────────────────────┐
│         NewChatComponent                         │
│                   │                              │
│  onChatModeSelect(mode) ◄─────┘                │
│         │                                        │
│         ├─► selectedChatMode.set(mode)          │
│         ├─► chatModeService.setMode(mode)       │
│         └─► currentChatModeInfo.set(...)        │
│                   │                              │
└───────────────────┼─────────────────────────────┘
                    │
                    v
┌───────────────────┼─────────────────────────────┐
│         ChatModeService                          │
│                   │                              │
│  _currentMode.set(mode) ◄─────┘                │
│         │                                        │
│         └─► Notifie tous les observateurs       │
│             via signal currentMode()             │
└──────────────────────────────────────────────────┘
```

### Structure des Données

```typescript
// Type du mode
type ChatMode = 'basic' | 'advanced' | 'rag' | null;

// Information complète d'un mode
interface ChatModeInfo {
  mode: ChatMode;
  label: string;   // "Mode Chat", "Mode Advanced Chat", etc.
  icon: string;    // "fa-comments", "fa-brain", etc.
  color: string;   // "text-blue-500", "text-green-500", etc.
}

// Option pour le composant select
interface SelectOption {
  value: string;   // 'basic', 'advanced', 'rag'
  label: string;   // "Mode Chat", etc.
  icon?: string;   // "fa-comments", etc.
}
```

## 🧪 Tests Suggérés

### Tests Unitaires

```typescript
describe('MainChatInputComponent', () => {
  it('should emit chatModeSelect when mode is selected', () => {
    const component = fixture.componentInstance;
    spyOn(component.chatModeSelect, 'emit');
    
    component.onChatModeSelect({ value: 'basic' });
    
    expect(component.chatModeSelect.emit).toHaveBeenCalledWith('basic');
  });
});

describe('NewChatComponent', () => {
  it('should update chatModeService when mode is selected', () => {
    const component = fixture.componentInstance;
    const chatModeService = TestBed.inject(ChatModeService);
    spyOn(chatModeService, 'setMode');
    
    component.onChatModeSelect('advanced');
    
    expect(chatModeService.setMode).toHaveBeenCalledWith('advanced');
  });
});
```

### Tests d'Intégration

1. Sélectionner chaque mode et vérifier :
   - Le badge s'affiche avec le bon label
   - L'icône et la couleur sont corrects
   - Le service est mis à jour

2. Vérifier la persistance du mode :
   - Sélectionner un mode
   - Naviguer vers une autre page
   - Revenir : le mode doit être conservé

3. Tester les interactions :
   - Changer de mode pendant la saisie
   - Envoyer un message avec différents modes
   - Vérifier que le comportement s'adapte

## 📚 Documentation Connexe

- **ChatModeService** : `src/app/services/chat-mode.service.ts`
- **SelectComponent** : `src/app/components/select/select.component.ts`
- **Architecture API** : `MSAL-INTEGRATION-GUIDE.md`
- **Guide SSE** : `SSE-GUIDE.md`

## 🔮 Évolutions Futures

### Suggestions d'Amélioration

1. **Modes Personnalisés**
   - Permettre aux utilisateurs de créer leurs propres modes
   - Sauvegarder les modes dans le local storage

2. **Mode par Défaut**
   - Configurer un mode par défaut dans les préférences
   - Mémoriser le dernier mode utilisé

3. **Raccourcis Clavier**
   - `Ctrl+1` : Mode Basic
   - `Ctrl+2` : Mode Advanced
   - `Ctrl+3` : Mode RAG

4. **Indicateurs Visuels**
   - Ajouter une description détaillée de chaque mode
   - Afficher des exemples de questions pour chaque mode

5. **Analytics**
   - Tracker l'utilisation de chaque mode
   - Optimiser l'UX selon les modes les plus utilisés

## ✅ Checklist de Validation

- [x] Sélecteur de mode ajouté au composant
- [x] Options de mode chargées depuis le service
- [x] Événement de sélection géré correctement
- [x] Badge du mode affiché quand sélectionné
- [x] Service ChatModeService mis à jour
- [x] Signal selectedChatMode réactif
- [x] Styles personnalisés pour le sélecteur
- [x] Documentation complète créée
- [ ] Tests unitaires écrits (TODO)
- [ ] Tests d'intégration effectués (TODO)

## 🎉 Résultat

L'utilisateur peut maintenant **sélectionner le mode de chat** directement depuis l'interface de saisie, avec :
- ✅ 3 modes disponibles (Basic, Advanced, RAG)
- ✅ Sélecteur élégant avec icônes
- ✅ Badge indiquant le mode actif
- ✅ Service centralisé pour gérer l'état
- ✅ Architecture extensible pour futurs modes
