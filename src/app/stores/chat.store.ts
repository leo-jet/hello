import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, from } from 'rxjs';
import { LlmModel, LlmProvider } from '@app/models';
import { ChatModeService } from '@app/services/chat-mode.service';

/**
 * Interface pour une conversation
 */
export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

/**
 * ChatStore - Gestion simple de l'état du chat avec SignalStore
 */
export const ChatStore = signalStore(
  { providedIn: 'root' },

  // État
  withState({
    llmModels: [] as LlmModel[],
    llmProviders: [] as LlmProvider[],
    selectedModel: null as LlmModel | null,
    isLoading: false,
    conversations: [] as Conversation[],
    selectedConversationId: null as string | null
  }),

  // Computed
  withComputed((store) => ({
    availableModels: computed(() =>
      store.llmModels().filter(m => m.isAvailable)
    ),
    selectedConversation: computed(() =>
      store.conversations().find(c => c.id === store.selectedConversationId()) || null
    ),
    totalUnreadCount: computed(() =>
      store.conversations().reduce((sum, c) => sum + c.unreadCount, 0)
    )
  })),

  // Méthodes
  withMethods((store, chatModeService = inject(ChatModeService)) => ({
    /**
     * Charger les modèles depuis l'API via ChatModeService
     */
    loadModels: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => from(chatModeService.loadLlmModels())),
        tap({
          next: (response) => {
            const selectedModel = store.selectedModel() || response.models.find(m => m.isAvailable) || null;
            patchState(store, {
              llmModels: response.models,
              llmProviders: response.providers,
              isLoading: false,
              selectedModel
            });
          },
          error: () => patchState(store, { isLoading: false })
        })
      )
    ),

    /**
     * Sélectionner un modèle
     */
    selectModel(model: LlmModel | null): void {
      patchState(store, { selectedModel: model });
    },

    /**
     * Ajouter une conversation
     */
    addConversation(conversation: Conversation): void {
      patchState(store, {
        conversations: [...store.conversations(), conversation]
      });
    },

    /**
     * Mettre à jour une conversation
     */
    updateConversation(conversationId: string, updates: Partial<Conversation>): void {
      const conversations = store.conversations().map(c =>
        c.id === conversationId ? { ...c, ...updates } : c
      );
      patchState(store, { conversations });
    },

    /**
     * Supprimer une conversation
     */
    deleteConversation(conversationId: string): void {
      const conversations = store.conversations().filter(c => c.id !== conversationId);
      patchState(store, {
        conversations,
        // Si la conversation supprimée était sélectionnée, on désélectionne
        selectedConversationId: store.selectedConversationId() === conversationId
          ? null
          : store.selectedConversationId()
      });
    },

    /**
     * Sélectionner une conversation
     */
    selectConversation(conversationId: string | null): void {
      patchState(store, { selectedConversationId: conversationId });

      // Marquer comme lu (mettre unreadCount à 0)
      if (conversationId) {
        const conversations = store.conversations().map(c =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        );
        patchState(store, { conversations });
      }
    },

    /**
     * Créer une nouvelle conversation
     */
    createNewConversation(title: string): Conversation {
      console.log('Creating new conversation with title:', title);
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title,
        lastMessage: '',
        timestamp: new Date(),
        unreadCount: 0
      };

      patchState(store, {
        conversations: [...store.conversations(), newConversation],
        selectedConversationId: newConversation.id
      });

      return newConversation;
    },

    /**
     * Charger les conversations (mock pour l'instant)
     */
    loadConversations(): void {
      // Mock data pour le développement
      const mockConversations: Conversation[] = [
        {
          id: '1',
          title: 'Discussion sur Angular 19',
          lastMessage: 'Comment implémenter les signals ?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
          unreadCount: 2,
        },
        {
          id: '2',
          title: 'Projet Template Widget',
          lastMessage: 'La sidebar est presque terminée',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
          unreadCount: 0,
        }
      ];

      patchState(store, { conversations: mockConversations });
    }
  }))
);
