import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseSuggestionService, BaseSuggestionRequest, BaseSuggestionResponse } from './base-suggestion.service';

/**
 * Interface spécifique pour Translation
 */
export interface TranslationRequest extends BaseSuggestionRequest {
  source_language?: string;
  target_language: string;
  preserve_formatting?: boolean;
  context?: string;
}

export interface TranslationResponse extends BaseSuggestionResponse {
  translated_text: string;
  source_language: string;
  target_language: string;
  confidence?: number;
}

/**
 * Service pour la suggestion "Translation"
 * Traduit du texte d'une langue à une autre
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationSuggestionService extends BaseSuggestionService {
  private http = inject(HttpClient);

  /**
   * Soumet une requête de traduction
   */
  submit(request: TranslationRequest): Observable<TranslationResponse> {
    if (!this.validateTranslationRequest(request)) {
      throw new Error('Invalid request: message, modelId and target_language are required');
    }

    const payload = this.prepareTranslationPayload(request);

    return this.http.post<TranslationResponse>('/api/suggestions/translation', payload).pipe(
      map(response => ({
        ...response,
        timestamp: new Date(response.timestamp)
      }))
    );
  }

  /**
   * Valide la requête de traduction
   */
  private validateTranslationRequest(request: TranslationRequest): boolean {
    return super.validateRequest(request) && !!request.target_language;
  }

  /**
   * Prépare le payload spécifique pour traduction
   */
  private prepareTranslationPayload(request: TranslationRequest): any {
    return {
      ...this.preparePayload(request),
      source_language: request.source_language || 'auto',
      target_language: request.target_language,
      preserve_formatting: request.preserve_formatting ?? true,
      context: request.context,
      type: 'translation'
    };
  }
}
