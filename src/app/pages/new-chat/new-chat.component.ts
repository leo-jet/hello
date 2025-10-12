import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainChatInputComponent, ChatModeInfo } from '../../layouts/main-layout/main-chat-input/main-chat-input.component';
import { SuggestionCardComponent } from '../../components/suggestion-card/suggestion-card.component';
import { ChatModeService, ChatMode } from '../../services/chat-mode.service';
import { ChatStore } from '../../stores/chat.store';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [CommonModule, MainChatInputComponent, SuggestionCardComponent],
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

  // Niveau de raisonnement sélectionné
  selectedReasoningLevel = signal<'low' | 'medium' | 'high'>('medium');

  // Mode de chat actuel (signal depuis le service)
  selectedChatMode = signal<ChatMode>(null);

  // Mode de chat actuel
  currentChatModeInfo = signal<ChatModeInfo | null>(null);

  // État du bouton d'envoi
  isSendButtonDisabled = false;

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
  onSuggestionClick(suggestionType: string): void {
    console.log('Suggestion cliquée:', suggestionType);
    // TODO: Pré-remplir l'input avec un prompt suggéré selon le type
  }
}
