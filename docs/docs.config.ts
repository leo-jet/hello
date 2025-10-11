import { Routes } from '@angular/router';

/**
 * Routes pour la documentation et les exemples
 * Utilisées pour naviguer vers les pages d'exemples depuis l'application principale
 */
export const DOCS_ROUTES: Routes = [
  {
    path: 'docs',
    loadComponent: () => import('./layouts/docs-layout.component').then(m => m.DocsLayoutComponent),
    children: [
      {
        path: 'dropdown',
        loadComponent: () => import('./dropdown/dropdown-docs.component').then(m => m.DropdownDocsComponent),
        title: 'Dropdown Documentation'
      },
      {
        path: 'input-field',
        loadComponent: () => import('./input-field/input-field-docs.component').then(m => m.InputFieldDocsComponent),
        title: 'InputField Documentation'
      },
      {
        path: 'select',
        loadComponent: () => import('./select/select-docs.component').then(m => m.SelectDocsComponent),
        title: 'Select Documentation'
      },
      {
        path: 'dialog',
        loadComponent: () => import('./dialog/dialog-docs.component').then(m => m.DialogDocsComponent),
        title: 'Dialog Documentation'
      },
  // you can add service/guide routes here if you create pages under docs/services or docs/guides
      {
        path: '',
        redirectTo: 'dropdown',
        pathMatch: 'full'
      }
    ]
  }
];

/**
 * Configuration des exemples disponibles
 * Utilisée pour générer automatiquement les liens de navigation
 */
export const DOCS_CONFIG = {
  components: [
    {
      name: 'DropdownComponent',
      path: 'dropdown',
      description: 'Composant dropdown/select avancé avec support d\'icônes et positionnement intelligent',
      status: 'stable',
      version: '1.0.0',
      features: [
        'Smart positioning & collision detection',
        'Icon & image support',
        'Customizable styling',
        'Keyboard navigation',
        'Object or value return modes',
        'Large list performance'
      ]
    }
    ,
    {
      name: 'InputFieldComponent',
      path: 'input-field',
      description: 'Champ de saisie simple avec binding ngModel',
      status: 'stable',
      version: '1.0.0',
      features: ['Two-way binding', 'Placeholder support']
    }
    ,
    {
      name: 'SelectComponent',
      path: 'select',
      description: 'Menu déroulant léger avec icônes/images et positionnement intelligent',
      status: 'stable',
      version: '1.0.0',
      features: ['Icon & image support', 'Smart positioning', 'Configurable classes', 'Return object or value']
    },
    {
      name: 'DialogComponent',
      path: 'dialog',
      description: 'Boîte de dialogue modale complète avec alert, confirm, prompt et options',
      status: 'stable',
      version: '1.0.0',
      features: [
        'Alert, Confirm & Prompt',
        'Radio, Checkbox & Toggle options',
        'Multiple positions & animations',
        'Persistent & seamless modes',
        'Validation & async handlers',
        '100% Tailwind CSS',
        'Dark mode support',
        'Responsive design'
      ]
    }
    // Autres composants à documenter :
    // {
    //   name: 'ButtonComponent',
    //   path: 'button',
    //   description: 'Boutons personnalisables avec variantes',
    //   status: 'planned',
    //   version: '1.1.0'
    // },
    // {
    //   name: 'ModalComponent',
    //   path: 'modal',
    //   description: 'Modales et dialogs accessibles',
    //   status: 'planned',
    //   version: '1.2.0'
    // }
  ],
  services: [
    {
      name: 'ChatModeService',
      path: 'chat-mode-service',
      description: 'Service de gestion des modes de chat',
      status: 'stable',
      version: '1.0.0'
    }
  ],
  guides: [
    {
      name: 'Guide de documentation',
      path: 'component-documentation-guide',
      description: 'Comment documenter les composants',
      status: 'stable'
    }
  ]
};

/**
 * Types pour la configuration de documentation
 */
export interface DocItem {
  name: string;
  path: string;
  description: string;
  status: 'stable' | 'beta' | 'planned' | 'deprecated';
  version?: string;
  examples?: Array<{ name: string; anchor: string }>;
}

export interface DocsConfiguration {
  components: DocItem[];
  services: DocItem[];
  guides: DocItem[];
}
