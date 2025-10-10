# Documentation Template Widget

Bienvenue dans la documentation complète du Template Widget Angular. Cette documentation couvre tous les composants, services et utilitaires disponibles avec des exemples d'utilisation pratiques.

## 📚 Navigation rapide

### Composants UI

- **[DropdownComponent](/docs/dropdown)** - 🎯 **NOUVEAU** Documentation style Quasar avec démonstrations interactives
  - [📖 Documentation complète](/docs/dropdown) - Interface moderne sans code
  - [📝 Guide markdown](./components/dropdown.md) - Documentation détaillée
- [ButtonComponent](./components/button.md) *(à venir)*
- [ModalComponent](./components/modal.md) *(à venir)*
- [TooltipComponent](./components/tooltip.md) *(à venir)*

### Services

- [ChatModeService](./services/chat-mode-service.md) *(à venir)*
- [ThemeService](./services/theme-service.md) *(à venir)*

### Layouts

- [MainLayoutComponent](./layouts/main-layout.md) *(à venir)*
- [HeaderComponent](./layouts/header.md) *(à venir)*
- [SidebarComponent](./layouts/sidebar.md) *(à venir)*

### Pages

- [HomeComponent](./pages/home.md) *(à venir)*
- [ChatComponents](./pages/chat.md) *(à venir)*

## 🚀 Démarrage rapide

### Installation et configuration

```bash
# Cloner le projet
git clone [repository-url]
cd template-widget

# Installer les dépendances
npm install

# Lancer en développement
npm start
```

### Utilisation d'un composant

```typescript
import { DropdownComponent } from './src/app/components/dropdown/dropdown.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DropdownComponent],
  template: `
    <app-dropdown
      [options]="options"
      (selection)="onSelection($event)">
    </app-dropdown>
  `
})
export class ExampleComponent {
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];

  onSelection(value: unknown) {
    console.log('Sélection:', value);
  }
}
```

## 🎨 Architecture

Le template est construit avec :

- **Angular 19** - Framework principal avec standalone components
- **Tailwind CSS** - Framework CSS utilitaire
- **Signals** - Gestion d'état réactive moderne
- **Font Awesome** - Bibliothèque d'icônes
- **TypeScript** - Type safety et developer experience

### Structure du projet

```
src/
├── app/
│   ├── components/          # Composants réutilisables
│   │   ├── dropdown/        # Composant dropdown
│   │   └── ...
│   ├── pages/               # Pages de l'application
│   │   ├── home/
│   │   ├── chat/
│   │   └── ...
│   ├── services/            # Services partagés
│   ├── layouts/             # Composants de mise en page
│   └── shared/              # Utilitaires et types
docs/
├── components/              # Documentation des composants
├── services/                # Documentation des services
└── guides/                  # Guides d'utilisation
```

## 📖 Guides

### [Guide de style](./guides/style-guide.md) *(à venir)*
Conventions de codage et bonnes pratiques pour contribuer au projet.

### [Guide d'accessibilité](./guides/accessibility.md) *(à venir)*
Recommandations pour créer des interfaces accessibles.

### [Guide de performance](./guides/performance.md) *(à venir)*
Optimisations et bonnes pratiques de performance.

### [Guide de déploiement](./guides/deployment.md) *(à venir)*
Instructions pour déployer l'application.

## 🔧 Développement

### Scripts disponibles

```bash
# Développement
npm start                    # Lance le serveur de développement
npm run build               # Build de production
npm run test                # Lance les tests unitaires
npm run test:e2e            # Lance les tests end-to-end
npm run lint                # Vérifie le code avec ESLint
npm run format              # Formate le code avec Prettier
```

### Conventions

- **Composants** : Utilisez PascalCase (`DropdownComponent`)
- **Fichiers** : Utilisez kebab-case (`dropdown.component.ts`)
- **Variables** : Utilisez camelCase (`selectedValue`)
- **Constants** : Utilisez UPPER_SNAKE_CASE (`DEFAULT_OPTIONS`)

## 🤝 Contribution

Pour contribuer au projet :

1. Forkez le repository
2. Créez une branche pour votre feature (`git checkout -b feature/ma-feature`)
3. Committez vos changements (`git commit -m 'Ajout de ma feature'`)
4. Pushez vers la branche (`git push origin feature/ma-feature`)
5. Ouvrez une Pull Request

### Checklist avant contribution

- [ ] Code testé et fonctionnel
- [ ] Documentation mise à jour
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Code formaté et linté
- [ ] Accessibilité vérifiée

## 📝 Changelog

### Version 1.0.0 *(en cours)*

#### Ajouté
- DropdownComponent avec support d'icônes et images
- ChatModeService pour la gestion des modes de chat
- MainLayoutComponent avec sidebar responsive
- Documentation complète avec exemples

#### Modifié
- Migration vers Angular 19 avec signals
- Amélioration de l'accessibilité globale

#### Corrigé
- Problèmes de positionnement du dropdown
- Gestion des débordements d'écran

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](../LICENSE) pour plus de détails.

## 🆘 Support

-- **Issues** : Ouvrez une issue sur le dépôt GitHub
-- **Discussions** : Utilisez la section Discussions du dépôt GitHub
- **Email** : support@template-widget.com

---

*Dernière mise à jour : {{ date }}{date}*
