import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LlmModel } from '@app/models';

/**
 * Mock HTTP Interceptor pour les appels API LLM Models
 * Simule une réponse API avec des données de test
 */
export const mockLlmModelsInterceptor: HttpInterceptorFn = (req, next) => {
  // Intercepter uniquement les appels à /api/llm-models
  if (req.url.includes('/api/llm-models') && req.method === 'GET') {
    console.log('🎭 Mock intercepté:', req.url);

    // Données mock
    const mockModels: LlmModel[] = [
      {
        id: 'gpt-4',
        name: 'GPT-4 sddfdfffdfdfdfdddf',
        provider: 'OpenAI',
        description: 'Modèle avancé',
        maxTokens: 8192,
        isAvailable: true,
        has_reasoning: false,
        reasoning_level: []
      },
      {
        id: 'gpt-5',
        name: 'GPT-5 Pro',
        provider: 'OpenAI',
        description: 'Avec raisonnement',
        maxTokens: 16384,
        isAvailable: true,
        has_reasoning: true,
        reasoning_level: ['low', 'medium', 'high']
      },
      {
        id: 'claude-3',
        name: 'Claude 3',
        provider: 'Anthropic',
        description: 'Anthropic',
        maxTokens: 100000,
        isAvailable: true,
        has_reasoning: false,
        reasoning_level: []
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        description: 'Multimodal',
        maxTokens: 32768,
        isAvailable: true,
        has_reasoning: false,
        reasoning_level: []
      }
    ];

    // Créer une réponse HTTP mockée
    const mockResponse = new HttpResponse({
      status: 200,
      body: mockModels
    });

    // Retourner un Observable avec un délai simulé (500ms)
    return of(mockResponse).pipe(delay(500));
  }

  // Pour toutes les autres requêtes, continuer normalement
  return next(req);
};
