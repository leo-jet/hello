import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseSuggestionService, BaseSuggestionRequest, BaseSuggestionResponse } from './base-suggestion.service';

/**
 * Interface spécifique pour Creative
 */
export interface CreativeRequest extends BaseSuggestionRequest {
  creativity_level?: 'low' | 'medium' | 'high';
  tone?: 'formal' | 'casual' | 'humorous' | 'professional';
}

export interface CreativeResponse extends BaseSuggestionResponse {
  alternatives?: string[];
  creativity_score?: number;
}

/**
 * Service pour la suggestion "Creative"
 * Génère du contenu créatif avec différents niveaux de créativité
 */
@Injectable({
  providedIn: 'root'
})
export class CreativeSuggestionService extends BaseSuggestionService {
  private http = inject(HttpClient);

  /**
   * Soumet une requête créative
   */
  submit(request: CreativeRequest): Observable<CreativeResponse> {
    if (!this.validateRequest(request)) {
      throw new Error('Invalid request: message and modelId are required');
    }

    const payload = this.prepareCreativePayload(request);

    return this.http.post<CreativeResponse>('/api/suggestions/creative', payload).pipe(
      map(response => ({
        ...response,
        timestamp: new Date(response.timestamp)
      }))
    );
  }

  /**
   * Prépare le payload spécifique pour creative
   */
  private prepareCreativePayload(request: CreativeRequest): any {
    return {
      ...this.preparePayload(request),
      creativity_level: request.creativity_level || 'medium',
      tone: request.tone || 'casual',
      type: 'creative'
    };
  }
}
