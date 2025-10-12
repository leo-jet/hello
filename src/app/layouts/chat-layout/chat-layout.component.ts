import { Component, signal, computed, effect, inject, OnInit, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ChatModeService } from '../../services/chat-mode.service';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { MainChatInputComponent } from '../main-layout/main-chat-input/main-chat-input.component';
import { ChatStore } from '../../stores/chat.store';

@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, MainChatInputComponent],
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.css']
})
export class ChatLayoutComponent implements OnInit {
  // Injection du ChatStore (SignalStore)
  readonly chatStore = inject(ChatStore);

  messageValue = signal<string>('');

  // Sera initialisé dans le constructeur
  chatId;

  // Conversation courante depuis le store
  currentConversation = computed(() => this.chatStore.selectedConversation());

  constructor(
    private chatModeService: ChatModeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialisation du signal après l'injection de route
    this.chatId = toSignal(
      this.route.paramMap.pipe(
        map(params => params.get('id'))
      )
    );

    // Effect pour réagir aux changements de l'id
    // untracked() empêche le tracking des modifications du store dans l'effect
    effect(() => {
      const id = this.chatId();
      if (id) {
        console.log('Chat ID changé:', id);
        // Exécuter sans tracker les modifications du store
        untracked(() => {
          this.chatStore.selectConversation(id);
        });
      }
    });
  }

  ngOnInit() {
    // Charger les modèles LLM et les conversations depuis le store
    this.chatStore.loadModels();
    this.chatStore.loadConversations();
  }

  currentChatModeInfo = computed(() => this.chatModeService.getCurrentModeInfo());

  selectedReasoningLevel = signal<'low' | 'medium' | 'high'>('medium');

  get isSendButtonDisabled(): boolean { return this.messageValue().trim().length === 0; }

  get modelSelectOptions() {
    return this.chatStore.availableModels().map(m => ({ value: m, label: m.name, icon: '🤖' }));
  }

  onModelSelect(model: any): void {
    // Appeler la méthode du store pour sélectionner le modèle
    console.log('Modèle sélectionné:', model);
    this.chatStore.selectModel(model.id);
  }

  onReasoningLevelSelect(level: string): void {
    this.selectedReasoningLevel.set(level as 'low' | 'medium' | 'high');
  }

  onFooterInputChange(text: string): void { this.messageValue.set(text); }
  onMicrophoneClick(): void { console.log('Microphone cliqué'); }

  onSendMessage(): void {
    if (this.messageValue().trim()) {
      const message = this.messageValue();
      const conversationId = this.chatId();

      console.log('Message:', message);
      console.log('Conversation ID:', conversationId);

      // TODO: Ajouter le message à la conversation courante
      if (conversationId) {
        // Mettre à jour le lastMessage de la conversation
        this.chatStore.updateConversation(conversationId, {
          lastMessage: message,
          timestamp: new Date()
        });
      }

      this.messageValue.set('');
    }
  }
}
