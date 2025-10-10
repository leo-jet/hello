# Liste et Items - Documentation Quasar-like

Composants de liste inspirés de [Quasar QList & QItem](https://quasar.dev/vue-components/list-and-list-items) pour Angular.

---

## 📦 Composants Disponibles

### 1. **`app-list`** (QList)
Container principal pour les items de liste.

### 2. **`app-list-item`** (QItem)
Item de liste individuel, clickable et stylisable.

### 3. **`app-list-item-section`** (QItemSection)
Section d'un item (avatar, thumbnail, side, main).

### 4. **`app-list-item-label`** (QItemLabel)
Label avec styles prédéfinis (header, caption, overline).

---

## 🎯 Structure Quasar-like

```html
<app-list>
  <app-list-item>
    <app-list-item-section avatar>
      <!-- Avatar ou icône -->
    </app-list-item-section>

    <app-list-item-section>
      <!-- Contenu principal -->
      <app-list-item-label>Titre</app-list-item-label>
      <app-list-item-label caption>Sous-titre</app-list-item-label>
    </app-list-item-section>

    <app-list-item-section side>
      <!-- Actions ou badges -->
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

## 📋 API Reference

### **app-list** Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'navigation'` | `'default'` | Style de la liste |
| `dense` | `boolean` | `false` | Mode compact (padding réduit) |
| `bordered` | `boolean` | `false` | Ajoute une bordure autour de la liste |
| `separator` | `boolean` | `false` | Ajoute des séparateurs entre les items |
| `padding` | `boolean` | `false` | Ajoute du padding interne |
| `hostClass` | `string` | `''` | Classes CSS additionnelles |

---

### **app-list-item** Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `clickable` | `boolean` | `true` | Active le hover et le cursor pointer |
| `active` | `boolean` | `false` | État actif/sélectionné |
| `dense` | `boolean` | `false` | Mode compact |
| `variant` | `'default' \| 'navigation' \| 'navigation-mode'` | `'default'` | Variant de style |
| `size` | `'default' \| 'sm'` | `'default'` | Taille du composant |
| `hostClass` | `string` | `''` | Classes CSS additionnelles |

**Output:**
- `activate` : Émis au clic

---

### **app-list-item-section** Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatar` | `boolean` | `false` | Section avatar (icône circulaire) |
| `thumbnail` | `boolean` | `false` | Section thumbnail (image carrée) |
| `side` | `boolean` | `false` | Section latérale (droite) |
| `top` | `boolean` | `false` | Aligne en haut au lieu du centre |
| `hostClass` | `string` | `''` | Classes CSS additionnelles |

**Note:** Sans prop, la section prend tout l'espace disponible (section principale).

---

### **app-list-item-label** Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `boolean` | `false` | Style header (bold, plus grand) |
| `caption` | `boolean` | `false` | Style caption (petit, gris) |
| `overline` | `boolean` | `false` | Style overline (uppercase, petit) |
| `lines` | `number` | `undefined` | Nombre de lignes avant troncature |
| `hostClass` | `string` | `''` | Classes CSS additionnelles |

---

## 💡 Exemples d'Utilisation

### **1. Liste de contacts (Basic)**

```html
<app-list [bordered]="true" [separator]="true">
  <app-list-item [clickable]="true" (activate)="selectContact(contact)">
    <app-list-item-section avatar>
      <img [src]="contact.avatar" class="w-10 h-10 rounded-full" />
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label header>{{ contact.name }}</app-list-item-label>
      <app-list-item-label caption>{{ contact.email }}</app-list-item-label>
    </app-list-item-section>

    <app-list-item-section side>
      <app-list-item-label caption>{{ contact.time }}</app-list-item-label>
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

### **2. Navigation avec icônes FontAwesome**

```html
<app-list variant="navigation">
  <app-list-item
    variant="navigation"
    [active]="currentRoute === '/home'"
    (activate)="navigateTo('/home')"
  >
    <app-list-item-section avatar>
      <i class="fas fa-home text-lg"></i>
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label>Accueil</app-list-item-label>
      <app-list-item-label caption>Retour à l'accueil</app-list-item-label>
    </app-list-item-section>

    @if (currentRoute === '/home') {
      <app-list-item-section side>
        <i class="fas fa-check text-sm"></i>
      </app-list-item-section>
    }
  </app-list-item>
</app-list>
```

---

### **3. Liste de messages (multiline)**

```html
<app-list [bordered]="true" [padding]="true">
  <app-list-item>
    <app-list-item-section avatar [top]="true">
      <img src="avatar.jpg" class="w-12 h-12 rounded-full" />
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label header>John Doe</app-list-item-label>
      <app-list-item-label [lines]="2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </app-list-item-label>
      <app-list-item-label caption>Il y a 2 heures</app-list-item-label>
    </app-list-item-section>

    <app-list-item-section side [top]="true">
      <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

### **4. Settings Menu**

```html
<app-list [bordered]="true" [separator]="true">
  <app-list-item (activate)="openProfile()">
    <app-list-item-section avatar>
      <i class="fas fa-user text-gray-600"></i>
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label>Profil</app-list-item-label>
      <app-list-item-label caption>Gérer votre profil</app-list-item-label>
    </app-list-item-section>

    <app-list-item-section side>
      <i class="fas fa-chevron-right text-gray-400"></i>
    </app-list-item-section>
  </app-list-item>

  <app-list-item (activate)="openSettings()">
    <app-list-item-section avatar>
      <i class="fas fa-cog text-gray-600"></i>
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label>Paramètres</app-list-item-label>
    </app-list-item-section>

    <app-list-item-section side>
      <i class="fas fa-chevron-right text-gray-400"></i>
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

### **5. Liste dense avec overlines**

```html
<app-list [dense]="true" [bordered]="true">
  <app-list-item>
    <app-list-item-section>
      <app-list-item-label overline>Project Name</app-list-item-label>
      <app-list-item-label header>My Awesome App</app-list-item-label>
      <app-list-item-label caption>Last updated: 2 hours ago</app-list-item-label>
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

## 🔄 Migration depuis l'ancienne API

### ❌ Avant (Props Mode - Deprecated)

```html
<app-list-item
  variant="navigation"
  icon="fa-home"
  title="Accueil"
  subtitle="Retour à l'accueil"
  [active]="true"
  [showCheck]="true"
/>
```

### ✅ Après (Quasar-like - Recommandé)

```html
<app-list-item variant="navigation" [active]="true">
  <app-list-item-section avatar>
    <i class="fas fa-home"></i>
  </app-list-item-section>

  <app-list-item-section>
    <app-list-item-label>Accueil</app-list-item-label>
    <app-list-item-label caption>Retour à l'accueil</app-list-item-label>
  </app-list-item-section>

  <app-list-item-section side>
    <i class="fas fa-check"></i>
  </app-list-item-section>
</app-list-item>
```

---

## ✅ Avantages de l'approche Quasar

✅ **Flexibilité maximale** : Structure avec sections et labels
✅ **Contrôle total** : Personnalisation complète du contenu
✅ **Multiline support** : Alignement top pour contenus multi-lignes
✅ **Semantic HTML** : Structure claire et accessible
✅ **Type-safe** : Props typés avec TypeScript
✅ **Performance** : ChangeDetectionStrategy.OnPush
✅ **Composition** : Combine sections, labels, et tout composant Angular

---

## 📦 Import

```typescript
import {
  ListComponent,
  ListItemComponent,
  ListItemSectionComponent,
  ListItemLabelComponent
} from '@app/components';

@Component({
  imports: [
    ListComponent,
    ListItemComponent,
    ListItemSectionComponent,
    ListItemLabelComponent,
  ],
  // ...
})
export class MyComponent {}
```

---

## 🎨 Styling Tips

### Avatar circulaire
```html
<app-list-item-section avatar>
  <img src="..." class="w-10 h-10 rounded-full" />
</app-list-item-section>
```

### Thumbnail carré
```html
<app-list-item-section thumbnail>
  <img src="..." class="w-12 h-12 rounded" />
</app-list-item-section>
```

### Badge de notification
```html
<app-list-item-section side>
  <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
    {{ unreadCount }}
  </span>
</app-list-item-section>
```

### Icône avec couleur
```html
<app-list-item-section avatar>
  <i class="fas fa-envelope text-blue-600 text-xl"></i>
</app-list-item-section>
```

---

## 🚀 Best Practices

1. **Utilisez `avatar` pour les icônes** : Section avatar pour icônes ou images circulaires
2. **Utilisez `side` pour les actions** : Badges, chevrons, timestamps à droite
3. **Utilisez `top` pour multiline** : Aligne sections en haut avec contenu long
4. **Utilisez `caption` pour métadonnées** : Emails, dates, descriptions
5. **Utilisez `lines` pour tronquer** : Limite le nombre de lignes affichées
6. **Utilisez `separator` pour clarté** : Sépare visuellement les groupes d'items

---

Profitez de la flexibilité Quasar dans Angular ! 🎉
