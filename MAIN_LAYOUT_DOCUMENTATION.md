# Layout Principal avec Sidebar

## Vue d'ensemble
Le layout principal a été redessiné pour inclure une sidebar, un header fixe et un footer fixe, offrant une expérience utilisateur moderne et intuitive.

## 🏗️ Structure du Layout

### Header Fixe
- **Position** : Fixe en haut de la page
- **Hauteur** : 64px
- **Contenu** :
  - Logo/Titre de l'application
  - Bouton toggle pour la sidebar (mobile uniquement)
  - Zone pour contenu personnalisé via `<ng-content select="[header]">`
  - Actions utilisateur

### Sidebar
- **Position** : Fixe à gauche entre le header et le footer
- **Largeur** : 280px
- **Comportement** :
  - Toujours visible sur desktop (≥768px)
  - Masquée par défaut sur mobile, avec toggle
  - Animation fluide d'ouverture/fermeture

#### Navigation
- **Accueil** (`/`) - Icône maison
- **Profil** (`/profile`) - Icône utilisateur
- **NgRx Demo** (`/ngrx-example`) - Icône laboratoire
- **Paramètres** - Icône engrenage

#### Sections
- **Navigation** : Liens principaux de l'application
- **Outils** : Fonctionnalités supplémentaires

### Contenu Principal
- **Position** : À droite de la sidebar
- **Comportement** : Responsive avec la sidebar
- **Padding** : Espacement adaptatif selon la taille d'écran

### Footer Fixe
- **Position** : Fixe en bas de la page
- **Hauteur** : 60px
- **Contenu** :
  - Zone pour contenu personnalisé via `<ng-content select="[footer]">`
  - Copyright par défaut si aucun contenu personnalisé

## 🎨 Fonctionnalités

### Responsive Design
- **Desktop (≥768px)** : Sidebar toujours visible
- **Mobile (<768px)** : Sidebar avec toggle + overlay

### États Visuels
- **Lien actif** : Surbrillance bleue avec bordure droite
- **Hover** : Effet de survol subtil
- **Icônes** : Animation légère au survol et état actif

### Interactions
```typescript
// Méthodes disponibles dans le composant
toggleSidebar()  // Basculer l'état de la sidebar
openSidebar()    // Ouvrir la sidebar
closeSidebar()   // Fermer la sidebar
```

## 📱 Utilisation

### Template de Base
```html
<app-main-layout>
  <!-- Contenu principal -->
  <div>Votre contenu ici</div>

  <!-- Contenu header personnalisé -->
  <div header>
    <button>Action personnalisée</button>
  </div>

  <!-- Contenu footer personnalisé -->
  <div footer>
    Mon footer personnalisé
  </div>
</app-main-layout>
```

### Propriétés du Composant
```typescript
export class MainLayoutComponent {
  title: string;              // Titre affiché dans le header
  sidebarOpen: Signal<boolean>; // État de la sidebar
  currentYear: number;         // Année actuelle pour le copyright
  hasFooterContent: Signal<boolean>; // Détection de contenu footer
}
```

## 🎯 Classes CSS Importantes

### Layout Principal
- `.layout-container` : Container principal
- `.header-fixed` : Header fixe
- `.sidebar` : Sidebar avec animations
- `.main-content` : Zone de contenu principal
- `.footer-fixed` : Footer fixe

### États
- `.sidebar-open` : Sidebar ouverte (mobile)
- `.overlay-active` : Overlay actif (mobile)
- `.active` : Lien de navigation actif

### Responsive
- Breakpoint principal : `768px`
- Mobile-first design
- Animations fluides sur tous les devices

## 🔧 Personnalisation

### Couleurs
- **Background** : `#f9fafb` (contenu principal)
- **Sidebar** : `white` avec bordure `#e5e7eb`
- **Actif** : `#2563eb` (bleu)
- **Hover** : `#f3f4f6` (gris clair)

### Dimensions
- **Header** : `64px` de hauteur
- **Footer** : `60px` de hauteur
- **Sidebar** : `280px` de largeur
- **Transition** : `0.3s ease-in-out`

### Z-Index
- **Header** : `1000`
- **Footer** : `1000`
- **Sidebar** : `900`
- **Overlay** : `800`

## ✨ Nouvelles Fonctionnalités

1. **Navigation Intuitive** : Sidebar avec icônes explicites
2. **Responsive Mobile** : Interface adaptée aux petits écrans
3. **États Visuels** : Indication claire de la page active
4. **Contenu Personnalisable** : Zones header et footer flexibles
5. **Animation Fluide** : Transitions smooth pour une UX premium

Le layout est maintenant prêt pour une utilisation en production avec une interface moderne et accessible !
