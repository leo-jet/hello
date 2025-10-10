# Composants Génériques de Navigation

## 📦 Composants Créés

### 1. **NavigationButtonComponent**
Composant générique pour les boutons de navigation principaux (Accueil, Documentation).

#### Inputs
- `icon` (required): Classe FontAwesome (ex: `'fa-home'`, `'fa-book'`)
- `title` (required): Titre principal du bouton
- `subtitle` (optional): Sous-titre descriptif
- `active` (default: false): État actif/sélectionné
- `showCheck` (default: false): Afficher l'icône ✓ quand actif

#### Output
- `clicked`: Événement émis au clic

#### Style
- **Actif**: `bg-blue-600 text-white`
- **Inactif**: `text-gray-700 hover:bg-gray-100`
- **Icône**: `w-5` (taille normale)

#### Exemple d'utilisation
```html
<app-navigation-button
  icon="fa-home"
  title="Accueil"
  subtitle="Retour à l'accueil"
  [active]="!currentChatMode()"
  [showCheck]="true"
  (clicked)="onHomeClick()"
/>
```

---

### 2. **NavigationModeButtonComponent**
Composant générique pour les boutons de modes de chat (variante plus petite).

#### Inputs
- `icon` (required): Classe FontAwesome (ex: `'fa-comments'`, `'fa-brain'`)
- `label` (required): Label principal
- `description` (optional): Description du mode
- `active` (default: false): État actif/sélectionné
- `showCheck` (default: true): Afficher l'icône ✓ quand actif

#### Output
- `clicked`: Événement émis au clic

#### Style
- **Actif**: `bg-blue-100 text-blue-900`
- **Inactif**: `text-gray-600 hover:bg-gray-50`
- **Icône**: `w-4` (taille réduite)
- **Texte**: `text-sm` (plus petit)

#### Exemple d'utilisation
```html
<app-navigation-mode-button
  [icon]="mode.icon"
  [label]="mode.label"
  [description]="mode.description"
  [active]="currentChatMode() === mode.id"
  [showCheck]="true"
  (clicked)="onChatModeClick(mode)"
/>
```

---

## ✅ Refactorisation Appliquée

### Avant (main-sidebar-navigation.component.html)
```html
<!-- 80+ lignes de HTML répétitif -->
<button (click)="onHomeClick()" [class]="...">
  <i class="fas fa-home w-5 mr-3"></i>
  <div class="flex-1 text-left">
    <div class="text-sm font-medium">Accueil</div>
    <div class="text-xs opacity-75">Retour à l'accueil</div>
  </div>
  @if (!currentChatMode()) {
    <i class="fas fa-check text-sm"></i>
  }
</button>

<!-- Répété pour Docs, puis pour chaque mode de chat -->
```

### Après (main-sidebar-navigation.component.html)
```html
<!-- 50 lignes, beaucoup plus lisible -->
<app-navigation-button
  icon="fa-home"
  title="Accueil"
  subtitle="Retour à l'accueil"
  [active]="!currentChatMode()"
  [showCheck]="true"
  (clicked)="onHomeClick()"
/>

<app-navigation-button
  icon="fa-book"
  title="Docs"
  subtitle="Documentation des composants"
  [active]="false"
  (clicked)="onDocsClick()"
/>

@for (mode of chatModes(); track mode.id) {
  <app-navigation-mode-button
    [icon]="mode.icon"
    [label]="mode.label"
    [description]="mode.description"
    [active]="currentChatMode() === mode.id"
    (clicked)="onChatModeClick(mode)"
  />
}
```

---

## 📊 Avantages

✅ **DRY (Don't Repeat Yourself)**: Code HTML partagé entre tous les boutons
✅ **Maintenabilité**: Changement de style centralisé dans un seul composant
✅ **Réutilisabilité**: Peut être utilisé dans d'autres layouts ou composants
✅ **Lisibilité**: Template beaucoup plus court et déclaratif
✅ **Testabilité**: Composants isolés faciles à tester
✅ **Typage fort**: Inputs typés avec `input.required<string>()`
✅ **Signals modernes**: Pattern Angular 19 avec signals

---

## 🎨 Design Pattern

Ces composants suivent le pattern **Presentational Component**:
- Aucune logique métier
- Uniquement affichage et émission d'événements
- Style 100% Tailwind CSS
- Props typées avec signals
- Getter pour classes dynamiques

---

## 📁 Structure des Fichiers

```
src/app/components/
├── navigation-button/
│   ├── navigation-button.component.ts
│   ├── navigation-button.component.html
│   ├── navigation-button.component.css
│   └── index.ts
│
└── navigation-mode-button/
    ├── navigation-mode-button.component.ts
    ├── navigation-mode-button.component.html
    ├── navigation-mode-button.component.css
    └── index.ts
```

---

## 🚀 Utilisation dans d'autres Composants

Ces composants peuvent être réutilisés partout où vous avez besoin de boutons de navigation:

```typescript
// Dans n'importe quel composant
import { NavigationButtonComponent } from '@/components/navigation-button';
import { NavigationModeButtonComponent } from '@/components/navigation-mode-button';

@Component({
  imports: [NavigationButtonComponent, NavigationModeButtonComponent]
})
```
