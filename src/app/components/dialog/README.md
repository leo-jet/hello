# Dialog Component

Une simple div modale personnalisable avec Tailwind CSS — utilisée directement dans vos templates.

## 🎯 Philosophie

Le Dialog est **ultra-simple** et **déclaratif** : juste un `<app-dialog>` dans votre template avec un binding `[(visible)]`. Vous contrôlez 100% du contenu via `ng-content`.

## ✨ Fonctionnalités

- ✅ **Approche Déclarative** - `<app-dialog [(visible)]="showDialog">`
- ✅ **Content Projection** - 3 slots (header, content, footer)
- ✅ **Header/Footer Fixes** - Ne scrollent pas
- ✅ **Contenu Scrollable** - Zone principale avec scroll automatique
- ✅ **Auto-fit écran** - Hauteur max 90vh, toujours visible entièrement
- ✅ **6 Animations** - scale, fade, slide-up/down/left/right
- ✅ **5 Positions** - standard, top, bottom, left, right
- ✅ **Mode Persistent** - Force une action utilisateur
- ✅ **Maximized/FullWidth** - Plein écran ou pleine largeur
- ✅ **Seamless** - Sans backdrop
- ✅ **100% Tailwind** - Aucun CSS personnalisé (sauf keyframes)
- ✅ **TypeScript** - Types complets
- ✅ **Standalone** - Component Angular 19

## 🚀 Installation

```typescript
// Dans votre composant
import { DialogComponent } from '@app/components/dialog';

@Component({
  standalone: true,
  imports: [DialogComponent],
  // ...
})
```

## 📖 Utilisation de base

### 1. Créer un signal pour la visibilité

```typescript
import { Component, signal } from '@angular/core';
import { DialogComponent } from '@app/components/dialog';

export class MyComponent {
  showDialog = signal(false);

  openDialog() {
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
  }
}
```

### 2. Ajouter le dialog dans votre template

```html
<!-- Bouton pour ouvrir -->
<button (click)="openDialog()">Ouvrir Dialog</button>

<!-- Dialog déclaratif -->
<app-dialog [(visible)]="showDialog" [cardClass]="'w-[600px] max-h-[80vh]'" [persistent]="true">
  <!-- Header fixe (optionnel) -->
  <div dialog-header class="px-6 py-4 border-b border-gray-200 bg-white">
    <h2 class="text-xl font-bold text-gray-900">Titre du Dialog</h2>
  </div>

  <!-- Contenu scrollable (principal) -->
  <div class="px-6 py-6">
    <p class="text-gray-700">Votre contenu ici...</p>
    <p class="text-gray-700 mt-4">Peut scroller si trop long</p>
  </div>

  <!-- Footer fixe (optionnel) -->
  <div dialog-footer class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
    <button
      (click)="closeDialog()"
      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
    >
      Annuler
    </button>
    <button
      (click)="closeDialog()"
      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
    >
      Confirmer
    </button>
  </div>
</app-dialog>
```

## 🎨 Les 3 slots ng-content

### 1️⃣ Header (optionnel) - `[dialog-header]`

```html
<div dialog-header class="px-6 py-4 border-b border-gray-200 bg-white">
  <h2 class="text-xl font-bold">Mon Titre</h2>
</div>
```

**Position** : Fixe en haut, ne scrolle jamais

### 2️⃣ Content (par défaut) - slot principal

```html
<div class="px-6 py-6">
  <p>Contenu principal...</p>
  <!-- Si trop long, un scroll apparaît automatiquement -->
</div>
```

**Position** : Zone scrollable entre header et footer

### 3️⃣ Footer (optionnel) - `[dialog-footer]`

```html
<div dialog-footer class="px-6 py-4 border-t border-gray-200 bg-gray-50">
  <button>Actions</button>
</div>
```

**Position** : Fixe en bas, ne scrolle jamais

## � Comportement de hauteur et scroll

Le dialog est **automatiquement contraint** pour toujours tenir dans l'écran :

- **Hauteur maximale** : `90vh` (90% de la hauteur de viewport) par défaut
- **Scroll automatique** : Si le contenu dépasse, seule la zone `content` devient scrollable
- **Header/Footer fixes** : Restent toujours visibles, ne scrollent jamais
- **Responsive** : S'adapte automatiquement à la taille de l'écran

### Exemple avec contenu très long

