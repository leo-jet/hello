/**
 * Exemple d'utilisation des services de suggestions dans un composant
 */

import { Component, inject } from '@angular/core';
import { SuggestionServiceFactory } from '@app/services/suggestion-service.factory';
import {
  CreativeRequest,
  CodeRequest,
  TranslationRequest,
  AnalysisRequest
} from '@app/services/suggestions';

// Dans votre composant new-chat ou autre :
export class ExampleUsage {
  private suggestionFactory = inject(SuggestionServiceFactory);

  /**
   * Exemple 1: Soumettre une requête créative
   */
  submitCreative() {
    const service = this.suggestionFactory.getService('creative');

    const request: CreativeRequest = {
      message: 'Écris-moi une histoire sur un robot',
      modelId: 'gpt-4',
      creativity_level: 'high',
      tone: 'humorous'
    };

    service.submit(request).subscribe({
      next: (response) => {
        console.log('Creative response:', response);
        // response.content contient le texte généré
        // response.alternatives contient des alternatives
        // response.creativity_score contient le score
      },
      error: (err) => console.error('Error:', err)
    });
  }

  /**
   * Exemple 2: Soumettre du code avec fichiers
   */
  submitCode(files: File[]) {
    const service = this.suggestionFactory.getService('code');

    const request: CodeRequest = {
      message: 'Analyse ce code et propose des améliorations',
      modelId: 'gpt-4',
      files: files,
      language: 'typescript',
      framework: 'angular',
      include_comments: true,
      include_tests: true
    };

    service.submit(request).subscribe({
      next: (response) => {
        console.log('Code response:', response);
        // response.code contient le code généré/amélioré
        // response.explanations contient les explications
        // response.suggested_improvements contient les suggestions
      },
      error: (err) => console.error('Error:', err)
    });
  }

  /**
   * Exemple 3: Traduction
   */
  submitTranslation() {
    const service = this.suggestionFactory.getService('translation');

    const request: TranslationRequest = {
      message: 'Hello, how are you?',
      modelId: 'gpt-4',
      target_language: 'fr',
      source_language: 'en',
      preserve_formatting: true,
      context: 'informal conversation'
    };

    service.submit(request).subscribe({
      next: (response) => {
        console.log('Translation response:', response);
        // response.translated_text contient la traduction
        // response.confidence contient le score de confiance
      },
      error: (err) => console.error('Error:', err)
    });
  }

  /**
   * Exemple 4: Analyse
   */
  submitAnalysis() {
    const service = this.suggestionFactory.getService('analysis');

    const request: AnalysisRequest = {
      message: 'Analyse les tendances du marché de l\'IA en 2024',
      modelId: 'gpt-4',
      analysis_type: 'business',
      depth_level: 'deep',
      include_visualization: true
    };

    service.submit(request).subscribe({
      next: (response) => {
        console.log('Analysis response:', response);
        // response.summary contient le résumé
        // response.key_findings contient les découvertes clés
        // response.recommendations contient les recommandations
        // response.charts contient les graphiques si demandés
      },
      error: (err) => console.error('Error:', err)
    });
  }

  /**
   * Exemple 5: Utilisation dynamique basée sur la suggestion sélectionnée
   */
  submitDynamic(suggestionMode: string, message: string, modelId: string) {
    // Vérifier si le mode est supporté
    if (!this.suggestionFactory.isSupported(suggestionMode)) {
      console.error(`Mode ${suggestionMode} not supported yet`);
      return;
    }

    // Obtenir le service approprié
    const service = this.suggestionFactory.getService(suggestionMode);

    // Requête de base
    const request = {
      message,
      modelId,
      conversationId: 'conv-123'
    };

    // Soumettre
    service.submit(request).subscribe({
      next: (response) => {
        console.log(`${suggestionMode} response:`, response);
        // Traiter la réponse selon le type
      },
      error: (err) => console.error('Error:', err)
    });
  }
}
