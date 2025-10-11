# Documentation

Bienvenue dans la documentation du projet Template Widget.

## 📚 Composants Documentés

### 🔷 [Dialog Component](./dialog/)
Composant de boîte de dialogue modale complet, inspiré de Quasar Framework.

**Fonctionnalités :**
- Alert, Confirm, Prompt
- Positions et animations configurables
- Options (radio, checkbox, toggle)
- Service programmatique
- 100% Tailwind CSS
- Responsive & Accessible

**Documentation disponible :**
- [Index](./dialog/index.md) - Vue d'ensemble
- [Quick Start](./dialog/DIALOG-QUICKSTART.md) - Démarrage rapide
- [Documentation complète](./dialog/DIALOG-COMPONENT.md) - Guide détaillé
- [Migration Tailwind](./dialog/TAILWIND-MIGRATION.md) - Architecture CSS
- [README](./dialog/README.md) - Résumé

---

## 🚀 Démarrage Rapide

Pour commencer à utiliser un composant, consultez sa documentation dans le dossier correspondant.

### Exemple : Dialog Component

```typescript
import { DialogService } from '@app/components/dialog';

export class MyComponent {
  private dialogService = inject(DialogService);

  showAlert() {
    this.dialogService.alert('Bonjour !');
  }

  async confirmDelete() {
    const confirmed = await this.dialogService.confirm(
      'Êtes-vous sûr ?'
    );
    if (confirmed) {
      // Action de suppression
    }
  }
}
```

---

## 📁 Structure de la Documentation

```
docs/
├── index.md                    # Ce fichier
└── dialog/                     # Documentation du Dialog
    ├── index.md               # Vue d'ensemble
    ├── DIALOG-QUICKSTART.md   # Guide rapide
    ├── DIALOG-COMPONENT.md    # Documentation complète
    ├── TAILWIND-MIGRATION.md  # Architecture CSS
    └── README.md              # Résumé
```

---

## 🔗 Liens Utiles

- **Code source** : `src/app/components/`
- **Styles** : Tailwind CSS (voir `tailwind.config.cjs`)
- **Angular** : Version 19
- **TypeScript** : Standalone components avec signals

---

## 📝 Conventions

### Imports
```typescript
// Imports depuis @app/components
import { DialogComponent, DialogService } from '@app/components/dialog';
```

### Styling
- Utilisation exclusive de **Tailwind CSS**
- Classes utilitaires pour tous les styles
- Support du dark mode via `dark:` prefix
- Responsive avec breakpoints `sm:`, `md:`, `lg:`

### Architecture
```
components/
├── dialog/
│   ├── dialog.component.ts       # Composant principal
│   ├── dialog.component.html     # Template
│   ├── dialog.component.css      # Styles (minimal)
│   ├── dialog.service.ts         # Service programmatique
│   ├── dialog.models.ts          # Types TypeScript
│   ├── dialog-demo.component.ts  # Composant de démo
│   ├── index.ts                  # Barrel export
│   └── README.md                 # Documentation composant
```

---

## 🌟 Standards de Qualité

Tous les composants documentés suivent ces standards :

- ✅ **TypeScript** : Typage fort et exhaustif
- ✅ **Angular 19** : Standalone components avec signals
- ✅ **Tailwind CSS** : Styling moderne et maintenable
- ✅ **Accessibilité** : ARIA attributes et gestion du focus
- ✅ **Responsive** : Mobile-first design
- ✅ **Dark Mode** : Support natif
- ✅ **Documentation** : Complète et à jour
- ✅ **Exemples** : Code prêt à l'emploi

---

## 💡 Contribution

Pour ajouter de la documentation :

1. Créer un dossier dans `docs/` pour le composant
2. Ajouter les fichiers de documentation
3. Créer un `index.md` pour naviguer
4. Mettre à jour ce fichier (`docs/index.md`)

---

**Bonne lecture ! 📖**