```html
<app-dialog [(visible)]="longDialog">
  <div dialog-header class="px-6 py-4 border-b bg-white">
    <h2 class="text-xl font-bold">Document</h2>
  </div>

  <div class="px-6 py-6 space-y-4">
    <!-- Même avec 1000 paragraphes, le dialog restera dans l'écran -->
    <p>Paragraphe 1...</p>
    <p>Paragraphe 2...</p>
    <!-- ... Le scroll apparaît automatiquement ... -->
    <p>Paragraphe 1000...</p>
  </div>

  <div dialog-footer class="px-6 py-4 border-t bg-gray-50">
    <button (click)="longDialog.set(false)">Fermer</button>
  </div>
</app-dialog>
```

### Personnaliser la hauteur maximale

```html
<!-- Utiliser moins de hauteur (70vh) -->
<app-dialog [(visible)]="dialog" [cardClass]="'w-[600px] max-h-[70vh]'">
  ...
</app-dialog>

<!-- Utiliser plus de hauteur (95vh) -->
<app-dialog [(visible)]="dialog" [cardClass]="'w-[600px] max-h-[95vh]'">
  ...
</app-dialog>
```

## �🔧 Configuration (Inputs)

### Two-way binding

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `[(visible)]` | `boolean` | `false` | Contrôle la visibilité du dialog |

### Inputs de configuration

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `[position]` | `DialogPosition` | `'standard'` | Position du dialog |
| `[transitionShow]` | `DialogTransition` | `'scale'` | Animation d'apparition |
| `[persistent]` | `boolean` | `false` | Empêche fermeture externe |
| `[seamless]` | `boolean` | `false` | Sans backdrop |
| `[maximized]` | `boolean` | `false` | Plein écran |
| `[fullWidth]` | `boolean` | `false` | Toute la largeur |
| `[fullHeight]` | `boolean` | `false` | Toute la hauteur |
| `[cardClass]` | `string` | `''` | Classes CSS personnalisées |
| `[cardStyle]` | `any` | `{}` | Styles inline personnalisés |
| `[backdropStyle]` | `any` | `{}` | Styles du backdrop |
| `[style]` | `any` | `{}` | Styles du conteneur |

### Outputs (Events)

| Output | Type | Description |
|--------|------|-------------|
| `(show)` | `void` | Émis quand le dialog s'affiche |
| `(hide)` | `void` | Émis quand le dialog se ferme |

## 📍 Positions disponibles

```typescript
type DialogPosition =
  | 'standard'  // Centré (défaut)
  | 'top'       // Haut
  | 'bottom'    // Bas
  | 'left'      // Gauche (sidebar)
  | 'right'     // Droite (sidebar)
```

### Exemples

```html
<!-- Centré -->
<app-dialog [(visible)]="dialog1" [position]="'standard'">
  ...
</app-dialog>

<!-- En haut -->
<app-dialog [(visible)]="dialog2" [position]="'top'">
  ...
</app-dialog>

<!-- Sidebar droite -->
<app-dialog [(visible)]="dialog3" [position]="'right'" [cardClass]="'w-[400px] h-full'">
  ...
</app-dialog>
```

## 🎬 Animations disponibles

```typescript
type DialogTransition =
  | 'scale'       // Zoom (défaut)
  | 'fade'        // Fondu
  | 'slide-up'    // Glisse du bas
  | 'slide-down'  // Glisse du haut
  | 'slide-left'  // Glisse de droite
  | 'slide-right' // Glisse de gauche
```

### Exemples

```html
<!-- Zoom -->
<app-dialog [(visible)]="dialog1" [transitionShow]="'scale'">
  ...
</app-dialog>

<!-- Slide depuis le bas -->
<app-dialog [(visible)]="dialog2" [transitionShow]="'slide-up'">
  ...
</app-dialog>
```

## 🎭 Cas d'usage

### Dialog simple

```html
<app-dialog [(visible)]="simpleDialog">
  <div class="p-6">
    <p>Un message simple</p>
  </div>
</app-dialog>
```

### Dialog avec header/footer

```html
<app-dialog [(visible)]="confirmDialog" [persistent]="true">
  <div dialog-header class="px-6 py-4 border-b">
    <h2 class="text-xl font-bold">Confirmer l'action</h2>
  </div>

  <div class="px-6 py-6">
    <p>Êtes-vous sûr de vouloir continuer ?</p>
  </div>

  <div dialog-footer class="px-6 py-4 border-t flex justify-end gap-2">
    <button (click)="confirmDialog.set(false)" class="px-4 py-2 bg-gray-200 rounded">
      Annuler
    </button>
    <button (click)="onConfirm()" class="px-4 py-2 bg-blue-600 text-white rounded">
      Confirmer
    </button>
  </div>
</app-dialog>
```

