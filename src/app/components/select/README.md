# SelectComponent

Composant simple `SelectComponent` (standalone) — API flexible pour gérer tout type de liste.

## Inputs
- `options`: any[] — Liste d'éléments à afficher
- `valueField`: string = 'value' — Nom du champ à utiliser comme valeur
- `labelField`: string = 'label' — Nom du champ à utiliser comme label affiché
- `iconField`: string = 'icon' — Nom du champ à utiliser comme icône
- `imageField`: string = 'img_path' — Nom du champ à utiliser comme image
- `hostClass`, `buttonClass`, `menuClass`, `itemClass` — Classes CSS
- `returnObject`: boolean — si true renvoie l'objet complet, sinon la valeur
- `value`: unknown — Valeur sélectionnée
- `placeholder`: string = 'Select' — Texte affiché par défaut
- `openUpward`: boolean = false — Force l'ouverture vers le haut

## Outputs
- `selection`: EventEmitter<unknown> — Émis lors de la sélection

## Usage

### 1. Liste d'objets standard
```html
<app-select
  [options]="users"
  valueField="id"
  labelField="name"
  iconField="avatar"
  (selection)="onUserSelect($event)">
</app-select>
```

### 2. Liste de chaînes simples
```html
<app-select
  [options]="['Option 1', 'Option 2', 'Option 3']"
  (selection)="onSelect($event)">
</app-select>
```

### 3. Liste d'objets avec champs personnalisés
```html
<app-select
  [options]="countries"
  valueField="code"
  labelField="fullName"
  iconField="flag"
  (selection)="onCountrySelect($event)">
</app-select>
```

### 4. Liste avec champs imbriqués
```html
<app-select
  [options]="employees"
  valueField="id"
  labelField="profile.displayName"
  iconField="profile.avatar"
  (selection)="onEmployeeSelect($event)">
</app-select>
```

### 5. Configuration complète
```html
<app-select
  [options]="modelOptions"
  [value]="selectedModelId"
  [openUpward]="true"
  valueField="id"
  labelField="display_name"
  iconField="icon"
  placeholder="Choisir un modèle"
  buttonClass="bg-gray-50 hover:bg-gray-100"
  menuClass="min-w-[280px]"
  [returnObject]="false"
  (selection)="onModelSelect($event)">
</app-select>
```

## Exemples de données

### Objets avec format standard
```typescript
const options = [
  { value: 1, label: 'Option 1', icon: '📝' },
  { value: 2, label: 'Option 2', icon: '🎯' }
];
```

### Objets avec champs personnalisés
```typescript
const users = [
  { id: 1, name: 'John Doe', avatar: '👤' },
  { id: 2, name: 'Jane Smith', avatar: '👩' }
];
```

### Primitives
```typescript
const colors = ['Rouge', 'Vert', 'Bleu'];
const numbers = [1, 2, 3, 4, 5];
```

Le composant est automatiquement compatible avec tous ces formats !
