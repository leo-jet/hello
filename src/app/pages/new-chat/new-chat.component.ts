import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainChatInputComponent, ChatModeInfo } from '../../layouts/main-layout/main-chat-input/main-chat-input.component';
import { SuggestionCardComponent } from '../../components/suggestion-card/suggestion-card.component';

interface AIModel {
  id: string;
  display_name: string;
  description: string;
  has_reasoning: boolean;
  reasoning_level: string[];
}

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [CommonModule, MainChatInputComponent, SuggestionCardComponent],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.css'
})
export class NewChatComponent {
  // Modèles disponibles
  availableModels: AIModel[] = [
    {
      id: 'gpt-4',
      display_name: 'GPT-4',
      description: 'Modèle le plus avancé',
      has_reasoning: false,
      reasoning_level: []
    },
    {
      id: 'gpt-5',
      display_name: 'GPT-5 Pro',
      description: 'Modèle avec capacités de raisonnement',
      has_reasoning: true,
      reasoning_level: ['low', 'medium', 'high']
    },
    {
      id: 'claude-3',
      display_name: 'Claude 3 Opus',
      description: 'Modèle performant d\'Anthropic',
      has_reasoning: false,
      reasoning_level: []
    },
    {
      id: 'gemini-pro',
      display_name: 'Gemini Pro',
      description: 'Modèle multimodal avancé',
      has_reasoning: false,
      reasoning_level: []
    }
  ];

  // Modèle actuellement sélectionné
  selectedModel = signal<AIModel>(this.availableModels[1]); // Par défaut GPT-5

  // Niveau de raisonnement sélectionné
  selectedReasoningLevel = signal<'low' | 'medium' | 'high'>('medium');

  // Mode de chat actuel
  currentChatModeInfo = signal<ChatModeInfo | null>(null);

  // État du bouton d'envoi
  isSendButtonDisabled = false;

  // Options formatées pour le composant select (modèles)
  get modelSelectOptions() {
    return this.availableModels.map(model => ({
      value: model.id,
      label: model.display_name,
      icon: '🤖'
    }));
  }

  // Options formatées pour le composant select (niveaux de raisonnement)
  get reasoningLevelSelectOptions() {
    return [
      { value: 'low', label: 'Faible', icon: '🔵' },
      { value: 'medium', label: 'Moyen', icon: '🟡' },
      { value: 'high', label: 'Élevé', icon: '🔴' }
    ];
  }

  /**
   * Gérer la sélection d'un modèle
   */
  onModelSelect(modelId: string): void {
    const model = this.availableModels.find(m => m.id === modelId);
    if (model) {
      this.selectedModel.set(model);
      console.log('Modèle sélectionné:', model.display_name);
    }
  }

  /**
   * Gérer la sélection d'un niveau de raisonnement
   */
  onReasoningLevelSelect(level: string): void {
    const validLevel = level as 'low' | 'medium' | 'high';
    this.selectedReasoningLevel.set(validLevel);
    console.log('Niveau de raisonnement sélectionné:', validLevel);
  }

  /**
   * Gérer le changement de texte dans l'input
   */
  onFooterInputChange(text: string): void {
    console.log('Texte saisi:', text);
    // Activer/désactiver le bouton d'envoi selon le contenu
    this.isSendButtonDisabled = text.trim().length === 0;
  }

  /**
   * Gérer le clic sur le microphone
   */
  onMicrophoneClick(): void {
    console.log('Microphone cliqué');
    // TODO: Implémenter la reconnaissance vocale
  }

  /**
   * Gérer l'envoi du message
   */
  onSendMessage(): void {
    console.log('Message envoyé');
    // TODO: Implémenter l'envoi du message
  }

  /**
   * Gérer le clic sur une carte de suggestion
   */
  onSuggestionClick(suggestionType: string): void {
    console.log('Suggestion cliquée:', suggestionType);
    // TODO: Pré-remplir l'input avec un prompt suggéré selon le type
  }
}