### Dialog avec contenu long (scrollable)

```html
<app-dialog [(visible)]="longDialog" [cardClass]="'w-[700px] max-h-[70vh]'">
  <div dialog-header class="px-6 py-4 border-b bg-white">
    <h2 class="text-xl font-bold">Conditions d'utilisation</h2>
  </div>

  <div class="px-6 py-6 space-y-4">
    <!-- Contenu très long qui scrollera automatiquement -->
    <p>Lorem ipsum dolor sit amet...</p>
    <p>Lorem ipsum dolor sit amet...</p>
    <!-- ... -->
  </div>

  <div dialog-footer class="px-6 py-4 border-t bg-gray-50">
    <button (click)="longDialog.set(false)" class="px-4 py-2 bg-blue-600 text-white rounded">
      J'ai compris
    </button>
  </div>
</app-dialog>
```

### Dialog de formulaire

```typescript
// Component
formDialog = signal(false);
formData = { name: '', email: '' };

submitForm() {
  console.log('Form data:', this.formData);
  this.formDialog.set(false);
}
```

```html
<app-dialog [(visible)]="formDialog" [persistent]="true" [cardClass]="'w-[600px]'">
  <div dialog-header class="px-6 py-4 border-b">
    <h2 class="text-xl font-bold">Nouveau contact</h2>
  </div>

  <div class="px-6 py-6 space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Nom</label>
      <input
        [(ngModel)]="formData.name"
        class="w-full px-3 py-2 border rounded"
        placeholder="Jean Dupont"
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input
        [(ngModel)]="formData.email"
        type="email"
        class="w-full px-3 py-2 border rounded"
        placeholder="jean@example.com"
      />
    </div>
  </div>

  <div dialog-footer class="px-6 py-4 border-t flex justify-end gap-2">
    <button (click)="formDialog.set(false)" class="px-4 py-2 bg-gray-200 rounded">
      Annuler
    </button>
    <button (click)="submitForm()" class="px-4 py-2 bg-blue-600 text-white rounded">
      Créer
    </button>
  </div>
</app-dialog>
```

### Dialog plein écran (Maximized)

```html
<app-dialog [(visible)]="maxDialog" [maximized]="true">
  <div dialog-header class="px-6 py-4 border-b">
    <h2 class="text-xl font-bold">Éditeur</h2>
  </div>

  <div class="px-6 py-6">
    <textarea class="w-full h-full border rounded p-4"></textarea>
  </div>

  <div dialog-footer class="px-6 py-4 border-t flex justify-end gap-2">
    <button (click)="maxDialog.set(false)" class="px-4 py-2 bg-blue-600 text-white rounded">
      Fermer
    </button>
  </div>
</app-dialog>
```

### Sidebar (position left/right)

```html
<app-dialog
  [(visible)]="sidebarDialog"
  [position]="'right'"
  [cardClass]="'w-[400px] h-full'"
  [transitionShow]="'slide-left'"
>
  <div dialog-header class="px-6 py-4 border-b">
    <h2 class="text-xl font-bold">Navigation</h2>
  </div>

  <div class="px-6 py-6">
    <ul class="space-y-2">
      <li><a href="#" class="block hover:bg-gray-100 p-2 rounded">Accueil</a></li>
      <li><a href="#" class="block hover:bg-gray-100 p-2 rounded">Produits</a></li>
      <li><a href="#" class="block hover:bg-gray-100 p-2 rounded">Contact</a></li>
    </ul>
  </div>
</app-dialog>
```

### Dialog persistent (force une action)

```html
<app-dialog [(visible)]="persistentDialog" [persistent]="true">
  <div class="p-6">
    <h3 class="text-lg font-bold mb-3">⚠️ Action requise</h3>
    <p class="text-gray-700 mb-4">
      Vous devez accepter les conditions pour continuer.
      Cliquer en dehors ne fermera pas ce dialog.
    </p>
    <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
      <p class="text-sm text-yellow-800">
        Escape et clic backdrop sont désactivés
      </p>
    </div>
    <button (click)="persistentDialog.set(false)" class="w-full px-4 py-2 bg-blue-600 text-white rounded">
      J'accepte
    </button>
  </div>
</app-dialog>
```

