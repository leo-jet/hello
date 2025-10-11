import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ChatModeService } from '../../services/chat-mode.service';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { MainChatInputComponent } from '../main-layout/main-chat-input/main-chat-input.component';

interface AIModel {
  id: string;
  display_name: string;
  description: string;
  has_reasoning: boolean;
  reasoning_level: ('low' | 'medium' | 'high')[];
}

@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, MainChatInputComponent],
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.css']
})
export class ChatLayoutComponent {
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

  currentChatModeInfo = computed(() => this.chatModeService.getCurrentModeInfo());

  availableModels: AIModel[] = [
    { id: 'gpt-4', display_name: 'GPT-4', description: 'Modèle avancé', has_reasoning: false, reasoning_level: [] },
    { id: 'gpt-5', display_name: 'GPT-5 Pro', description: 'Avec raisonnement', has_reasoning: true, reasoning_level: ['low', 'medium', 'high'] },
    { id: 'claude-3', display_name: 'Claude 3', description: 'Anthropic', has_reasoning: false, reasoning_level: [] },
    { id: 'gemini-pro', display_name: 'Gemini Pro', description: 'Multimodal', has_reasoning: false, reasoning_level: [] }
  ];

  selectedModel = signal<AIModel>(this.availableModels[1]);
  selectedReasoningLevel = signal<'low' | 'medium' | 'high'>('medium');

  get isSendButtonDisabled(): boolean { return this.messageValue().trim().length === 0; }

  get modelSelectOptions() {
    return this.availableModels.map(m => ({ value: m.id, label: m.display_name, icon: '' }));
  }

  get reasoningLevelSelectOptions() {
    return [
      { value: 'low', label: 'Faible', icon: '' },
      { value: 'medium', label: 'Moyen', icon: '' },
      { value: 'high', label: 'Élevé', icon: '' }
    ];
  }

  onModelSelect(modelId: string): void {
    const model = this.availableModels.find(m => m.id === modelId);
    if (model) this.selectedModel.set(model);
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
