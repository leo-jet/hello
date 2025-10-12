import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainChatInputComponent, ChatModeInfo } from '../../layouts/main-layout/main-chat-input/main-chat-input.component';
import { SuggestionCardComponent } from '../../components/suggestion-card/suggestion-card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ChatModeService, ChatMode } from '../../services/chat-mode.service';
import { ChatStore } from '../../stores/chat.store';

// Interface pour les suggestions
interface Suggestion {
  mode: string;
  shortDescription: string;
  longDescription: string;
  canUpload: boolean;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [CommonModule, SuggestionCardComponent, MainChatInputComponent, ButtonComponent],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.css'
})
export class NewChatComponent implements OnInit {
  private chatModeService = inject(ChatModeService);
  private router = inject(Router);
  readonly chatStore = inject(ChatStore);

  ngOnInit(): void {
    // Charger les modèles LLM depuis le store
    this.chatStore.loadModels();
  }

  // Message en cours de saisie
  currentMessage = signal<string>('');

  // Suggestion sélectionnée
  selectedSuggestion = signal<Suggestion | null>(null);

  // Niveau de raisonnement sélectionné
  selectedReasoningLevel = signal<'low' | 'medium' | 'high'>('medium');

  // Mode de chat actuel (signal depuis le service)
  selectedChatMode = signal<ChatMode>(null);

  // Mode de chat actuel
  currentChatModeInfo = signal<ChatModeInfo | null>(null);

  // État du bouton d'envoi
  isSendButtonDisabled = false;

  // Liste des suggestions
  suggestions: Suggestion[] = [
    {
      mode: 'creative',
      shortDescription: 'Idées créatives',
      longDescription: 'Générer des idées innovantes pour un projet',
      canUpload: false,
      icon: 'fas fa-lightbulb',
      iconColor: 'text-yellow-500'
    },
    {
      mode: 'code',
      shortDescription: 'Aide au code',
      longDescription: 'Résoudre un problème de programmation',
      canUpload: true,
      icon: 'fas fa-code',
      iconColor: 'text-blue-500'
    },
    {
      mode: 'translation',
      shortDescription: 'Traduction',
      longDescription: 'Traduire un texte dans une autre langue',
      canUpload: true,
      icon: 'fas fa-language',
      iconColor: 'text-green-500'
    },
    {
      mode: 'writing',
      shortDescription: 'Rédaction',
      longDescription: 'Écrire un article ou un email professionnel',
      canUpload: false,
      icon: 'fas fa-pen',
      iconColor: 'text-purple-500'
    },
    {
      mode: 'analysis',
      shortDescription: 'Analyse de données',
      longDescription: 'Analyser et interpréter des données complexes',
      canUpload: true,
      icon: 'fas fa-chart-line',
      iconColor: 'text-indigo-500'
    },
    {
      mode: 'research',
      shortDescription: 'Recherche',
      longDescription: 'Rechercher des informations sur un sujet',
      canUpload: false,
      icon: 'fas fa-search',
      iconColor: 'text-teal-500'
    },
    {
      mode: 'summarize',
      shortDescription: 'Résumé',
      longDescription: 'Résumer un long document ou article',
      canUpload: true,
      icon: 'fas fa-file-alt',
      iconColor: 'text-orange-500'
    },
    {
      mode: 'brainstorm',
      shortDescription: 'Brainstorming',
      longDescription: 'Générer des idées pour résoudre un problème',
      canUpload: false,
      icon: 'fas fa-brain',
      iconColor: 'text-pink-500'
    },
    {
      mode: 'explain',
      shortDescription: 'Explication',
      longDescription: 'Expliquer un concept complexe simplement',
      canUpload: false,
      icon: 'fas fa-graduation-cap',
      iconColor: 'text-cyan-500'
    },
    {
      mode: 'debug',
      shortDescription: 'Débogage',
      longDescription: 'Identifier et corriger des bugs dans le code',
      canUpload: true,
      icon: 'fas fa-bug',
      iconColor: 'text-red-500'
    },
    {
      mode: 'optimize',
      shortDescription: 'Optimisation',
      longDescription: 'Améliorer les performances et la qualité',
      canUpload: true,
      icon: 'fas fa-tachometer-alt',
      iconColor: 'text-emerald-500'
    },
    {
      mode: 'design',
      shortDescription: 'Design',
      longDescription: 'Créer des concepts et maquettes visuelles',
      canUpload: true,
      icon: 'fas fa-palette',
      iconColor: 'text-fuchsia-500'
    },
    {
      mode: 'review',
      shortDescription: 'Révision',
      longDescription: 'Réviser et améliorer un texte existant',
      canUpload: true,
      icon: 'fas fa-check-double',
      iconColor: 'text-lime-500'
    }
  ];

  // Modes de chat disponibles
  chatModes: Array<{ mode: ChatMode; info: ChatModeInfo }> = [
    { mode: 'basic', info: this.chatModeService.getModeInfo('basic') },
    { mode: 'advanced', info: this.chatModeService.getModeInfo('advanced') },
    { mode: 'rag', info: this.chatModeService.getModeInfo('rag') }
  ];

  // Options formatées pour le composant select (modes de chat)
  get chatModeSelectOptions() {
    return this.chatModes.map(({ mode, info }) => ({
      value: mode as string,
      label: info.label,
      icon: info.icon
    }));
  }

  // Options pour le composant select (modèles) - sans formatage
  get modelSelectOptions() {
    return this.chatStore.availableModels();
  }

  /**
   * Gérer la sélection d'un mode de chat
   */
  onChatModeSelect(mode: string): void {
    const chatMode = mode as ChatMode;
    this.selectedChatMode.set(chatMode);
    this.chatModeService.setMode(chatMode);
    this.currentChatModeInfo.set(this.chatModeService.getCurrentModeInfo());
    console.log('Mode de chat sélectionné:', mode);
  }

  /**
   * Gérer la sélection d'un modèle
   */
  onModelSelect(model: any): void {
    this.chatStore.selectModel(model);
    console.log('Modèle sélectionné:', model);
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
    this.currentMessage.set(text);
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
    const message = this.currentMessage().trim();

    if (!message) {
      return;
    }

    console.log('Message envoyé:', message);

    // Créer une nouvelle conversation avec le message comme titre
    const newConversation = this.chatStore.createNewConversation(
      this.generateConversationTitle(message)
    );

    console.log('Nouvelle conversation créée:', newConversation);

    // Naviguer vers la page de chat avec l'ID de la conversation
    this.router.navigate(['/chat', newConversation.id]);
  }

  /**
   * Générer un titre de conversation à partir du premier message
   */
  private generateConversationTitle(message: string): string {
    // Prendre les 50 premiers caractères comme titre
    const maxLength = 50;
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  }

  /**
   * Gérer le clic sur une carte de suggestion
   */
  onSuggestionClick(suggestionMode: string): void {
    const suggestion = this.suggestions.find(s => s.mode === suggestionMode);
    if (suggestion) {
      // Si on clique sur la même suggestion, on la désélectionne
      if (this.selectedSuggestion()?.mode === suggestionMode) {
        this.selectedSuggestion.set(null);
      } else {
        this.selectedSuggestion.set(suggestion);
      }
    }
    console.log('Suggestion sélectionnée:', this.selectedSuggestion());
  }

  /**
   * Réinitialiser la sélection de suggestion
   */
  resetSuggestion(): void {
    this.selectedSuggestion.set(null);
    this.currentMessage.set('');
  }
}
