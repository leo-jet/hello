import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../../../components/select/select.component';
import { InputFieldComponent } from '../../../components/input-field/input-field.component';
import { IconButtonComponent } from '../../../components/icon-button/icon-button.component';
import { LlmModel } from '@app/models';


export interface ChatModeInfo {
  mode: string | null;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-main-chat-input',
  imports: [CommonModule, SelectComponent, InputFieldComponent, IconButtonComponent],
  templateUrl: './main-chat-input.component.html',
  styleUrl: './main-chat-input.component.css'
})
export class MainChatInputComponent {
  currentChatModeInfo = input<ChatModeInfo | null>(null);
  chatModeSelectOptions = input<any[]>([]);
  modelSelectOptions = input<any[]>([]);
  selectedChatMode = input<string | null>(null);
  selectedModel = input<LlmModel | null>(null);
  selectedReasoningLevel = input<string>('medium');
  isSendButtonDisabled = input<boolean>(true);

  chatModeSelect = output<string>();
  modelSelect = output<LlmModel>();
  reasoningLevelSelect = output<string>();
  inputChange = output<string>();
  attachClick = output<void>();
  microphoneClick = output<void>();
  sendMessage = output<void>();

  // Computed: afficher le sélecteur de raisonnement si le modèle a cette capacité
  hasReasoning = computed(() => {
    const model = this.selectedModel();
    return model?.has_reasoning === true;
  });

  // Computed: options de niveau de raisonnement depuis le modèle sélectionné
  reasoningLevelSelectOptions = computed(() => {
    const model = this.selectedModel();
    if (!model || !model.has_reasoning || !model.reasoning_level) {
      return [];
    }

    return model.reasoning_level
  });


  onChatModeSelect(event: any) {
    this.chatModeSelect.emit(event.value);
  }

  onModelSelect(model: any) {
    this.modelSelect.emit(model as LlmModel);
  }

  onReasoningLevelSelect(event: any) {
    this.reasoningLevelSelect.emit(event.value);
  }

  onInputChange(value: string | FileList | File | null) {
    if (typeof value === 'string') {
      this.inputChange.emit(value);
    }
  }

  onAttachClick() {
    this.attachClick.emit();
  }

  onMicrophoneClick() {
    this.microphoneClick.emit();
  }

  onSendMessage() {
    this.sendMessage.emit();
  }
}
