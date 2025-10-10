# Guide de Documentation des Composants

Ce guide explique comment documenter efficacement les composants du Template Widget pour maintenir une documentation cohérente et utile.

## 📋 Template de documentation

Utilisez cette structure pour documenter un nouveau composant :

### Structure de fichier

```
docs/
├── components/
│   └── nom-composant.md           # Documentation principale
```

### Template Markdown

```markdown
# NomComponent

Brève description du composant et de son usage.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [API](#api)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Styles et personnalisation](#styles-et-personnalisation)
- [Accessibilité](#accessibilité)
- [Notes techniques](#notes-techniques)

## Vue d'ensemble

Description détaillée avec :
- Fonctionnalités principales
- Cas d'usage typiques
- Avantages et limitations

## API

### Inputs
| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|

### Outputs
| Événement | Type | Description |
|-----------|------|-------------|

### Types
```typescript
interface MonInterface {
  // Définitions de types
}
```

## Exemples d'utilisation

### 1. Usage basique
### 2. Usage avancé
### 3. Cas spéciaux

## Styles et personnalisation

### Classes CSS par défaut
### Variables CSS
### Exemples de personnalisation

## Accessibilité

### Support clavier
### Attributs ARIA
### Bonnes pratiques

## Notes techniques

### Performance
### Compatibilité
### Limitations connues
```

## 🎯 Bonnes pratiques

### Documentation du code

1. **JSDoc complet** pour chaque propriété publique
```typescript
/**
 * Options à afficher dans le dropdown
 * @example
 * ```typescript
 * options = [
 *   { value: 'fr', label: 'Français', icon: '🇫🇷' }
 * ]
 * ```
 */
@Input() options: DropdownOption[] = [];
```

2. **Commentaires explicatifs** pour la logique complexe
```typescript
// Détection de collision pour éviter les débordements d'écran
if (left + estimatedWidth > window.innerWidth - 8) {
  left = Math.max(8, window.innerWidth - estimatedWidth - 8);
}
```

### Exemples pratiques

1. **Exemples progressifs** : du plus simple au plus complexe
2. **Code complet** : montrer les imports et la configuration
3. **Cas d'usage réels** : exemples basés sur des besoins concrets

### Capture d'écrans et démos

1. **GIFs animés** pour les interactions
2. **Screenshots** pour les états visuels
3. **CodePen/StackBlitz** pour les démos interactives

## 🧪 Exemples de composant

### Structure TypeScript

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonComponent } from '../../src/app/components/mon-component/mon-component.component';

@Component({
  selector: 'app-mon-component-docs',
  standalone: true,
  imports: [CommonModule, MonComponent],
  templateUrl: './mon-component-docs.component.html'
})
export class MonComponentDocsComponent {
  // Exemples de données
  basicExample = {};
  advancedExample = {};
  
  // Méthodes de gestion
  onBasicEvent(event: any) {
    console.log('Événement basique:', event);
  }
  
  onAdvancedEvent(event: any) {
    console.log('Événement avancé:', event);
  }
}
```

### Structure HTML

```html
<div class="container mx-auto p-6 max-w-4xl">
  <header class="mb-8">
    <h1 class="text-3xl font-bold">MonComponent - Exemples</h1>
    <p class="text-gray-600">Description des exemples.</p>
  </header>

  <!-- Navigation rapide -->
  <nav class="mb-8 p-4 bg-gray-50 rounded-lg">
    <h2 class="text-lg font-semibold mb-3">Navigation rapide</h2>
    <!-- Links vers les sections -->
  </nav>

  <!-- Exemple 1 -->
  <section id="basic" class="mb-12">
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">1. Exemple basique</h2>
      <p class="text-gray-600 mb-4">Description.</p>
      
      <div class="demo-container mb-6 p-4 bg-gray-50 rounded">
        <app-mon-component
          [propriete]="basicExample"
          (event)="onBasicEvent($event)">
        </app-mon-component>
      </div>

      <!-- Code examples are intentionally not exposed in the public docs; keep demonstrations focused on behavior -->
    </div>
  </section>
</div>
```

## 🎨 Styles cohérents

### Variables CSS standard

```css
:root {
  --doc-primary: #3b82f6;
  --doc-secondary: #6b7280;
  --doc-success: #10b981;
  --doc-warning: #f59e0b;
  --doc-error: #ef4444;
  --doc-bg-code: #f3f4f6;
  --doc-border: #e5e7eb;
}
```

### Classes utilitaires

```css
.demo-container {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.result-container {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 📊 Métriques de qualité

### Checklist documentation

- [ ] **Complétude** : Toutes les propriétés et méthodes publiques documentées
- [ ] **Exemples** : Au moins 3 exemples d'usage différents
- [ ] **Accessibilité** : Section dédiée avec recommandations
- [ ] **Performance** : Notes sur les optimisations possibles
- [ ] **Code fonctionnel** : Tous les exemples testés et fonctionnels
- [ ] **Responsive** : Adaptabilité mobile mentionnée
- [ ] **TypeScript** : Types et interfaces documentés
- [ ] **Tests** : Méthodes de test suggérées

### Indicateurs de succès

1. **Temps de compréhension** < 5 minutes pour usage basique
2. **Temps d'implémentation** < 15 minutes pour intégration
3. **Questions support** réduites de 80%
4. **Adoption** par l'équipe > 90%

## 🔄 Processus de mise à jour

### Quand mettre à jour

- Nouvelle fonctionnalité ajoutée
- API modifiée (breaking change)
- Bug fix impactant l'usage
- Amélioration de performance
- Changement de dépendance

### Comment mettre à jour

1. Identifier les sections impactées
2. Mettre à jour les exemples si nécessaire
3. Vérifier que tous les liens fonctionnent
4. Tester les exemples de code
5. Valider l'accessibilité
6. Mettre à jour la version dans le changelog

---

*Ce guide est un document vivant qui évolue avec le projet.*
