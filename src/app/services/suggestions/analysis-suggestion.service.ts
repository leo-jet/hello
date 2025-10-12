import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseSuggestionService, BaseSuggestionRequest, BaseSuggestionResponse } from './base-suggestion.service';

/**
 * Interface spécifique pour Analysis
 */
export interface AnalysisRequest extends BaseSuggestionRequest {
  analysis_type?: 'general' | 'technical' | 'business' | 'data';
  depth_level?: 'shallow' | 'medium' | 'deep';
  include_visualization?: boolean;
}

export interface AnalysisResponse extends BaseSuggestionResponse {
  summary: string;
  key_findings: string[];
  recommendations?: string[];
  charts?: any[];
  confidence_score?: number;
}

/**
 * Service pour la suggestion "Analysis"
 * Analyse des données, documents ou situations
 */
@Injectable({
  providedIn: 'root'
})
export class AnalysisSuggestionService extends BaseSuggestionService {
  private http = inject(HttpClient);

  /**
   * Soumet une requête d'analyse
   */
  submit(request: AnalysisRequest): Observable<AnalysisResponse> {
    if (!this.validateRequest(request)) {
      throw new Error('Invalid request: message and modelId are required');
    }

    const payload = this.prepareAnalysisPayload(request);

    return this.http.post<AnalysisResponse>('/api/suggestions/analysis', payload).pipe(
      map(response => ({
        ...response,
        timestamp: new Date(response.timestamp)
      }))
    );
  }

  /**
   * Prépare le payload spécifique pour analyse
   */
  private prepareAnalysisPayload(request: AnalysisRequest): any {
    return {
      ...this.preparePayload(request),
      analysis_type: request.analysis_type || 'general',
      depth_level: request.depth_level || 'medium',
      include_visualization: request.include_visualization ?? false,
      type: 'analysis'
    };
  }
}
