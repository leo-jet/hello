import { Routes } from '@angular/router';
import { DOCS_ROUTES } from '../../docs/docs.config';

export const routes: Routes = [
  {
    path: '',
    title: 'Accueil',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        title: 'Accueil - ChatApp',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      }
    ]
  },
  {
    path: 'chat',
    title: 'Chat',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'new',
        title: 'Nouveau Chat - ChatApp',
        loadComponent: () => import('./pages/new-chat/new-chat.component').then(m => m.NewChatComponent)
      },
      {
        path: 'basic',
        title: 'Chat Basique - ChatApp',
        loadComponent: () => import('./pages/chat-basic/chat-basic.component').then(m => m.ChatBasicComponent)
      },
      {
        path: 'advanced',
        title: 'Chat Avancé - ChatApp',
        loadComponent: () => import('./pages/chat-advanced/chat-advanced.component').then(m => m.ChatAdvancedComponent)
      },
      {
        path: 'rag',
        title: 'Chat RAG - ChatApp',
        loadComponent: () => import('./pages/chat-rag/chat-rag.component').then(m => m.ChatRagComponent)
      }
    ]
  },
  {
    path: 'chat/:id',
    title: 'Conversation - ChatApp',
    loadComponent: () => import('./layouts/chat-layout/chat-layout.component').then(m => m.ChatLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent)
      }
    ]
  },
  {
    path: 'profile',
    title: 'Profil',
    loadComponent: () => import('./layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      {
        path: '',
        title: 'Mon Profil - ChatApp',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'ngrx-example',
    title: 'Exemple NgRx - ChatApp',
    loadComponent: () => import('./components/ngrx-example/ngrx-example.component').then(m => m.NgRxExampleComponent)
  },
  ...DOCS_ROUTES
];
