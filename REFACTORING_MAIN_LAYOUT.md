# Refactorisation du Main Layout

## Architecture des Composants

### Structure créée

```
main-layout/
├── index.ts                                    # Export central
├── main-layout.component.ts                    # Container principal
├── main-layout.component.html
├── main-layout.component.css
│
├── main-sidebar-navigation/                    # Navigation de la sidebar
│   ├── main-sidebar-navigation.component.ts    # Inputs: currentChatMode, chatModes, chatModesExpanded
│   ├── main-sidebar-navigation.component.html  # Outputs: homeClick, docsClick, chatModeClick, toggleChatModes
│   └── main-sidebar-navigation.component.css
│
├── main-conversation-item/                     # Item de conversation
│   ├── main-conversation-item.component.ts     # Inputs: conversation
│   ├── main-conversation-item.component.html   # Outputs: conversationClick, deleteClick
│   └── main-conversation-item.component.css
│
└── main-chat-input/                            # Zone d'input avec sélecteurs
    ├── main-chat-input.component.ts            # Inputs: currentChatModeInfo, modelSelectOptions, etc.
    ├── main-chat-input.component.html          # Outputs: modelSelect, reasoningLevelSelect, sendMessage, etc.
    └── main-chat-input.component.css
```

## Composants Réutilisés de src/app/components

✅ **SidebarComponent** - Container principal de la sidebar
✅ **HeaderComponent** - Header avec notification et toggle
✅ **FooterComponent** - Footer avec ng-content
✅ **OverlayComponent** - Overlay pour mobile
✅ **SelectComponent** - Sélecteur de modèle et niveau de raisonnement
✅ **InputFieldComponent** - Champ de saisie de message
✅ **IconButtonComponent** - Boutons d'action (attach, microphone, send)

## Flux de Données

### MainLayoutComponent (Container)
- **État** : `sidebarOpen`, `chatModesExpanded`, `selectedModel`, `selectedReasoningLevel`, `conversations`
- **Gère** : Navigation, CRUD conversations, sélection modèle, envoi messages

### MainSidebarNavigationComponent
- **Responsabilité** : Affichage navigation (Accueil, Docs, Modes de Chat)
- **Données entrantes** : currentChatMode, chatModes, chatModesExpanded
- **Données sortantes** : Events de navigation

### MainConversationItemComponent
- **Responsabilité** : Affichage d'une conversation avec avatar, titre, dernier message, badge
- **Données entrantes** : conversation (id, title, lastMessage, timestamp, unreadCount)
- **Données sortantes** : conversationClick, deleteClick
- **Logique** : Formatage timestamp (formatTimestamp)

### MainChatInputComponent
- **Responsabilité** : Zone d'input avec sélection modèle/reasoning + champ de saisie
- **Réutilise** : SelectComponent, InputFieldComponent, IconButtonComponent
- **Données entrantes** : currentChatModeInfo, modelSelectOptions, reasoningLevelSelectOptions, selectedModelId, etc.
- **Données sortantes** : modelSelect, reasoningLevelSelect, inputChange, sendMessage, etc.

## Simplifications Apportées

1. **Réduction du HTML** : Template principal passé de ~334 lignes à ~160 lignes
2. **Séparation des responsabilités** : Chaque composant a une responsabilité unique
3. **Réutilisation maximale** : 7 composants réutilisés de src/app/components
4. **Typage strict** : Interfaces exportées pour Conversation, ChatMode, ChatModeInfo, AIModel, SelectOption
5. **Injection de dépendances** : Pattern input()/output() pour signals modernes
6. **Style Tailwind pur** : Aucun CSS custom, uniquement classes Tailwind

## Avantages

✅ **Maintenabilité** : Code divisé en composants logiques
✅ **Réutilisabilité** : Composants génériques réutilisables ailleurs
✅ **Testabilité** : Chaque composant testable indépendamment
✅ **Performance** : ChangeDetectionStrategy.OnPush sur composants enfants
✅ **Lisibilité** : Template principal beaucoup plus court et clair
✅ **DRY** : Pas de duplication entre chat-layout et main-layout