### Dialog sans backdrop (Seamless)

```html
<app-dialog [(visible)]="seamlessDialog" [seamless]="true" [cardClass]="'w-[400px]'">
  <div class="p-6 bg-white shadow-2xl rounded-lg">
    <h3 class="text-lg font-bold mb-2">Notification</h3>
    <p class="text-gray-700">Message sans backdrop (fond transparent)</p>
    <button (click)="seamlessDialog.set(false)" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
      OK
    </button>
  </div>
</app-dialog>
```

## 🎨 Personnalisation avec Tailwind

### Largeur personnalisée

```html
<app-dialog [(visible)]="dialog" [cardClass]="'w-[800px]'">
  ...
</app-dialog>
```

### Hauteur maximale

```html
<app-dialog [(visible)]="dialog" [cardClass]="'w-[600px] max-h-[90vh]'">
  ...
</app-dialog>
```

### Arrondis personnalisés

```html
<app-dialog [(visible)]="dialog" [cardClass]="'w-[600px] rounded-2xl'">
  ...
</app-dialog>
```

### Ombre personnalisée

```html
<app-dialog [(visible)]="dialog" [cardClass]="'w-[600px] shadow-2xl'">
  ...
</app-dialog>
```

## 🔐 Mode Persistent

Le mode `persistent` empêche la fermeture par :
- ❌ Clic sur le backdrop
- ❌ Touche Escape

L'utilisateur **DOIT** cliquer sur un bouton dans le dialog.

```html
<app-dialog [(visible)]="dialog" [persistent]="true">
  <div class="p-6">
    <p>Vous devez accepter pour continuer</p>
    <button (click)="dialog.set(false)">J'accepte</button>
  </div>
</app-dialog>
```

## ⌨️ Raccourcis clavier

- `Escape` : Ferme le dialog (sauf si `persistent: true`)

## 🎯 Bonnes pratiques

### ✅ À FAIRE

```html
<!-- Signal pour la visibilité -->
<app-dialog [(visible)]="myDialog">
  <div class="p-6">Contenu</div>
</app-dialog>

<!-- Utiliser les slots pour structure -->
<app-dialog [(visible)]="myDialog">
  <div dialog-header>Header</div>
  <div>Content</div>
  <div dialog-footer>Footer</div>
</app-dialog>

<!-- Classes Tailwind pour personnalisation -->
<app-dialog [(visible)]="myDialog" [cardClass]="'w-[700px] max-h-[80vh]'">
  ...
</app-dialog>

<!-- Persistent pour actions critiques -->
<app-dialog [(visible)]="deleteDialog" [persistent]="true">
  <div class="p-6">
    <p>Supprimer définitivement ?</p>
    <button (click)="onDelete(); deleteDialog.set(false)">Confirmer</button>
  </div>
</app-dialog>
```

### ❌ À ÉVITER

```html
<!-- Ne PAS gérer la visibilité manuellement avec *ngIf -->
@if (showDialog) {
  <app-dialog>...</app-dialog>
}

<!-- Utiliser [(visible)] à la place -->
<app-dialog [(visible)]="showDialog">...</app-dialog>
```

## 📦 Structure des fichiers

```
src/app/components/dialog/
├── dialog.component.ts      # Composant principal (169 lignes)
├── dialog.component.html    # Template (36 lignes)
├── dialog.component.css     # Styles Tailwind (keyframes uniquement)
├── dialog.models.ts         # Types TypeScript
├── index.ts                 # Exports
└── README.md                # Documentation
```

## 🚀 Types TypeScript

```typescript
// Position du dialog
export type DialogPosition =
  | 'standard'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

// Animation d'apparition
export type DialogTransition =
  | 'scale'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right';
```

## ✨ Résumé

- 🎯 **Déclaratif** : `<app-dialog [(visible)]>` directement dans le template
- 📦 **3 slots** : header (fixe), content (scrollable), footer (fixe)
- 🎨 **100% Tailwind** : Pas de CSS custom (sauf keyframes d'animation)
- ⚡ **Simple** : 169 lignes de TypeScript, 36 lignes de HTML
- 🔧 **Flexible** : Positions, animations, modes personnalisés
- ✅ **Type-safe** : Types TypeScript complets
- 🚀 **Angular 19** : Standalone component avec signals

---

**Besoin d'aide ?** Consultez les exemples live dans `docs/dialog/dialog-docs.component.html` 🎉
