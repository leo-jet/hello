import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Interface pour la requête de base
 */
export interface BaseSuggestionRequest {
  message: string;
  modelId: string;
  conversationId?: string;
  files?: File[];
}

/**
 * Interface pour la réponse de base
 */
export interface BaseSuggestionResponse {
  id: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Service abstrait de base pour toutes les suggestions
 * Chaque suggestion hérite de cette classe et implémente sa propre logique
 */
@Injectable()
export abstract class BaseSuggestionService {
  /**
   * Soumet une requête au service
   * À implémenter par chaque service de suggestion
   */
  abstract submit(request: BaseSuggestionRequest): Observable<BaseSuggestionResponse>;

  /**
   * Valide la requête avant soumission
   * Peut être surchargée par les services enfants
   */
  protected validateRequest(request: BaseSuggestionRequest): boolean {
    return !!(request.message && request.modelId);
  }

  /**
   * Prépare les données avant l'envoi
   * Peut être surchargée par les services enfants
   */
  protected preparePayload(request: BaseSuggestionRequest): any {
    return {
      message: request.message,
      model_id: request.modelId,
      conversation_id: request.conversationId,
      timestamp: new Date().toISOString()
    };
  }
}
