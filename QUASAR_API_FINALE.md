# Liste Quasar-like - API Finale (Pure)

## 🎉 Mode Legacy Supprimé - 100% Quasar-like

Le composant `list-item` utilise maintenant **uniquement** la structure Quasar avec sections et labels.

---

## 📦 Composants Disponibles

### **`app-list`**
Container principal pour les items.

**Props:**
- `variant`: `'default' | 'navigation'`
- `dense`: `boolean` - Mode compact
- `bordered`: `boolean` - Bordure
- `separator`: `boolean` - Séparateurs entre items
- `padding`: `boolean` - Padding interne
- `hostClass`: `string` - Classes CSS additionnelles

---

### **`app-list-item`**
Item de liste individuel.

**Props:**
- `clickable`: `boolean` (default: `true`)
- `active`: `boolean` (default: `false`)
- `dense`: `boolean` (default: `false`)
- `variant`: `'default' | 'navigation' | 'navigation-mode'`
- `size`: `'default' | 'sm'`
- `hostClass`: `string`

**Output:**
- `activate`: Émis au clic

---

### **`app-list-item-section`**
Section d'un item (avatar, main, side).

**Props:**
- `avatar`: `boolean` - Section avatar (icône/image)
- `thumbnail`: `boolean` - Section thumbnail (image carrée)
- `side`: `boolean` - Section latérale (droite)
- `top`: `boolean` - Aligner en haut (multiline)
- `hostClass`: `string`

---

### **`app-list-item-label`**
Label avec styles prédéfinis.

**Props:**
- `header`: `boolean` - Style header (bold)
- `caption`: `boolean` - Style caption (petit, gris)
- `overline`: `boolean` - Style overline (uppercase)
- `lines`: `number` - Nombre de lignes avant troncature
- `hostClass`: `string`

---

## 🎯 Structure de Base

```html
<app-list>
  <app-list-item [clickable]="true" [active]="false">
    <!-- Section avatar (optionnelle) -->
    <app-list-item-section [avatar]="true">
      <i class="fas fa-icon"></i>
    </app-list-item-section>

    <!-- Section principale (prend tout l'espace) -->
    <app-list-item-section>
      <app-list-item-label>Titre</app-list-item-label>
      <app-list-item-label [caption]="true">Sous-titre</app-list-item-label>
    </app-list-item-section>

    <!-- Section side (optionnelle) -->
    <app-list-item-section [side]="true">
      <i class="fas fa-chevron-right"></i>
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

## 💡 Exemples Complets

### **1. Navigation Principale**

```html
<app-list variant="navigation">
  <app-list-item
    variant="navigation"
    [active]="currentRoute === '/home'"
    (activate)="navigateTo('/home')"
  >
    <app-list-item-section [avatar]="true">
      <i class="fas fa-home text-lg"></i>
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label>Accueil</app-list-item-label>
      <app-list-item-label [caption]="true">Retour à l'accueil</app-list-item-label>
    </app-list-item-section>

    @if (currentRoute === '/home') {
      <app-list-item-section [side]="true">
        <i class="fas fa-check text-sm"></i>
      </app-list-item-section>
    }
  </app-list-item>
</app-list>
```

---

### **2. Liste de Contacts**

```html
<app-list [bordered]="true" [separator]="true">
  @for (contact of contacts; track contact.id) {
    <app-list-item (activate)="selectContact(contact)">
      <app-list-item-section [avatar]="true">
        <img [src]="contact.avatar" class="w-10 h-10 rounded-full" />
      </app-list-item-section>

      <app-list-item-section>
        <app-list-item-label [header]="true">{{ contact.name }}</app-list-item-label>
        <app-list-item-label [caption]="true">{{ contact.email }}</app-list-item-label>
      </app-list-item-section>

      <app-list-item-section [side]="true">
        <app-list-item-label [caption]="true">{{ contact.time }}</app-list-item-label>
      </app-list-item-section>
    </app-list-item>
  }
</app-list>
```

---

### **3. Messages avec Badge**

```html
<app-list [bordered]="true" [padding]="true">
  <app-list-item>
    <app-list-item-section [avatar]="true" [top]="true">
      <i class="fas fa-envelope text-blue-600 text-2xl"></i>
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label [overline]="true">Nouveau message</app-list-item-label>
      <app-list-item-label [header]="true">Titre du message</app-list-item-label>
      <app-list-item-label [lines]="3">
        Contenu très long qui sera tronqué après 3 lignes avec les points de suspension automatiques...
      </app-list-item-label>
      <app-list-item-label [caption]="true">Il y a 5 minutes</app-list-item-label>
    </app-list-item-section>

    <app-list-item-section [side]="true" [top]="true">
      <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">5</span>
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

