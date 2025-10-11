import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { LlmModel } from '@app/models';

/**
 * Interface pour l'état du chat
 */
interface ChatState {
  llmModels: LlmModel[];
  selectedModelId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * État initial
 */
const initialState: ChatState = {
  llmModels: [],
  selectedModelId: null,
  isLoading: false,
  error: null
};

/**
 * ChatStore - SignalStore pour gérer l'état du chat
 *
 * Utilise NgRx SignalStore pour une gestion d'état simple et réactive.
 * Tous les états sont des signals, accessibles directement dans les composants.
 */
export const ChatStore = signalStore(
  { providedIn: 'root' },

  // État
  withState(initialState),

  // Computed (sélecteurs dérivés)
  withComputed((store) => ({
    /**
     * Modèles disponibles uniquement
     */
    availableModels: computed(() =>
      store.llmModels().filter(model => model.isAvailable)
    ),

    /**
     * Modèle actuellement sélectionné
     */
    selectedModel: computed(() => {
      const models = store.llmModels();
      const selectedId = store.selectedModelId();
      return models.find(model => model.id === selectedId) || null;
    }),

    /**
     * Vérifie si un modèle est sélectionné
     */
    hasSelectedModel: computed(() => store.selectedModelId() !== null)
  })),

  // Méthodes (actions)
  withMethods((store, http = inject(HttpClient)) => ({
    /**
     * Charger les modèles LLM depuis l'API
     */
    loadModels: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() => http.get<LlmModel[]>('/api/llm-models')),
        tap({
          next: (models) => {
            patchState(store, {
              llmModels: models,
              isLoading: false,
              // Sélectionner le premier modèle disponible par défaut si aucun n'est sélectionné
              selectedModelId: store.selectedModelId() || models.find(m => m.isAvailable)?.id || null
            });
          },
          error: (error) => {
            patchState(store, {
              isLoading: false,
              error: error.message || 'Erreur lors du chargement des modèles'
            });
          }
        })
      )
    ),

    /**
     * Sélectionner un modèle
     */
    selectModel(modelId: string): void {
      console.log('Sélection du modèle:', modelId);
      const model = store.llmModels().find(m => m.id === modelId);

      if (model && model.isAvailable) {
        patchState(store, { selectedModelId: modelId });
      }
    },

    /**
     * Ajouter ou mettre à jour un modèle
     */
    upsertModel(model: LlmModel): void {
      const models = store.llmModels();
      const existingIndex = models.findIndex(m => m.id === model.id);

      if (existingIndex >= 0) {
        // Mise à jour
        const updatedModels = [...models];
        updatedModels[existingIndex] = model;
        patchState(store, { llmModels: updatedModels });
      } else {
        // Ajout
        patchState(store, { llmModels: [...models, model] });
      }
    },

    /**
     * Supprimer un modèle
     */
    removeModel(modelId: string): void {
      const models = store.llmModels().filter(m => m.id !== modelId);
      patchState(store, {
        llmModels: models,
        // Si le modèle supprimé était sélectionné, on désélectionne
        selectedModelId: store.selectedModelId() === modelId ? null : store.selectedModelId()
      });
    },

    /**
     * Réinitialiser l'état
     */
    reset(): void {
      patchState(store, initialState);
    },

    /**
     * Effacer l'erreur
     */
    clearError(): void {
      patchState(store, { error: null });
    }
  }))
);
