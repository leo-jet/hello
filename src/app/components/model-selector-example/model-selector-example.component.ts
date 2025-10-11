import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import * as ChatActions from '@app/store/chat';
import * as ChatSelectors from '@app/store/chat';

@Component({
  selector: 'app-model-selector-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-gray-900">Sélecteur de Modèles LLM</h2>

      <!-- Loading -->
      @if (isLoading()) {
        <div class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
          <p class="mt-4 text-gray-600">Chargement des modèles...</p>
        </div>
      }

      <!-- Error -->
      @if (error(); as errorMsg) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <i class="fas fa-exclamation-circle text-red-600 text-xl mt-0.5 mr-3"></i>
            <div class="flex-1">
              <h3 class="text-red-900 font-semibold mb-1">Erreur</h3>
              <p class="text-red-800 text-sm">{{ errorMsg }}</p>
            </div>
            <button
              (click)="clearError()"
              class="ml-2 text-red-600 hover:text-red-800"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      }

      <!-- Models Grid -->
      @if (!isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          @for (model of availableModels(); track model.id) {
            <div
              class="border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
              [class.bg-blue-50]="model.id === selectedModelId()"
              [class.border-blue-500]="model.id === selectedModelId()"
              [class.border-blue-200]="model.id === selectedModelId()"
              [class.bg-white]="model.id !== selectedModelId()"
              [class.border-gray-200]="model.id !== selectedModelId()"
              [class.hover:bg-gray-50]="model.id !== selectedModelId()"
              (click)="selectModel(model.id)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold text-lg text-gray-900">{{ model.name }}</h3>
                    @if (model.id === selectedModelId()) {
                      <i class="fas fa-check-circle text-blue-600"></i>
                    }
                  </div>

                  <p class="text-sm text-gray-600 mb-2">
                    <i class="fas fa-building mr-1"></i>
                    {{ model.provider }}
                  </p>

                  @if (model.description) {
                    <p class="text-sm text-gray-500 mb-2">{{ model.description }}</p>
                  }

                  @if (model.maxTokens) {
                    <div class="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                      <i class="fas fa-coins"></i>
                      {{ model.maxTokens | number }} tokens max
                    </div>
                  }
                </div>

                @if (model.isAvailable) {
                  <span class="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    <i class="fas fa-circle text-green-500" style="font-size: 6px;"></i>
                    Disponible
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                    <i class="fas fa-circle text-gray-400" style="font-size: 6px;"></i>
                    Indisponible
                  </span>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Selected Model Info -->
      @if (selectedModel(); as model) {
        <div class="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 class="flex items-center gap-2 font-bold text-green-900 mb-3">
            <i class="fas fa-robot text-xl"></i>
            Modèle actif
          </h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-green-700 font-medium">Nom:</span>
              <span class="ml-2 text-green-900">{{ model.name }}</span>
            </div>
            <div>
              <span class="text-green-700 font-medium">Fournisseur:</span>
              <span class="ml-2 text-green-900">{{ model.provider }}</span>
            </div>
            @if (model.maxTokens) {
              <div>
                <span class="text-green-700 font-medium">Tokens max:</span>
                <span class="ml-2 text-green-900">{{ model.maxTokens | number }}</span>
              </div>
            }
            <div>
              <span class="text-green-700 font-medium">ID:</span>
              <span class="ml-2 text-green-900 font-mono text-xs">{{ model.id }}</span>
            </div>
          </div>
        </div>
      }

      <!-- Actions -->
      <div class="mt-6 flex gap-3">
        <button
          (click)="loadModels()"
          [disabled]="isLoading()"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas" [class.fa-sync-alt]="!isLoading()" [class.fa-spin]="isLoading()" [class.fa-spinner]="isLoading()"></i>
          {{ isLoading() ? 'Chargement...' : 'Recharger les modèles' }}
        </button>

        <button
          (click)="reset()"
          class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <i class="fas fa-redo"></i>
          Réinitialiser
        </button>
      </div>

      <!-- Stats -->
      <div class="mt-6 grid grid-cols-3 gap-4 text-center">
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-3xl font-bold text-blue-600">{{ llmModels().length }}</div>
          <div class="text-sm text-gray-600 mt-1">Total modèles</div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-3xl font-bold text-green-600">{{ availableModels().length }}</div>
          <div class="text-sm text-gray-600 mt-1">Disponibles</div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-3xl font-bold text-purple-600">{{ selectedModel() ? '1' : '0' }}</div>
          <div class="text-sm text-gray-600 mt-1">Sélectionné</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 0;
    }
  `]
})
export class ModelSelectorExampleComponent implements OnInit {
  private store = inject(Store);

  // Convertir les observables NgRx en signals
  llmModels = toSignal(this.store.select(ChatSelectors.selectLlmModels), { initialValue: [] });
  availableModels = toSignal(this.store.select(ChatSelectors.selectAvailableLlmModels), { initialValue: [] });
  selectedModel = toSignal(this.store.select(ChatSelectors.selectSelectedModel), { initialValue: null });
  selectedModelId = toSignal(this.store.select(ChatSelectors.selectSelectedModelId), { initialValue: null });
  isLoading = toSignal(this.store.select(ChatSelectors.selectIsLoading), { initialValue: false });
  error = toSignal(this.store.select(ChatSelectors.selectError), { initialValue: null });

  ngOnInit() {
    // Charger les modèles au démarrage
    this.loadModels();
  }

  loadModels() {
    this.store.dispatch(ChatActions.loadLlmModels());
  }

  selectModel(modelId: string) {
    this.store.dispatch(ChatActions.selectModel({ modelId }));
  }

  clearError() {
    this.store.dispatch(ChatActions.clearError());
  }

  reset() {
    this.store.dispatch(ChatActions.resetChat());
  }
}
