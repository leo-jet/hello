import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { LlmModel } from '@app/models';

/**
 * ChatStore - Gestion simple de l'état du chat avec SignalStore
 */
export const ChatStore = signalStore(
  { providedIn: 'root' },

  // État
  withState({
    llmModels: [] as LlmModel[],
    selectedModelId: null as string | null,
    isLoading: false
  }),

  // Computed
  withComputed((store) => ({
    availableModels: computed(() =>
      store.llmModels().filter(m => m.isAvailable)
    ),
    selectedModel: computed(() =>
      store.llmModels().find(m => m.id === store.selectedModelId()) || null
    )
  })),

  // Méthodes
  withMethods((store, http = inject(HttpClient)) => ({
    /**
     * Charger les modèles depuis l'API
     */
    loadModels: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => http.get<LlmModel[]>('/api/llm-models')),
        tap({
          next: (models) => patchState(store, {
            llmModels: models,
            isLoading: false,
            selectedModelId: store.selectedModelId() || models.find(m => m.isAvailable)?.id || null
          }),
          error: () => patchState(store, { isLoading: false })
        })
      )
    ),

    /**
     * Sélectionner un modèle
     */
    selectModel(modelId: string): void {
      patchState(store, { selectedModelId: modelId });
    }
  }))
);
