import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseSuggestionService, BaseSuggestionRequest, BaseSuggestionResponse } from './base-suggestion.service';

/**
 * Interface spécifique pour Code
 */
export interface CodeRequest extends BaseSuggestionRequest {
  language?: string;
  framework?: string;
  include_comments?: boolean;
  include_tests?: boolean;
}

export interface CodeResponse extends BaseSuggestionResponse {
  code: string;
  language: string;
  explanations?: string[];
  suggested_improvements?: string[];
}

/**
 * Service pour la suggestion "Code"
 * Génère, analyse et améliore du code
 */
@Injectable({
  providedIn: 'root'
})
export class CodeSuggestionService extends BaseSuggestionService {
  private http = inject(HttpClient);

  /**
   * Soumet une requête de code
   */
  submit(request: CodeRequest): void {
    if (!this.validateRequest(request)) {
      throw new Error('Invalid request: message and modelId are required');
    }

    const payload = this.prepareCodePayload(request);

    this.http.post<CodeResponse>('/api/suggestions/code', payload).pipe(
      map(response => ({
        ...response,
        timestamp: new Date(response.timestamp)
      }))
    ).subscribe({
      next: (response) => {
        console.log('Code response received:', response);
        // Le traitement de la réponse peut être géré ici ou via un callback
      },
      error: (err) => {
        console.error('Code request failed:', err);
      }
    });
  }

  /**
   * Prépare le payload spécifique pour code
   */
  private prepareCodePayload(request: CodeRequest): any {
    const payload: any = {
      ...this.preparePayload(request),
      type: 'code',
      include_comments: request.include_comments ?? true,
      include_tests: request.include_tests ?? false
    };

    if (request.language) {
      payload.language = request.language;
    }

    if (request.framework) {
      payload.framework = request.framework;
    }

    // Support des fichiers uploadés
    if (request.files && request.files.length > 0) {
      payload.has_attachments = true;
      payload.file_count = request.files.length;
    }

    return payload;
  }

  /**
   * Valide les fichiers uploadés pour le code
   */
  protected override validateRequest(request: CodeRequest): boolean {
    const baseValid = super.validateRequest(request);

    // Vérifier les types de fichiers si présents
    if (request.files && request.files.length > 0) {
      const validExtensions = ['.js', '.ts', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rs', '.rb', '.php'];
      return baseValid && request.files.every(file =>
        validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      );
    }

    return baseValid;
  }
}
