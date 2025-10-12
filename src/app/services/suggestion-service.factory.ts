import { Injectable, inject } from '@angular/core';
import { 
  CreativeSuggestionService,
  CodeSuggestionService,
  TranslationSuggestionService,
  AnalysisSuggestionService,
  BaseSuggestionService
} from './suggestions';

/**
 * Factory pour obtenir le service de suggestion approprié
 * Basé sur le mode de la suggestion sélectionnée
 */
@Injectable({
  providedIn: 'root'
})
export class SuggestionServiceFactory {
  private creativeService = inject(CreativeSuggestionService);
  private codeService = inject(CodeSuggestionService);
  private translationService = inject(TranslationSuggestionService);
  private analysisService = inject(AnalysisSuggestionService);

  /**
   * Retourne le service approprié selon le mode
   */
  getService(mode: string): BaseSuggestionService {
    switch (mode) {
      case 'creative':
        return this.creativeService;
      case 'code':
        return this.codeService;
      case 'translation':
        return this.translationService;
      case 'analysis':
        return this.analysisService;
      // TODO: Ajouter les autres services
      default:
        throw new Error(`No service found for suggestion mode: ${mode}`);
    }
  }

  /**
   * Vérifie si un mode de suggestion est supporté
   */
  isSupported(mode: string): boolean {
    const supportedModes = ['creative', 'code', 'translation', 'analysis'];
    return supportedModes.includes(mode);
  }

  /**
   * Liste tous les modes supportés
   */
  getSupportedModes(): string[] {
    return ['creative', 'code', 'translation', 'analysis'];
  }
}
