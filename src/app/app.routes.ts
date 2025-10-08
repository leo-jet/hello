import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      }
    ]
  },
  {
    path: 'chat',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'basic',
        loadComponent: () => import('./pages/chat-basic/chat-basic.component').then(m => m.ChatBasicComponent)
      },
      {
        path: 'advanced',
        loadComponent: () => import('./pages/chat-advanced/chat-advanced.component').then(m => m.ChatAdvancedComponent)
      },
      {
        path: 'rag',
        loadComponent: () => import('./pages/chat-rag/chat-rag.component').then(m => m.ChatRagComponent)
      }
    ]
  },
  {
    path: 'profile',
    loadComponent: () => import('./layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'ngrx-example',
    loadComponent: () => import('./components/ngrx-example/ngrx-example.component').then(m => m.NgRxExampleComponent)
  }
];
