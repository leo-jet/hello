# Refactorisation des Composants List

## 🔄 Unification des Composants

### ❌ Composants Supprimés (Redondants)
- ~~`NavigationButtonComponent`~~
- ~~`NavigationModeButtonComponent`~~

### ✅ Composant Unifié : `ListItemComponent`

Le composant `list-item` a été étendu pour supporter tous les cas d'usage précédemment gérés par les composants séparés.

---

## 📦 ListItemComponent - API Complète

### **Variants disponibles**
```typescript
type ListItemVariant = 'default' | 'navigation' | 'navigation-mode';
```

- **`default`** : Liste classique avec `hover:bg-gray-100`
- **`navigation`** : Bouton de navigation principal
  - Actif : `bg-blue-600 text-white`
  - Inactif : `text-gray-700 hover:bg-gray-100`
- **`navigation-mode`** : Bouton de mode/sous-navigation
  - Actif : `bg-blue-100 text-blue-900`
  - Inactif : `text-gray-600 hover:bg-gray-50`

### **Sizes disponibles**
```typescript
type ListItemSize = 'default' | 'sm';
```

- **`default`** : Taille normale (icon `w-5`, spacing `mr-3`)
- **`sm`** : Taille compacte (icon `w-4`, spacing `mr-2`, `text-sm`)

---

## 🎯 Deux Modes d'Utilisation

### **Mode 1 : Props (Recommandé pour navigation)**
Utilisation avec des propriétés typées - idéal pour les boutons de navigation.

```html
<app-list-item
  variant="navigation"
  icon="fa-home"
  title="Accueil"
  subtitle="Retour à l'accueil"
  [active]="!currentChatMode()"
  [showCheck]="true"
  (activate)="onHomeClick()"
/>
```

**Props disponibles :**
- `icon` : Classe FontAwesome (ex: `'fa-home'`)
- `title` : Titre principal
- `subtitle` : Sous-titre optionnel
- `active` : État actif/sélectionné (boolean)
- `showCheck` : Afficher ✓ quand actif (boolean)
- `variant` : Style variant
- `size` : Taille du composant
- `clickable` : Permet le clic (default: `true`)

**Output :**
- `activate` : Événement émis au clic

---

### **Mode 2 : Slots (Legacy - ng-content)**
Utilisation avec projection de contenu - rétrocompatible avec l'ancien code.

```html
<app-list-item [clickable]="true" (activate)="onSelect()">
  <div start>
    <i class="fas fa-user"></i>
  </div>

  <div>
    <h4>Nom de l'utilisateur</h4>
    <p>email@example.com</p>
  </div>

  <div end>
    <span class="badge">3</span>
  </div>
</app-list-item>
```

**Slots disponibles :**
- `[start]` : Contenu avant (généralement icône)
- *default* : Contenu principal (sans attribut)
- `[end]` : Contenu après (badge, actions, etc.)

---

## 📦 ListComponent - API Mise à Jour

### **Variants disponibles**
```typescript
type ListVariant = 'default' | 'navigation';
```

- **`default`** : Liste classique avec fond blanc
- **`navigation`** : Liste de navigation sans fond (transparent)

### **Props**
- `variant` : Type de liste
- `dense` : Mode compact (boolean)
- `hostClass` : Classes CSS additionnelles

### **Exemple**
```html
<app-list variant="navigation">
  <app-list-item variant="navigation" icon="fa-home" title="Accueil" />
  <app-list-item variant="navigation" icon="fa-book" title="Docs" />
</app-list>
```

---

## 🎨 Exemples d'Utilisation

### **Navigation principale**
```html
<app-list variant="navigation">
  <app-list-item
    variant="navigation"
    icon="fa-home"
    title="Accueil"
    subtitle="Retour à l'accueil"
    [active]="isHome"
    [showCheck]="true"
    (activate)="navigateHome()"
  />
</app-list>
```

### **Sous-navigation / Modes**
```html
<app-list variant="navigation" hostClass="ml-6">
  <app-list-item
    variant="navigation-mode"
    size="sm"
    icon="fa-comments"
    title="Mode Chat"
    subtitle="Chat simple"
    [active]="currentMode === 'basic'"
    (activate)="selectMode('basic')"
  />
</app-list>
```

### **Liste classique avec slots**
```html
<app-list variant="default">
  <app-list-item (activate)="selectUser(user)">
    <div start>
      <img [src]="user.avatar" class="w-10 h-10 rounded-full" />
    </div>

    <div>
      <h4 class="font-medium">{{ user.name }}</h4>
      <p class="text-sm text-gray-500">{{ user.email }}</p>
    </div>

    <div end>
      <span class="badge">{{ user.unread }}</span>
    </div>
  </app-list-item>
</app-list>
```

---

## ✅ Avantages de la Refactorisation

✅ **Un seul composant** au lieu de 3 (NavigationButton, NavigationModeButton, ListItem)
✅ **Rétrocompatible** : Mode slots toujours supporté
✅ **Type-safe** : Variants et sizes typés
✅ **Flexible** : 2 modes d'utilisation selon le besoin
✅ **Maintenable** : Un seul fichier à modifier
✅ **Moderne** : Signals Angular 19 (`input()`, `output()`, `computed()`)
✅ **Performance** : `ChangeDetectionStrategy.OnPush`

---

## 🚀 Migration depuis les anciens composants

### Avant (NavigationButtonComponent)
```html
<app-navigation-button
  icon="fa-home"
  title="Accueil"
  subtitle="Retour à l'accueil"
  [active]="isActive"
  (clicked)="onClick()"
/>
```

### Après (ListItemComponent)
```html
<app-list-item
  variant="navigation"
  icon="fa-home"
  title="Accueil"
  subtitle="Retour à l'accueil"
  [active]="isActive"
  (activate)="onClick()"
/>
```

**Changements :**
- Ajouter `variant="navigation"` ou `variant="navigation-mode"`
- Remplacer `(clicked)` par `(activate)`

---

## 📁 Structure Finale

```
src/app/components/
├── list/
│   ├── list.component.ts          ✅ Modernisé (signals, variants)
│   ├── list.component.html
│   └── list.component.css
│
├── list-item/
│   ├── list-item.component.ts     ✅ Étendu (variants, props, slots)
│   ├── list-item.component.html   ✅ Dual mode
│   └── list-item.component.css
│
├── navigation-button/             ❌ À SUPPRIMER
└── navigation-mode-button/        ❌ À SUPPRIMER
```