### **4. Settings Menu**

```html
<app-list [bordered]="true" [separator]="true">
  <app-list-item (activate)="openProfile()">
    <app-list-item-section [avatar]="true">
      <i class="fas fa-user text-gray-600"></i>
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label>Profil</app-list-item-label>
      <app-list-item-label [caption]="true">Gérer votre profil</app-list-item-label>
    </app-list-item-section>

    <app-list-item-section [side]="true">
      <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
    </app-list-item-section>
  </app-list-item>

  <app-list-item (activate)="openSettings()">
    <app-list-item-section [avatar]="true">
      <i class="fas fa-cog text-gray-600"></i>
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label>Paramètres</app-list-item-label>
    </app-list-item-section>

    <app-list-item-section [side]="true">
      <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

### **5. Liste Dense avec Thumbnail**

```html
<app-list [dense]="true" [bordered]="true">
  <app-list-item>
    <app-list-item-section [thumbnail]="true">
      <img src="thumbnail.jpg" class="w-16 h-16 rounded object-cover" />
    </app-list-item-section>

    <app-list-item-section>
      <app-list-item-label [overline]="true">Project</app-list-item-label>
      <app-list-item-label [header]="true">Mon Super Projet</app-list-item-label>
      <app-list-item-label [caption]="true">Modifié il y a 2 heures</app-list-item-label>
    </app-list-item-section>
  </app-list-item>
</app-list>
```

---

## 🎨 Styling Tips

### Avatar Circulaire
```html
<app-list-item-section [avatar]="true">
  <img src="..." class="w-10 h-10 rounded-full object-cover" />
</app-list-item-section>
```

### Icône Colorée
```html
<app-list-item-section [avatar]="true">
  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
    <i class="fas fa-envelope text-blue-600"></i>
  </div>
</app-list-item-section>
```

### Badge de Notification
```html
<app-list-item-section [side]="true">
  <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
    {{ count }}
  </span>
</app-list-item-section>
```

### Thumbnail avec Overlay
```html
<app-list-item-section [thumbnail]="true">
  <div class="relative">
    <img src="..." class="w-16 h-16 rounded object-cover" />
    <div class="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center">
      <i class="fas fa-play text-white"></i>
    </div>
  </div>
</app-list-item-section>
```

---

## 📊 Comparaison avec Quasar

| Quasar | Angular | Identique |
|--------|---------|-----------|
| `<q-list>` | `<app-list>` | ✅ |
| `<q-item>` | `<app-list-item>` | ✅ |
| `<q-item-section>` | `<app-list-item-section>` | ✅ |
| `<q-item-label>` | `<app-list-item-label>` | ✅ |
| `bordered` | `[bordered]="true"` | ✅ |
| `separator` | `[separator]="true"` | ✅ |
| `dense` | `[dense]="true"` | ✅ |
| `clickable` | `[clickable]="true"` | ✅ |
| `active` | `[active]="true"` | ✅ |
| `avatar` | `[avatar]="true"` | ✅ |
| `side` | `[side]="true"` | ✅ |
| `top` | `[top]="true"` | ✅ |

**Compatibilité : 100%** 🎉

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
```

---

## ✅ Avantages de l'API Pure

✅ **Structure simple** : Pas de mode legacy, une seule façon de faire
✅ **Flexibilité maximale** : Compose sections et labels librement
✅ **Sémantique claire** : avatar, main, side explicites
✅ **Type-safe** : Props typés avec TypeScript
✅ **Maintenance** : Code plus simple sans mode legacy
✅ **Performance** : Pas de computed pour détecter le mode
✅ **100% Quasar** : API identique à QList/QItem

---

## 🚀 Best Practices

1. **Avatar pour icônes/images** : Utilisez `[avatar]="true"`
2. **Section principale** : Sans props, prend tout l'espace
3. **Side pour actions** : Badges, chevrons, timestamps
4. **Top pour multiline** : `[top]="true"` aligne en haut
5. **Lines pour tronquer** : `[lines]="n"` limite les lignes
6. **Caption pour métadonnées** : Emails, dates, descriptions
7. **Header pour titres** : Style bold et prominent
8. **Overline pour catégories** : Uppercase et petit

---

Profitez de votre système de liste 100% Quasar-like ! 🎉
