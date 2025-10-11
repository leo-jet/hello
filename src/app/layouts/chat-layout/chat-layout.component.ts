import { Component, signal, computed, effect, inject, OnInit } from '@angular/core';
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
    effect(() => {
      const id = this.chatId();
      if (id) {
        console.log('Chat ID changé:', id);
        // Ici vous pouvez charger les données du chat, etc.
        this.loadChatData(id);
      }
    });
  }

  ngOnInit() {
    // Charger les modèles LLM depuis le store
    this.chatStore.loadModels();
  }

  currentChatModeInfo = computed(() => this.chatModeService.getCurrentModeInfo());

  selectedReasoningLevel = signal<'low' | 'medium' | 'high'>('medium');

  get isSendButtonDisabled(): boolean { return this.messageValue().trim().length === 0; }

  get modelSelectOptions() {
    return this.chatStore.availableModels().map(m => ({ value: m.id, label: m.name, icon: '' }));
  }

  get reasoningLevelSelectOptions() {
    return [
      { value: 'low', label: 'Faible', icon: '' },
      { value: 'medium', label: 'Moyen', icon: '' },
      { value: 'high', label: 'Élevé', icon: '' }
    ];
  }

  onModelSelect(modelId: string): void {
    // Appeler la méthode du store pour sélectionner le modèle
    console.log('Modèle sélectionné 999999999999999999999:', modelId);
    this.chatStore.selectModel(modelId);
  }

  onReasoningLevelSelect(level: string): void {
    this.selectedReasoningLevel.set(level as 'low' | 'medium' | 'high');
  }

  onFooterInputChange(text: string): void { this.messageValue.set(text); }
  onMicrophoneClick(): void { console.log('Microphone cliqué'); }

  onSendMessage(): void {
    if (this.messageValue().trim()) {
      console.log('Message:', this.messageValue());
      this.messageValue.set('');
    }
  }

  // Méthode pour charger les données du chat quand l'id change
  private loadChatData(id: string): void {
    console.log('Chargement des données pour le chat:', id);
    // Implémentez ici la logique de chargement des messages, etc.
  }
}
